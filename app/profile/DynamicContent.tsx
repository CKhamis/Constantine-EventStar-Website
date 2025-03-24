'use client'

import AvatarIcon from "@/components/AvatarIcon";
import {Button} from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios";
import {useEffect, useState} from "react";
import {userInfoResponse} from "@/app/api/user/info/route";
import {EIResponse} from "@/app/api/events/invited/route";
import {LoadingIcon} from "@/components/LoadingIcon";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {Check, CircleHelp, X} from "lucide-react";
import {format} from "date-fns";
import Image from "next/image";
import Footer from "@/components/Footer";
import {FRResponse} from "@/app/api/user/connections/incoming/route";
import FollowDialog from "@/app/profile/FollowDialog";

export interface Props{
    session: {user: {id: string, name: string, image: string, email: string}}
}

export default function DynamicContent({session}: Props) {
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
    const [recievedFollows, setRecievedFollows] = useState<FRResponse[]>([]);

    async function refresh(){
        setLoading(true);
        await axios.get("/api/user/info")
            .then((response) => {
                setUserInfo(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        await axios.get("/api/events/authored")
            .then((response) => {
                setRSVPs(response.data);
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

    async function removeFollower(senderId:string){
        await axios.post("/api/user/connections/delete/follower", {id: senderId})
            .then(() => {
                refresh()
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function removeFollowing(senderId:string){
        await axios.post("/api/user/connections/delete/following", {id: senderId})
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
            <div className="w-100 container p-5 flex flex-col gap-5">
                <div className="flex justify-between items-center border-b-2 pb-5 overflow-x-hidden">
                    <div className="flex flex-row justify-start items-center gap-3">
                        <AvatarIcon size="large" image={session.user.image} name={session.user.name}/>
                        <div>
                            <p className="text-3xl font-bold">{session.user.name}</p>
                            <p>{session.user.email}</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex flex-row gap-5 items-center justify-end">
                        <div>
                            <p className="">Follower{userInfo.followedBy.length === 1 ? "" : "s"}</p>
                            <p className="text-xl">{userInfo.followedBy.length}</p>
                        </div>
                        <div>
                            <p className="">Event{userInfo.event.length === 1? "" : "s"}</p>
                            <p className="text-xl">{userInfo.event.length}</p>
                        </div>
                        <div>
                            <p className="">Following</p>
                            <p className="text-xl">{userInfo.following.length}</p>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="events" className="w-100">
                    <TabsList>
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="followers">Followers</TabsTrigger>
                        <TabsTrigger value="following">Following</TabsTrigger>
                        <TabsTrigger value="requests">Requests</TabsTrigger>
                    </TabsList>
                    <TabsContent value="events" className="mt-5">
                        <div className="w-100 flex flex-row justify-between items-center mb-5">
                            <p className="text-3xl font-bold">Your Events</p>
                            <Link href="/editEvent"><Button>New Event</Button></Link>
                        </div>
                        <div className="max-w-2xl mx-auto">
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
                            {RSVPs.length === 0 && (
                                <div className="w-100 h-100 flex justify-center flex-col items-center">
                                    <Image src="/agent/empty.png" height={200} width={200} alt="" className="mt-10"/>
                                    <p className="font-bold text-3xl mb-5">No Events Created</p>
                                    <p className="text-muted-foreground text-sm">Click on New Event to get started!</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="followers" className="mt-5">
                        <div className="w-100 flex flex-row justify-between items-center mb-5">
                            <p className="text-3xl font-bold">Followers</p>
                            <FollowDialog />
                        </div>
                        <div className="flex flex-col gap-5 max-w-2xl mx-auto">
                            {userInfo.followedBy.map((follower) => (
                                <div key={follower.id} className="flex flex-row justify-between items-center">
                                    <div className="flex flex-row justify-start items-center gap-3">
                                        <AvatarIcon image={follower.image} name={follower.name} size="small" />
                                        <p className="font-bold text-xl">{follower.name}</p>
                                    </div>
                                    <Button size="icon" variant="secondary" onClick={() => removeFollower(follower.id)}><X /></Button>
                                </div>
                            ))}
                        </div>
                        {userInfo.followedBy.length === 0 && (
                            <div className="w-100 h-100 flex justify-center flex-col items-center">
                                <Image src="/agent/empty.png" height={200} width={200} alt="" className="mt-10"/>
                                <p className="font-bold text-3xl mb-5">No Followers (Yet)</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="following" className="mt-5">
                        <div className="w-100 flex flex-row justify-between items-center mb-5">
                            <p className="text-3xl font-bold">Following</p>
                            <FollowDialog />
                        </div>
                        <div className="flex flex-col gap-5 max-w-2xl mx-auto">
                            {userInfo.following.map((follower) => (
                                <div key={follower.id} className="flex flex-row justify-between items-center">
                                    <div className="flex flex-row justify-start items-center gap-3">
                                        <AvatarIcon image={follower.image} name={follower.name} size="small" />
                                        <p className="font-bold text-xl">{follower.name}</p>
                                    </div>
                                    <Button size="icon" variant="secondary" onClick={() => removeFollowing(follower.id)}><X /></Button>
                                </div>
                            ))}
                        </div>
                        {userInfo.following.length === 0 && (
                            <div className="w-100 h-100 flex justify-center flex-col items-center">
                                <Image src="/agent/empty.png" height={200} width={200} alt="" className="mt-10"/>
                                <p className="font-bold text-3xl mb-5">Not Following Anybody</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="requests" className="mt-5">
                        <div className="w-100 flex flex-row justify-between items-center mb-5">
                            <p className="text-3xl font-bold">Requests</p>
                            <FollowDialog />
                        </div>
                        <div className="flex flex-col gap-5 max-w-2xl mx-auto">
                            {recievedFollows.map((request) => (
                                <div key={request.sender.id} className="flex flex-row justify-between items-center">
                                    <div className="flex flex-row justify-start items-center gap-3">
                                        <AvatarIcon image={request.sender.image} name={request.sender.name} size="small" />
                                        <p className="font-bold text-xl">{request.sender.name}</p>
                                    </div>
                                    <div className="flex flex-row justify-end items-center mt-5 gap-3">
                                        <Button variant="secondary" size="icon" onClick={() => respondFR(true, request.sender.id)}><Check className="h-4 w-4"/></Button>
                                        <Button variant="outline" size="icon" onClick={() => respondFR(false, request.sender.id)}><X className="h-4 w-4"/></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {recievedFollows.length === 0 && (
                            <div className="w-100 h-100 flex justify-center flex-col items-center">
                                <Image src="/agent/empty.png" height={200} width={200} alt="" className="mt-10"/>
                                <p className="font-bold text-3xl mb-5">No Follow Requests</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
            <br className="mt-20"/>
            <Footer />
        </>
    );
}