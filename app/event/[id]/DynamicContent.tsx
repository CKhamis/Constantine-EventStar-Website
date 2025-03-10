'use client'

import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import Image from "next/image";
import axios from "axios";
import {EVResponse} from "@/app/api/events/view/[id]/route";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {CalendarPlus, Check, Clock, House, LetterText, MapPin, Pencil, View, X} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {rsvpSchema} from "@/components/ValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import AvatarIcon from "@/components/AvatarIcon";

export interface Props {
    eventId: string,
    userId: string,
}

type rsvp = {
    response: string,
    user: {
        email: string,
        name: string,
        image: string
        id: string,
    }
}

export default function DynamicContent({eventId, userId}: Props) {
    const [loading, setLoading] = useState(true);
    const [RSVP, setRSVP] = useState<rsvp | null>();
    const [eventInfo, setEventInfo] = useState<EVResponse | null>();
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function refresh(){
        setLoading(true);
        await axios.get("/api/events/view/" + eventId)
            .then((response) => {
                // Event exists, but need to know if user was invited
                setEventInfo(response.data);
                document.querySelector("#background")!.style.background = response.data.backgroundStyle;

                const invitedUser = response.data.RSVP.find((r: rsvp) => r.user.id === userId);

                if(invitedUser){
                    // user is invited
                    setRSVP(invitedUser);
                    form.setValue("response", invitedUser.response)
                }
            })
            .catch((error) => {
                console.log(error.status); // event not found, access denied, or need login
                document.querySelector("#background")!.style.background = "black";
            });
        setLoading(false);
    }

    async function onSubmit(data: z.infer<typeof rsvpSchema>) {
        setSubmitStatus('loading')
        try {
            await axios.post(`/api/events/rsvp/${eventId}`, {response: data.response})
            setSubmitStatus('success')
        } catch (e) {
            console.log(e);
            setSubmitStatus('error')
        } finally {
            refresh();
        }
    }

    const form = useForm<z.infer<typeof rsvpSchema>>({
        resolver: zodResolver(rsvpSchema),
        defaultValues: {
            response: undefined,
        },
    })

    useEffect(() => {
        refresh()
    }, []);

    return (
        <>
            {loading && <LoadingIcon/>}
            <div className="w-100 lg:h-screen grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 lg:h-100 lg:overflow-y-scroll lg:flex flex-col">
                    <div className="top-left-gradient">
                        <div className="container flex-col flex gap-3 py-3 max-w-5xl">
                            <div className="flex flex-row justify-start items-center gap-3 ">
                                <Image src="/icons/Events.svg" alt="Event icon" width={50} height={50}/>
                                <p className="text-3xl font-bold">Event Details</p>
                            </div>
                        </div>
                    </div>
                    <div id="background" className="flex-grow flex flex-col">
                        <div className="glass-dark w-100 flex-grow">
                            <div className="container flex-col flex gap-3 py-3 max-w-5xl">
                                {eventInfo ? (
                                    <>
                                        <div className="flex flex-row justify-between items-center mt-4">
                                            <p className="font-bold text-4xl">{eventInfo.title}</p>
                                            <div className="flex flex-row items-center justify-end gap-3">
                                                {userId === eventInfo.author.id? (
                                                    <Link target="_blank" href={`/newEvent/${eventInfo.id}`}>
                                                        <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                                                            <Pencil/>
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <></>
                                                )}
                                                <Link target="_blank"
                                                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventInfo.title)}&dates=${encodeURIComponent(format(new Date(eventInfo.eventStart), "yyyyMMdd'T'HHmmss") + '/' + format(new Date(eventInfo.eventEnd), "yyyyMMdd'T'HHmmss"))}&details=${encodeURIComponent(eventInfo.description)}&location=${encodeURIComponent(eventInfo.address)}`}>
                                                    <Button variant="outline"
                                                            className="flex items-center justify-center gap-2 w-full">
                                                        <CalendarPlus/>
                                                        Add to Calendar
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start gap-4">
                                            <Badge variant="secondary">{eventInfo.eventType}</Badge>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-3">
                                            <div>
                                                <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                    <House className="h-5 w-5"/>
                                                    <p>Event Host</p>
                                                </div>
                                                <div className="flex flex-row items-center justify-start gap-2 mt-2">
                                                    <AvatarIcon image={eventInfo.author.image}
                                                                name={eventInfo.author.name} size="xsmall"/>
                                                    <p className="text-muted-foreground">{eventInfo.author.name}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                    <Clock className="h-5 w-5"/>
                                                    <p>Date / Time</p>
                                                </div>
                                                <p className="text-muted-foreground">{format(eventInfo.eventStart, "MM/dd/yyyy h:mm a")} - {format(eventInfo.eventEnd, "MM/dd/yyyy h:mm a")}</p>
                                            </div>

                                            <div>
                                                <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                    <MapPin className="h-5 w-5"/>
                                                    <p>Location</p>
                                                </div>
                                                <p className="text-muted-foreground">{eventInfo.address ? eventInfo.address : "None provided"}</p>
                                            </div>

                                            <div>
                                                <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                    <View className="h-5 w-5"/>
                                                    <p>Event Visibility</p>
                                                </div>
                                                <p className="text-muted-foreground">{eventInfo.inviteVisibility}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                <LetterText className="h-5 w-5"/>
                                                <p>Description</p>
                                            </div>
                                            <p className="text-muted-foreground">{eventInfo.description ? eventInfo.description : "No description provided"}</p>
                                        </div>
                                    </>

                                ) : (
                                    <div className="w-100 h-100 flex justify-center flex-col items-center">
                                        <Image src="/agent/empty.png" height={200} width={200} alt="" className="mt-10" />
                                        <p className="font-bold text-3xl mb-5">Event not found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-100 border-l-2 white-gradient">
                    <div className="border-b-2 w-100 p-5">
                        <div className="max-w-xl mx-auto">
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-2xl font-bold">RSVP Status</p>
                                {eventInfo && eventInfo.RSVP.find((r) => r.user.id === userId)? (eventInfo.RSVP.find((r) => r.user.id === userId)?.response !== "NO_RESPONSE"? (
                                    <Badge variant="outline">Answered</Badge>

                                ) : (
                                    <Badge variant="destructive">Unanswered</Badge>

                                )) : (
                                    <></>
                                )}
                            </div>
                            {RSVP && eventInfo ? (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                                        <FormField
                                            control={form.control}
                                            name="response"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} value={field.value}
                                                            disabled={new Date(eventInfo.rsvpDuedate) < new Date()}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select your RSVP status"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="YES">Yes</SelectItem>
                                                            <SelectItem value="NO">No</SelectItem>
                                                            <SelectItem value="MAYBE">Maybe</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <p className="text-muted-foreground text-sm">{new Date(eventInfo.rsvpDuedate) < new Date() ? `too late to respond` : `Respond by ${format(new Date(eventInfo.rsvpDuedate), 'PPP hh:mm a')}`}</p>
                                        <div className="flex flex-row gap-4 items-center justify-start">
                                            <Button type="submit" disabled={submitStatus === 'loading' || new Date(eventInfo.rsvpDuedate) < new Date()}>
                                                {submitStatus === 'loading' ? 'Submitting...' : 'Save'}
                                            </Button>

                                            {submitStatus === 'success' && (
                                                <Check className="h-4 w-4 text-green-500"/>
                                            )}
                                            {submitStatus === 'error' && (
                                                <X className="h-4 w-4 text-red-500"/>
                                            )}
                                        </div>
                                    </form>
                                </Form>
                            ) : (
                                <div className="flex flex-col gap-5 mt-5">
                                    <p>Please log in with an invited EventStar account to RSVP to this event!</p>
                                    <Link href="/api/auth/signin">
                                        <Button size="sm">
                                            Log in
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="border-b-2 w-100 p-5">
                        <div className="max-w-xl mx-auto">
                            <p className="text-2xl font-bold">Guest List</p>
                            {eventInfo? (
                                <>
                                    <Tabs defaultValue="yes" className="w-full mt-6">
                                        <TabsList className="grid w-full grid-cols-4">
                                            <TabsTrigger value="yes">Coming</TabsTrigger>
                                            <TabsTrigger value="no">Not Coming</TabsTrigger>
                                            <TabsTrigger value="maybe">Tentative</TabsTrigger>
                                            <TabsTrigger value="no_response">No Reply</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="yes">
                                            {eventInfo.RSVP.filter((rsvp) => rsvp.response === "YES").map(rsvp => (
                                                <div
                                                    className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer"
                                                    key={rsvp.user.id}>
                                                    <AvatarIcon name={rsvp.user.name} image={rsvp.user.image}/>
                                                    <div>
                                                        <p className="text-sm font-medium leading-none">{rsvp.user.name}</p>
                                                        <p className="text-sm text-muted-foreground">{rsvp.user.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {eventInfo.RSVP.filter((r) => r.response === "YES").length === 0 ? (
                                                <p className="text-center mt-9 mb-6 font-bold">None confirmed</p>
                                            ) : (<></>)}
                                        </TabsContent>
                                        <TabsContent value="no">
                                            {eventInfo.RSVP.filter((rsvp) => rsvp.response === "NO").map(rsvp => (
                                                <div
                                                    className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer"
                                                    key={rsvp.user.id}>
                                                    <AvatarIcon name={rsvp.user.name} image={rsvp.user.image}/>
                                                    <div>
                                                        <p className="text-sm font-medium leading-none">{rsvp.user.name}</p>
                                                        <p className="text-sm text-muted-foreground">{rsvp.user.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {eventInfo.RSVP.filter((r) => r.response === "NO").length === 0 ? (
                                                <p className="text-center mt-9 mb-6 font-bold">None</p>
                                            ) : (<></>)}
                                        </TabsContent>
                                        <TabsContent value="maybe">
                                            {eventInfo.RSVP.filter((rsvp) => rsvp.response === "MAYBE").map(rsvp => (
                                                <div
                                                    className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer"
                                                    key={rsvp.user.id}>
                                                    <AvatarIcon name={rsvp.user.name} image={rsvp.user.image}/>
                                                    <div>
                                                        <p className="text-sm font-medium leading-none">{rsvp.user.name}</p>
                                                        <p className="text-sm text-muted-foreground">{rsvp.user.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {eventInfo.RSVP.filter((r) => r.response === "MAYBE").length === 0 ? (
                                                <p className="text-center mt-9 mb-6 font-bold">None</p>
                                            ) : (<></>)}
                                        </TabsContent>
                                        <TabsContent value="no_response">
                                            {eventInfo.RSVP.filter((rsvp) => rsvp.response === "NO_RESPONSE").map(rsvp => (
                                                <div
                                                    className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer"
                                                    key={rsvp.user.id}>
                                                    <AvatarIcon name={rsvp.user.name} image={rsvp.user.image}/>
                                                    <div>
                                                        <p className="text-sm font-medium leading-none">{rsvp.user.name}</p>
                                                        <p className="text-sm text-muted-foreground">{rsvp.user.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {eventInfo.RSVP.filter((r) => r.response === "NO_RESPONSE").length === 0 ? (
                                                <p className="text-center mt-9 mb-6 font-bold">Everyone has
                                                    responded</p>
                                            ) : (<></>)}
                                        </TabsContent>
                                    </Tabs>
                                    <p className="text-xs text-muted-foreground mt-3">{eventInfo.RSVP.length} total guests
                                        invited, {eventInfo.RSVP.filter((r) => r.response === "YES").length} others confirmed will be going, waiting
                                        for {eventInfo.RSVP.filter((r) => r.response === "NO_RESPONSE").length} to respond</p>
                                </>
                            ) : (
                                <p>None</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}