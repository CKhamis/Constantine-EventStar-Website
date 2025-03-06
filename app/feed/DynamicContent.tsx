'use client'

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import AvatarIcon from "@/components/AvatarIcon";
import axios from "axios";
import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import {response} from "@/app/api/user/info/route";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import {FRResponse} from "@/app/api/user/connections/incoming/route";
import {EIResponse} from "@/app/api/events/invited/route";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {Check, CircleHelp, X} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DynamicContent() {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<response>({
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
                console.log(response.data)
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

    useEffect(() => {
        refresh()
    }, []);

    return (
        <>
            {loading && <LoadingIcon/>}
            <div className="w-100 h-screen grid grid-cols-2 lg:grid-cols-3 gap-0 p-0">
                <div className="w-100 col-span-2 items-centers overflow-y-scroll">
                    <div className="top-left-gradient">
                        <div className="container flex-col flex gap-3 py-3 max-w-3xl">
                            <div className="flex flex-row justify-start items-center gap-3 ">
                                <Image src="/icons/Feed.svg" alt="Feed ICon" width={50} height={50}/>
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
                                                <ToggleGroupItem value="YES" aria-label="Toggle check" onClick={() => updateRSVP(event.eventId, "YES")}>
                                                    <Check className="h-4 w-4"/>
                                                </ToggleGroupItem>
                                                <ToggleGroupItem value="MAYBE" aria-label="Toggle question" onClick={() => updateRSVP(event.eventId, "MAYBE")}>
                                                    <CircleHelp className="h-4 w-4"/>
                                                </ToggleGroupItem>
                                                <ToggleGroupItem value="NO" aria-label="Toggle x" onClick={() => updateRSVP(event.eventId, "NO")}>
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
                                    <div className="flex flex-col justify-start gap-2">
                                        <Link href={"/calendar/view/" + rsvp.event.id}><Button variant={new Date(rsvp.event.eventStart) < new Date() ? "outline" : "default"}>View Event</Button></Link>
                                        {new Date(rsvp.event.eventStart) < new Date() ?
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
                                        <p className="ml-1 text-muted-foreground">{userInfo.email}</p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3 px-7 justify-between items-center">
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
                                        <p className="text-center">Following{userInfo.following.length === 1? "" : "s"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {recievedFollows.map((followRequest:FRResponse) => (
                            <Card className="mt-5 rounded-none" key={followRequest.id}>
                                <CardContent className="mt-5">
                                    <div className="flex flex-row justify-between items-start">
                                        <p className="font-bold">New Follow Request</p>
                                        <p className="">{format(followRequest.createdAt, 'MM/dd/yyyy h:mm a')}</p>
                                    </div>
                                    <div className="flex flex-row justify-center items-center mt-5 gap-3">
                                        <div>
                                            <AvatarIcon image={followRequest.sender.image} name={followRequest.sender.name} size={"small"}/>
                                        </div>
                                        <p className="font-bold text-xl">{followRequest.sender.name}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-row gap-3.5 justify-start items-center">
                                    <Button variant="secondary" onClick={() => respondFR(true, followRequest.sender.id)}>Accept</Button>
                                    <Button variant="outline" onClick={() => respondFR(false, followRequest.sender.id)}>Deny</Button>
                                </CardFooter>
                            </Card>
                        ))}
                        <Card className="mt-5 rounded-none border-none">
                            <CardContent>
                                Next event box
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}