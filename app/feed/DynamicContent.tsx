'use client'

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import AvatarIcon from "@/components/AvatarIcon";
import axios from "axios";
import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import {userInfoResponse} from "@/app/api/user/info/route";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import {FRResponse} from "@/app/api/user/connections/incoming/route";
import {EIResponse} from "@/app/api/events/invited/route";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {Check, CircleHelp, Clock, LetterText, MapPin, X} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";

export default function DynamicContent() {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<userInfoResponse>({
        createdAt: new Date(),
        discordId: "",
        email: "",
        emailVerified: null,
        followedBy: [],
        following: [],
        id: "",
        image: "",
        name: "Event Star",
        newEventEmails: true,
        phoneNumber: "",
        role: "USER",
        tutorial: false,
        updatedAt: new Date(),
        event: []
    });
    const [RSVPs, setRSVPs] = useState<EIResponse[]>([]);
    const [recievedFollows, setRecievedFollows] = useState([]);
    const [nextEvent, setNextEvent] = useState<EIResponse | null>();

    async function refresh(){
        setLoading(true);
        await axios.get("/api/user/info")
            .then((response) => {
                setUserInfo(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        await axios.get("/api/events/invited")
            .then((response) => {
                setRSVPs(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        await axios.get("/api/events/next")
            .then((response) => {
                if(response.data.message){
                    setNextEvent(null)
                }else{
                    setNextEvent(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });

        await axios.get("/api/user/connections/incoming")
            .then((response) => {
                setRecievedFollows(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        setLoading(false);
    }

    async function respondFR(response:boolean, senderId:string){
        await axios.post("/api/user/connections/respond", {response: response, senderId: senderId})
            .then(() => {
                refresh()
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function updateRSVP(eventId: string, response: string){
        setLoading(true);
        try{
            await axios.post(`/api/events/rsvp/${eventId}`, {response: response})
                .finally(refresh);
        }catch (e){
            console.log(e)
        }
    }

    useEffect(() => {
        refresh()
    }, []);

    return (
        <>
            {loading && <LoadingIcon/>}
            <div className="w-100 h-screen grid grid-cols-2 lg:grid-cols-3 gap-0 p-0">
                <div className="w-100 col-span-2 items-center overflow-y-scroll">
                    <div className="top-left-gradient">
                        <div className="container flex-col flex gap-3 py-3 max-w-3xl">
                            <div className="flex flex-row justify-start items-center gap-3 ">
                                <Image src="/icons/Feed.svg" alt="Feed icon" width={50} height={50}/>
                                <p className="text-3xl font-bold">Upcoming Events</p>
                            </div>
                        </div>
                    </div>
                    <div className="container flex-col flex gap-3 max-w-3xl mt-6">
                        {RSVPs.map((rsvp) => (
                            <Card key={rsvp.id} className="mb-4 rounded-none">
                                <CardHeader>
                                    <div className="flex flex-row items-center justify-between space-y-0 gap-2">
                                        <CardTitle className="text-2xl">{rsvp.event.title}</CardTitle>
                                        <div>
                                        <ToggleGroup type="single" variant="default" defaultValue={rsvp.response} disabled={new Date(rsvp.event.rsvpDuedate) < new Date()}>
                                                <ToggleGroupItem value="YES" aria-label="Toggle check" onClick={() => updateRSVP(rsvp.event.id, "YES")}>
                                                    <Check className="h-4 w-4"/>
                                                </ToggleGroupItem>
                                                <ToggleGroupItem value="MAYBE" aria-label="Toggle question" onClick={() => updateRSVP(rsvp.event.id, "MAYBE")}>
                                                    <CircleHelp className="h-4 w-4"/>
                                                </ToggleGroupItem>
                                                <ToggleGroupItem value="NO" aria-label="Toggle x" onClick={() => updateRSVP(rsvp.event.id, "NO")}>
                                                    <X className="h-4 w-4"/>
                                                </ToggleGroupItem>
                                            </ToggleGroup>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{format(new Date(rsvp.event.eventStart), "M/dd/yyyy hh:mm a")} - {format(new Date(rsvp.event.eventEnd), "M/dd/yyyy hh:mm a")}</p>
                                </CardHeader>
                                <CardContent>
                                    {rsvp.event.description}
                                </CardContent>
                                <CardFooter className="gap-4 flex flex-row justify-between items-start">
                                    <div className="flex flex-col justify-start gap-2">
                                        <p>Event by:</p>
                                        <div className="flex flex-row items-center justify-start gap-2">
                                            <AvatarIcon image={rsvp.event.author.image} name={rsvp.event.author.name} size="xsmall"/>
                                            <p className="font-bold">{rsvp.event.author.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center gap-2">
                                        <Link href={"/event/" + rsvp.event.id}><Button variant={new Date(rsvp.event.eventEnd) < new Date() ? "secondary" : "default"}>View Event</Button></Link>
                                        {new Date(rsvp.event.eventEnd) < new Date() ?
                                            <p className="text-muted-foreground text-xs ml-1">Event ended</p> : <></>}
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="hidden lg:flex overflow-y-scroll">
                    <div className="max-w-xl mx-auto">
                        <Card className="mt-5 rounded-none border-none">
                            <CardContent>
                                <div className="flex flex-row gap-3 justify-start items-center  p-5">
                                    <AvatarIcon size="large" image={userInfo.image} name={userInfo.name}/>
                                    <div>
                                        <p className="font-bold text-2xl">{userInfo.name}</p>
                                        <p className="text-muted-foreground">{userInfo.email}</p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3 px-0 justify-between items-center">
                                    <div className="flex flex-col items-center">
                                        <p className="text-xl font-bold text-center">{userInfo.followedBy.length}</p>
                                        <p className="text-center">Follower{userInfo.followedBy.length === 1? "" : "s"}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <p className="text-xl font-bold text-center">{userInfo.event.length}</p>
                                        <p className="text-center">Event{userInfo.event.length === 1? "" : "s"}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <p className="text-xl font-bold text-center">{userInfo.following.length}</p>
                                        <p className="text-center">Following</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {recievedFollows.length == 0? <></>: <p className="font-bold mt-6 px-0">Follow requests</p>}
                        {recievedFollows.map((followRequest:FRResponse) => (
                            <div className="flex flex-row items-center justify-between mb-3 px-0" key={followRequest.id}>
                                <div className="flex flex-row justify-start items-center mt-5 gap-3">
                                    <div>
                                        <AvatarIcon image={followRequest.sender.image} name={followRequest.sender.name} size={"small"}/>
                                    </div>
                                    <p className="font-bold text-xl">{followRequest.sender.name}</p>
                                </div>
                                <div className="flex flex-row justify-end items-center mt-5 gap-3">
                                    <Button variant="secondary" size="icon" onClick={() => respondFR(true, followRequest.sender.id)}><Check className="h-4 w-4"/></Button>
                                    <Button variant="outline" size="icon" onClick={() => respondFR(false, followRequest.sender.id)}><X className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        ))}
                        {nextEvent ?
                            <div className="col-span-3 lg:col-span-1 hidden md:block">
                                <div className="flex flex-row justify-between items-center mb-4 mt-10 px-0">
                                    <p className="font-bold">Next Event</p>
                                    {nextEvent.response === "NO_RESPONSE" ?
                                        <Badge variant="destructive">Unanswered</Badge>
                                        :
                                        <Badge variant="outline">Responded</Badge>
                                    }
                                </div>
                                <Card className="rounded-none">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                        <CardTitle className="text-2xl font-bold">{nextEvent.event.title}</CardTitle>
                                        <div className="flex flex-row gap-4">
                                            <Link href={"/event/" + nextEvent.event.id}>
                                                <Button variant="secondary">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-5">
                                            <div className="flex flex-row items-center justify-start gap-2">
                                                <AvatarIcon image={nextEvent.event.author.image} name={nextEvent.event.author.name} size="xsmall"/>
                                                <p className="font-bold">{nextEvent.event.author.name}</p>
                                            </div>

                                            <div>
                                                <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                    <Clock className="h-5 w-5"/>
                                                    <p>Date / Time</p>
                                                </div>
                                                <p className="text-muted-foreground">{format(nextEvent.event.eventStart, "MM/dd/yyyy h:mm a")} - {format(nextEvent.event.eventEnd, "MM/dd/yyyy h:mm a")}</p>
                                            </div>

                                            <div>
                                                <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                    <MapPin className="h-5 w-5"/>
                                                    <p>Location</p>
                                                </div>
                                                <p className="text-muted-foreground">{nextEvent.event.address ? nextEvent.event.address : "None provided"}</p>
                                            </div>

                                            <div>
                                                <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                    <LetterText className="h-5 w-5"/>
                                                    <p>Description</p>
                                                </div>
                                                <p className="text-muted-foreground">{nextEvent.event.description ? nextEvent.event.description : "No description provided"}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            :
                            <div className="flex-col justify-center items-center hidden md:flex">
                                <Image src="/agent/empty.png" className="mt-10" alt={"awkward"} height={150} width={150}/>
                                <p className="text-center text-2xl font-bold">No Events</p>
                                <p className="text-center text-xs text-muted-foreground w-[250px] mt-3">Confirm your attendance to an upcoming event to see it here</p>
                            </div>
                        }
                        <br />
                    </div>
                </div>
            </div>
        </>
    );
}