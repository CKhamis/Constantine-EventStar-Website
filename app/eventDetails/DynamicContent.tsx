"use client"
import Image from "next/image"
import { LoadingIcon } from "@/components/LoadingIcon"
import { useEffect, useState } from "react"
import { rsvpSchema, saveEventSchema } from "@/components/ValidationSchemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { GradientPicker } from "@/components/ui/GradientPicker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon, Check, ChevronsUpDown, Loader2, X } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { TimestampPicker } from "@/components/ui/timestamp-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EventInviteVisibility, EventType } from "@prisma/client"
import axios from "axios"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"
import dynamic from "next/dynamic"
import * as commands from "@uiw/react-md-editor"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import type { EVResponse } from "@/app/api/events/view/[id]/route"
import ExcludedInvite from "@/app/eventDetails/ExcludedInvite"
import { refresh } from "effect/Resource"
import IncludedInvite from "@/app/eventDetails/IncludedInvite"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export interface Props {
    eventId: string | null
    userId: string | undefined | null
}

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

export default function DynamicContent({ eventId, userId }: Props) {
    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const router = useRouter()
    const [eventInfo, setEventInfo] = useState<EVResponse | null>(null)
    const [writeInStatus, setWriteInStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

    const currentEventId = eventInfo?.id ?? eventId

    const [followers, setFollowers] = useState<
        { id: string; name: string; email: string; image: string; phoneNumber: string }[]
    >([]) // Included & Excluded

    useEffect(() => {
        refresh()
    }, [])

    function refresh() {
        if (currentEventId) {
            fetchEvent(currentEventId)
            getFollowers()
        }
    }

    async function getFollowers() {
        try {
            setLoading(true)
            const response = await axios.get("/api/user/info")
            setFollowers(response.data.followedBy)
            setLoading(false)
        } catch (err) {
            toast("Catastrophic Error", { description: "Unable to fetch followers" })
            console.error("Error fetching users:", err)
            setLoading(false)
        }
    }

    const form = useForm<z.infer<typeof saveEventSchema>>({
        resolver: zodResolver(saveEventSchema),
        defaultValues: {
            id: "",
            title: "New Event",
            backgroundStyle: "#000",
            address: "",
            eventStart: new Date(),
            eventEnd: new Date(),
            rsvpDuedate: new Date(),
            description: "",
            inviteVisibility: "NONE",
            maxGuests: 0,
            eventType: "GENERAL_EVENT",
        },
    })

    const writeInForm = useForm<z.infer<typeof rsvpSchema>>({
        resolver: zodResolver(rsvpSchema),
        defaultValues: {
            response: undefined,
            guests: 0,
            firstName: "",
            lastName: "",
        },
    })

    async function fetchEvent(eventId: string) {
        try {
            setLoading(true)
            await axios.get("/api/events/view/" + eventId).then((response) => {
                if (!userId || (userId && response.data.author.id !== userId)) {
                    router.replace("/event/" + eventId)
                }
                setEventInfo(response.data)

                form.setValue("id", response.data.id)
                form.setValue("title", response.data.title)
                form.setValue("backgroundStyle", response.data.backgroundStyle)
                form.setValue("address", response.data.address)
                form.setValue("eventStart", new Date(response.data.eventStart))
                form.setValue("eventEnd", new Date(response.data.eventEnd))
                form.setValue("rsvpDuedate", new Date(response.data.rsvpDuedate))
                form.setValue("description", response.data.description)
                form.setValue("inviteVisibility", response.data.inviteVisibility)
                form.setValue("eventType", response.data.eventType)
                form.setValue("maxGuests", response.data.maxGuests)

                setEditing(true)
            })
        } catch (e) {
            console.log(e)
            toast("Catastrophic Error", { description: "Unable to find event" })
        } finally {
            setLoading(false)
        }
    }

    async function onSubmit(values: z.infer<typeof saveEventSchema>) {
        try {
            setLoading(true)
            const response = await axios.post("/api/events/save", values)
            toast("Event Saved", { description: "Event saved to your account" })
            form.setValue("id", response.data.id)
            setEventInfo(response.data)
            setEditing(true)
            getFollowers()
        } catch (e) {
            console.log(e)
            toast("Catastrophic Error", { description: "Unable to save event" })
        } finally {
            setLoading(false)
        }
    }

    async function deleteRSVP(RSVPid: string) {
        try {
            await axios
                .post("/api/events/authorControl/removeRSVP/" + currentEventId, { id: RSVPid })
                .then((r: { data: string }) => {
                    toast("RSVP Deleted", { description: r.data })
                })
                .catch((r: { response: { data: { error?: string; message?: string } | string } }) => {
                    const errorMessage =
                        typeof r.response.data === "string"
                            ? r.response.data
                            : r.response.data.error || r.response.data.message || "Unknown error"

                    toast("Error", { description: errorMessage })
                })
        } catch (e) {
            console.log(e)
        } finally {
            refresh()
        }
    }

    async function overwriteRSVP(id: string, response: string, guestOverride: number) {
        try {
            await axios
                .post("/api/events/authorControl/changeRSVP/" + currentEventId, {
                    response: response,
                    id: id,
                    guests: guestOverride,
                })
                .then((r: { data: string }) => {
                    toast("RSVP Overwritten", { description: r.data })
                })
                .catch((r: { response: { data: string } }) => {
                    toast("Error", { description: r.response.data })
                })
        } catch (e) {
            console.log(e)
        } finally {
            refresh()
        }
    }

    async function createWriteInRSVP(data: z.infer<typeof rsvpSchema>) {
        setWriteInStatus("loading")
        try {
            await axios.post("/api/events/authorControl/addRSVP/" + currentEventId, {
                response: data.response,
                guests: data.guests,
                firstName: data.firstName,
                lastName: data.lastName,
            })
            setWriteInStatus("success")
        } catch (e) {
            console.log(e)
            setWriteInStatus("error")
        } finally {
            refresh()
        }
    }

    async function addRSVP(userId: string) {
        try {
            await axios.post(`/api/events/authorControl/addRSVP/${currentEventId}`, {
                userId: userId,
                response: "NO_RESPONSE",
                guests: 0,
            })
            toast("RSVP Added", { description: "Default values specified." })
        } catch (e) {
            console.log(e)
            toast("Adding RSVP Failed", {
                description: "There was an error with adding RSVP. Check the console for more info.",
            })
        } finally {
            refresh()
        }
    }

    return (
        <>
            {loading && <LoadingIcon />}
            <div className="w-100 lg:h-screen grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 lg:h-100 lg:overflow-y-scroll lg:flex flex-col">
                    <div className="top-left-gradient">
                        <div className="container flex-col flex gap-3 py-3 max-w-3xl">
                            <div className="flex flex-row justify-start items-center gap-3 ">
                                <Image src="/icons/NewEvent.svg" alt="New Event" width={50} height={50} />
                                <p className="text-3xl font-bold">{editing ? "Edit Event" : "Create New Event"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="container flex-col flex gap-3 py-3 max-w-3xl mt-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Event title" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mt-6">
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123 Terence Street" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maxGuests"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Max +1s per guest</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                                        value={field.value || 0}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mt-6">
                                    <FormField
                                        control={form.control}
                                        name="rsvpDuedate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-start">
                                                <FormLabel>RSVP Due Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "justify-start text-left font-normal w-full",
                                                                !field.value && "text-muted-foreground",
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? format(field.value, "PPP hh:mm a") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => date < new Date()}
                                                            initialFocus
                                                        />
                                                        <div className="p-3 border-t border-border">
                                                            <TimestampPicker setDate={field.onChange} date={field.value} />
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="eventStart"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-start">
                                                <FormLabel>Event Start</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground",
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? format(field.value, "PPP hh:mm a") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => date < new Date()}
                                                            initialFocus
                                                        />
                                                        <div className="p-3 border-t border-border">
                                                            <TimestampPicker setDate={field.onChange} date={field.value} />
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="eventEnd"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-start">
                                                <FormLabel className="mt-5 md:mt-0">Event End</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground",
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? format(field.value, "PPP hh:mm a") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => date < new Date()}
                                                            initialFocus
                                                        />
                                                        <div className="p-3 border-t border-border">
                                                            <TimestampPicker setDate={field.onChange} date={field.value} />
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mt-6">
                                    <FormField
                                        control={form.control}
                                        name="inviteVisibility"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Invite Visibility</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select invite visibility" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.values(EventInviteVisibility).map((value) => (
                                                                <SelectItem key={value} value={value}>
                                                                    {value.replace(/_/g, " ")}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="eventType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Event Type</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select event type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.values(EventType).map((value) => (
                                                                <SelectItem key={value} value={value}>
                                                                    {value.replace(/_/g, " ")}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="backgroundStyle"
                                        render={({ field }) => (
                                            <FormItem style={{ marginTop: "-8px" }}>
                                                <FormLabel>Background Style</FormLabel>
                                                <br />
                                                <FormControl>
                                                    <GradientPicker {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="mt-6">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <div>
                                                    <MDEditor
                                                        commands={[
                                                            commands.group([commands.title1, commands.title2, commands.title3, commands.title4], {
                                                                name: "Header",
                                                                groupName: "Header",
                                                                buttonProps: { "aria-label": "Insert title" },
                                                            }),
                                                            commands.bold,
                                                            commands.italic,
                                                            commands.hr,
                                                        ]}
                                                        value={field.value}
                                                        onChange={(value) => field.onChange(value || "")}
                                                        preview="edit"
                                                        height={300}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-6 mb-6"
                                    onClick={() => {
                                        console.log(form.formState)
                                        console.log(form.formState.errors)
                                    }}
                                >
                                    {loading && <Loader2 className="animate-spin" />}
                                    Save
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
                {editing ? (
                    <div className="h-100 border-l-2 white-gradient lg:h-100 lg:overflow-y-scroll flex flex-col justify-between">
                        <div>
                            <div className="container flex-col flex gap-3 py-3 max-w-3xl p-5">
                                <div className="flex flex-row justify-start items-center gap-3 h-[50]">
                                    <p className="text-2xl font-bold">Invitations</p>
                                </div>
                            </div>
                            <div className="max-w-3xl container pb-6 px-5">
                                <Tabs defaultValue="excluded" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="excluded">Add Invitees</TabsTrigger>
                                        <TabsTrigger value="included">Included</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="excluded">
                                        {followers
                                            .filter((f) => !eventInfo?.RSVP.some((r) => r.user?.id === f.id))
                                            .map((f, index) => (
                                                <ExcludedInvite
                                                    key={index}
                                                    name={f.name}
                                                    email={f.email}
                                                    image={f.image}
                                                    addInvite={() => addRSVP(f.id)}
                                                />
                                            ))}
                                    </TabsContent>
                                    <TabsContent value="included">
                                        {eventInfo?.RSVP.map((r) => (
                                            <IncludedInvite
                                                key={r.id}
                                                id={r.id}
                                                guests={r.guests}
                                                firstName={r.firstName}
                                                lastName={r.lastName}
                                                user={r.user}
                                                removeInvite={() => deleteRSVP(r.id)}
                                                response={r.response}
                                                updateInvite={overwriteRSVP}
                                            />
                                        ))}
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                        <div className="border-t-2">
                            <Collapsible className="container flex-col flex gap-3 py-3 max-w-3xl p-5">
                                <div className="flex flex-row justify-between items-center gap-3 h-[50]">
                                    <p className="text-2xl font-bold">Manual Write-Ins</p>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <ChevronsUpDown />
                                            <span className="sr-only">Toggle</span>
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>

                                <CollapsibleContent>
                                    <Form {...writeInForm}>
                                        <form onSubmit={writeInForm.handleSubmit(createWriteInRSVP)} className="space-y-6">
                                            <FormField
                                                control={writeInForm.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>First Name</FormLabel>
                                                        <FormControl>
                                                            <Input type="text" placeholder="Enter first name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={writeInForm.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Last Name</FormLabel>
                                                        <FormControl>
                                                            <Input type="text" placeholder="Enter last name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={writeInForm.control}
                                                name="response"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Attendance</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select RSVP status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="YES">Yes</SelectItem>
                                                                <SelectItem value="NO">No</SelectItem>
                                                                <SelectItem value="MAYBE">Maybe</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={writeInForm.control}
                                                name="guests"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>+1s</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                placeholder="0"
                                                                {...field}
                                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                                                value={field.value || 0}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="flex flex-row gap-4 items-center justify-start">
                                                <Button type="submit" disabled={writeInStatus === "loading"}>
                                                    {writeInStatus === "loading" ? "Submitting..." : "Save"}
                                                </Button>
                                                {writeInStatus === "success" && <Check className="h-4 w-4 text-green-500" />}
                                                {writeInStatus === "error" && <X className="h-4 w-4 text-red-500" />}
                                            </div>
                                        </form>
                                    </Form>
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    </div>
                ) : (
                    <div className="h-100 border-l-2 white-gradient lg:h-100 lg:overflow-y-scroll flex flex-col justify-start">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/agent/loading.gif" className="w-1/2 my-7 mx-auto" alt="EventStar typing" />

                        <div className="container flex-col flex gap-3 pt-3 max-w-3xl px-5">
                            <div className="flex flex-row justify-start items-center gap-3 h-[50]">
                                <p className="text-2xl font-bold">Add Event Details</p>
                            </div>
                        </div>

                        <div className="container flex-col flex gap-3 py-3 max-w-3xl p-5">
                            <p>
                                First step is to create an event. Fill in the event name, start & end times, description, and other
                                details you want to let your guests know.
                            </p>
                            <p>
                                While you can type a simple sentence for the description, you can also insert Markdown text to format
                                and beautify your event information. You can even add images, links, and bullet points!
                            </p>
                            <p>
                                Then, choose the invite visibility. None makes an event only visible to yourself, invited only makes
                                events only visible to the EventStar users you choose, and full makes it open to anybody including
                                Write-In guests.
                            </p>
                            <p>Write-In guests are able to fill in their name, attendance, and +1s they are bringing with them.</p>
                            <p>When you are finished creating your event, you can move onto adding guests to your event!</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
