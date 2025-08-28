'use client'
import Image from "next/image";
import {LoadingIcon} from "@/components/LoadingIcon";
import {useEffect, useState} from "react";
import {saveEventSchema} from "@/components/ValidationSchemas";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import AlertList, {alertContent} from "@/components/AlertList";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {GradientPicker} from "@/components/ui/GradientPicker";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {CalendarIcon, Loader2} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {TimestampPicker} from "@/components/ui/timestamp-picker";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EventInviteVisibility, EventType} from "@prisma/client";
import axios from "axios";
import UserSelect from "@/components/UserSelect";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import * as commands from "@uiw/react-md-editor"
import {useRouter} from "next/navigation";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export interface Props {
    eventId: string | null,
    userId: string | undefined | null
}

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

export default function DynamicContent({ eventId, userId }: Props) {
    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const [initialRSVP, setInitialRSVP] = useState<string[]>([])
    const [alertMessages, setAlertMessages] = useState<alertContent[]>([])
    const router = useRouter();

    useEffect(() => {
        if (eventId) {
            fetchEvent(eventId)
        }
    }, [])

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
            RSVP: [],
        },
    })

    async function fetchEvent(eventId: string) {
        try {
            setLoading(true)
            const response = await axios.get("/api/events/view/" + eventId)

            if(!userId || (userId && response.data.author.id !== userId)){
                router.replace("/event/" + eventId);
            }

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
            form.setValue(
                "RSVP",
                response.data.RSVP.map((r: { user: { id: string } }) => r.user.id),
            )
            setInitialRSVP(response.data.RSVP.map((r: { user: { id: string } }) => r.user.id))

            setEditing(true)
        } catch (e) {
            console.log(e)
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to find event", icon: 2 }])
        } finally {
            setLoading(false)
        }
    }

    const eventTypeOptions = Object.values(EventType).map((value) => ({
        label: value.replace(/_/g, " "),
        value,
    }))
    const inviteVisibilityOptions = Object.values(EventInviteVisibility).map((value) => ({
        label: value.replace(/_/g, " "),
        value,
    }))

    async function onSubmit(values: z.infer<typeof saveEventSchema>) {
        try {
            setLoading(true)
            const response = await axios.post("/api/events/save", values)
            setAlertMessages([...alertMessages, { title: "Event Saved", message: "Event saved to your account", icon: 1 }])
            form.setValue("id", response.data.id)
            setEditing(true)
        } catch (e) {
            console.log(e)
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to save event", icon: 2 }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {loading && <LoadingIcon />}
                <div className="w-100 lg:h-screen grid grid-cols-1 lg:grid-cols-3">
                    <div className="lg:col-span-2 lg:h-100 lg:overflow-y-scroll lg:flex flex-col">
                        <div className="top-left-gradient">
                            <div className="container flex-col flex gap-3 py-3 max-w-3xl">
                                <div className="flex flex-row justify-start items-center gap-3 ">
                                    <Image src="/icons/NewEvent.svg" alt="New Event" width={50} height={50}/>
                                    <p className="text-3xl font-bold">{editing ? "Edit Event" : "Create New Event"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="container flex-col flex gap-3 py-3 max-w-3xl mt-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
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
                                    render={({field}) => (
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
                                    render={({field}) => (
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
                                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                                        {field.value ? format(field.value, "PPP hh:mm a") :
                                                            <span>Pick a date</span>}
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
                                                        <TimestampPicker setDate={field.onChange} date={field.value}/>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="eventStart"
                                    render={({field}) => (
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
                                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                                        {field.value ? format(field.value, "PPP hh:mm a") :
                                                            <span>Pick a date</span>}
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
                                                        <TimestampPicker setDate={field.onChange} date={field.value}/>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="eventEnd"
                                    render={({field}) => (
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
                                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                                        {field.value ? format(field.value, "PPP hh:mm a") :
                                                            <span>Pick a date</span>}
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
                                                        <TimestampPicker setDate={field.onChange} date={field.value}/>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mt-6">
                                <FormField
                                    control={form.control}
                                    name="inviteVisibility"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Invite Visibility</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select invite visibility"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {inviteVisibilityOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
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
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Event Type</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select event type"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {eventTypeOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
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
                                    render={({field}) => (
                                        <FormItem style={{marginTop: "-8px"}}>
                                            <FormLabel>Background Style</FormLabel>
                                            <br/>
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
                                render={({field}) => (
                                    <FormItem className="mt-6">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <div>
                                                <MDEditor
                                                    commands={[
                                                        commands.group([
                                                                commands.title1,
                                                                commands.title2,
                                                                commands.title3,
                                                                commands.title4,
                                                            ],
                                                            {
                                                                name: "Header",
                                                                groupName: "Header",
                                                                buttonProps: {"aria-label": "Insert title"}
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
                                        <FormMessage/>
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
                                {loading && <Loader2 className="animate-spin"/>}
                                Save
                            </Button>
                        </div>
                    </div>
                    <div className="h-100 border-l-2 white-gradient lg:h-100 lg:overflow-y-scroll">
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
                                    1
                                </TabsContent>
                                <TabsContent value="included">
                                    2
                                </TabsContent>
                            </Tabs>
                        </div>

                    </div>
                </div>
            </form>
        </Form>
    )
}