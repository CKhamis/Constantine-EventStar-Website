'use client'

import AvatarIcon from "@/components/AvatarIcon";
import {Button} from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios";
import {useEffect, useState} from "react";
import {response} from "@/app/api/user/info/route";
import {EIResponse} from "@/app/api/events/invited/route";
import {LoadingIcon} from "@/components/LoadingIcon";
export interface Props{
    session: {user: {id: string, name: string, image: string, email: string}}
}

export default function DynamicContent({session}: Props) {
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

    useEffect(() => {
        refresh()
    }, []);

    return (
        <>
            {loading && <LoadingIcon/>}
            <div className="w-100 container p-5 flex flex-col gap-5">
                <div className="flex justify-between items-center border-b-2 pb-5">
                    <div className="flex flex-row justify-start items-center gap-3">
                        <AvatarIcon size="large" image={session.user.image} name={session.user.name}/>
                        <div>
                            <p className="text-3xl font-bold">{session.user.name}</p>
                            <p>{session.user.email}</p>
                        </div>
                    </div>
                    <div className="flex flex-row gap-5 items-center justify-end">
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
                    <TabsContent value="account">Make changes to your account here.</TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </Tabs>
            </div>
        </>
    );
}