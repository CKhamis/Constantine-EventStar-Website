'use client'

import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import Image from "next/image";
import axios from "axios";
import {EVResponse} from "@/app/api/events/view/[id]/route";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {
	CalendarPlus,
	Car,
	Check,
	Clock,
	House,
	LetterText,
	MapPin,
	Pencil,
	View,
	X
} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {rsvpSchema} from "@/components/ValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import AvatarIcon from "@/components/AvatarIcon";
import Markdown from 'react-markdown'
import {userInfoResponse} from "@/app/api/user/info/route";
import {Input} from "@/components/ui/input";
import { useCookies } from 'react-cookie';
import {GuestPopup} from "@/components/tutorials/guests/guests";
import GuestList from "@/app/event/[id]/GuestList";
import {Sus} from "@/app/event/[id]/Sus";
import { stringSimilarity } from "string-similarity-js";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import RsvpForm from "@/app/event/RsvpForm";

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
    const [userInfo, setUserInfo] = useState<userInfoResponse | null>(null);
    const [cookies, setCookie, removeCookie] = useCookies(['guestsTutorial']);

	const [pendingSubmit, setPendingSubmit] = useState<z.infer<typeof rsvpSchema> | null>(null);
	const [writeWarning, setWriteWarning] = useState(false);

	function WICheck(data: z.infer<typeof rsvpSchema>) {
		// Only intercept write-in guests that
		if (!userId && eventInfo?.inviteVisibility === "FULL") {
			const enteredName = `${data.firstName} ${data.lastName}`.toLowerCase();

			const suspiciousMatch = eventInfo.RSVP.some((r) => {
				// Only check invited accounts. Similar write-ins don't matter.
				const existingName = `${r.user?.name ?? ""}`.toLowerCase();
				// console.log(`${enteredName.toLowerCase()} ${existingName.toLowerCase()} ${stringSimilarity(enteredName.toLowerCase(), existingName.toLowerCase())}`);
				return stringSimilarity(enteredName.toLowerCase(), existingName.toLowerCase()) > 0.85;
			});

			if (suspiciousMatch) {
				setPendingSubmit(data);
				setWriteWarning(true);
				return;
			}
		}

		// No match → submit immediately
		submitForm(data);
	}


	function closeGuestTutorial(){
        setCookie("guestsTutorial", false);
    }

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
                    form.setValue("guests", invitedUser.guests)
                }
            })
            .catch((error) => {
                console.log(error.status); // event not found, access denied, or need login
                document.querySelector("#background")!.style.background = "black";
            });

        await axios.get("/api/user/info")
            .then((response) => {
                setUserInfo(response.data);
            })
            .catch((error) => {
                console.log(error);
                setUserInfo(null);
            });

        setLoading(false);
    }

    async function submitForm(data: z.infer<typeof rsvpSchema>) {
        setSubmitStatus('loading')
        try {
            await axios.post(`/api/events/rsvp/${eventId}`, {response: data.response, guests: data.guests, firstName: data.firstName, lastName: data.lastName})
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
            guests: 0,
            firstName: "",
            lastName: "",
        },
    })

    useEffect(() => {
        refresh()
    }, []);

    return (
        <>
            {loading && <LoadingIcon/>}
	        <Sus open={writeWarning} onOpenChanged={setWriteWarning} eventId={eventId} submitAnyway={() => {
		        if (pendingSubmit){
			        submitForm(pendingSubmit);
			        setPendingSubmit(null);
					setWriteWarning(false);
		        }

	        }} />
            {cookies.guestsTutorial !== false && (
                <GuestPopup setOpen={closeGuestTutorial} />
            )}
            <div className="w-full lg:h-full flex flex-col lg:flex-row gap-0 p-0 lg:overflow-y-auto">
                <div className="lg:w-[75%] lg:h-full lg:overflow-y-auto lg:flex flex-col">
                    <div className="top-left-gradient border-b-2 border-[#451942]">
                        <div className="container flex-col flex gap-3 py-3 max-w-5xl">
                            <div className="flex flex-row justify-start items-center gap-3 ">
                                <Image src="/icons/Events.svg" alt="Event icon" width={40} height={40}/>
                                <p className="text-3xl font-bold">Event Details</p>
                            </div>
                        </div>
                    </div>
                    <div id="background" className="flex-grow flex flex-col">
                        <div className="glass-dark w-100 flex-grow">
                            <div className="container flex-col flex gap-3 py-3 max-w-xl lg:max-w-5xl">
                                {eventInfo ? (
                                    <>
                                        <div className="flex flex-col lg:flex-row justify-between items-center mb-4 lg:mb-0 mt-4">
                                            <p className="font-bold text-4xl">{eventInfo.title}</p>
                                            <div className="flex flex-row items-center justify-end gap-3 mt-5 lg:m-0">
	                                            <div className="lg:hidden">
		                                            <Drawer repositionInputs={false}>
			                                            <DrawerTrigger asChild>
				                                            {eventInfo && (
					                                            (() => {
						                                            const rsvp = userId ? eventInfo.RSVP.find((r) => r.user && r.user.id === userId) : null;

						                                            if (!rsvp) return <Button variant="default" className="flex items-center justify-center gap-2 w-full"><Car/> RSVP</Button>;

						                                            return rsvp.response !== "NO_RESPONSE" ? (
							                                            <Button variant="outline" className="flex items-center justify-center gap-2 w-full"><Car/> RSVP</Button>
						                                            ) : (
							                                            <Button variant="default" className="flex items-center justify-center gap-2 w-full"><Car/> RSVP</Button>
						                                            );
					                                            })()
				                                            )}
			                                            </DrawerTrigger>			                                            <DrawerContent>
				                                            <DrawerHeader>
					                                            <DrawerTitle>Are You Able to Attend?</DrawerTitle>
					                                            <DrawerDescription>Make sure to press Save when you&#39;re done!</DrawerDescription>
				                                            </DrawerHeader>
				                                            <DrawerFooter className="pb-20">
					                                            <RsvpForm
						                                            eventInfo={eventInfo}
						                                            userId={userId}
						                                            eventId={eventId}
						                                            form={form}
						                                            submitStatus={submitStatus}
						                                            onWriteInSubmit={WICheck}
						                                            onSubmit={submitForm}
					                                            />
					                                            {/*<DrawerClose>*/}
					                                            {/*    <Button variant="outline">Cancel</Button>*/}
					                                            {/*</DrawerClose>*/}
				                                            </DrawerFooter>
			                                            </DrawerContent>
		                                            </Drawer>
	                                            </div>

                                                {userId === eventInfo.author.id? (
                                                    <Link target="_blank" href={`/eventDetails/${eventInfo.id}`}>
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
                                        <div className="mt-3 overflow-x-hidden markdown">
                                            <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                <LetterText className="h-5 w-5"/>
                                                <p>Description</p>
                                            </div>
                                            <Markdown>{eventInfo.description}</Markdown>
                                            {/*<MarkdownDisplay className="h-auto overflow-visible" value={eventInfo.description} preview="preview" hideToolbar={true} />*/}
                                            {/*<p className="text-muted-foreground">{eventInfo.description ? eventInfo.description : "No description provided"}</p>*/}
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
                <div className="border-t-2 lg:border-t-0 border-l-2 white-gradient lg:h-full lg:overflow-y-auto lg:flex-grow">
                    <div className="border-b-2 w-full p-5 hidden lg:block">
                        <div className="max-w-xl mx-auto">
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-2xl font-bold" id="rsvp">RSVP Status {!userId? "(Write-In)" : ""}</p>
                                {eventInfo && userId && (
                                    (() => {
                                        const rsvp = eventInfo.RSVP.find((r) => r.user && r.user.id === userId);
                                        if (!rsvp) return null;

                                        return rsvp.response !== "NO_RESPONSE" ? (
                                            <Badge variant="outline">Answered</Badge>
                                        ) : (
                                            <Badge variant="destructive">Unanswered</Badge>
                                        );
                                    })()
                                )}
                            </div>
	                        <RsvpForm
		                        eventInfo={eventInfo}
		                        userId={userId}
		                        eventId={eventId}
		                        form={form}
		                        submitStatus={submitStatus}
		                        onWriteInSubmit={WICheck}
		                        onSubmit={submitForm}
	                        />
                        </div>
                    </div>
                    <div className="border-b-2 w-full p-5">
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
                                            <GuestList RSVPs={eventInfo.RSVP} response="YES" authorId={eventInfo.author.id} viewerId={userId} following={userInfo?.following} action={refresh} maxGuests={eventInfo.maxGuests} eventId={eventInfo.id} />
                                            {eventInfo.RSVP.filter((r) => r.response === "YES").length === 0 ? (
                                                <p className="text-center mt-9 mb-6 font-bold">None confirmed</p>
                                            ) : (<></>)}
                                        </TabsContent>
                                        <TabsContent value="no">
                                            <GuestList RSVPs={eventInfo.RSVP} response="NO" authorId={eventInfo.author.id} viewerId={userId} following={userInfo?.following} action={refresh} maxGuests={eventInfo.maxGuests} eventId={eventInfo.id} />
                                            {eventInfo.RSVP.filter((r) => r.response === "NO").length === 0 ? (
                                                <p className="text-center mt-9 mb-6 font-bold">None</p>
                                            ) : (<></>)}
                                        </TabsContent>
                                        <TabsContent value="maybe">
                                            <GuestList RSVPs={eventInfo.RSVP} response="MAYBE" authorId={eventInfo.author.id} viewerId={userId} following={userInfo?.following} action={refresh} maxGuests={eventInfo.maxGuests} eventId={eventInfo.id} />
                                            {eventInfo.RSVP.filter((r) => r.response === "MAYBE").length === 0 ? (
                                                <p className="text-center mt-9 mb-6 font-bold">None</p>
                                            ) : (<></>)}
                                        </TabsContent>
                                        <TabsContent value="no_response">
                                            <GuestList RSVPs={eventInfo.RSVP} response="NO_RESPONSE" authorId={eventInfo.author.id} viewerId={userId} following={userInfo?.following} action={refresh} maxGuests={eventInfo.maxGuests} eventId={eventInfo.id} />
                                            {eventInfo.RSVP.filter((r) => r.response === "NO_RESPONSE").length === 0 ? (
                                                <p className="text-center mt-9 mb-6 font-bold">Everyone has
                                                    responded</p>
                                            ) : (<></>)}
                                        </TabsContent>
                                    </Tabs>
                                    <p className="text-xs text-muted-foreground mt-3">{eventInfo.RSVP.length} total guests
                                        invited, {eventInfo.RSVP
                                            .filter((r) => r.response === "YES")
                                            .reduce((accumulator, currentValue) => accumulator + currentValue.guests + 1, 0)} confirmed will be going, waiting
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