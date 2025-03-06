'use client'

import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import AvatarIcon from "@/components/AvatarIcon";
import axios from "axios";
import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import {response} from "@/app/api/user/info/route";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";

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
    const [RSVPs, setRSVPs] = useState([]);
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
            })
            .then((r => {
                console.log(r);
            }))
            .catch((error) => {
                console.log(error);
            });

        await axios.get("/api/user/connections/incoming")
            .then((response) => {
                setRecievedFollows(response.data);
                console.log(response.data)
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
            <div className="w-100 h-screen grid grid-cols-2 lg:grid-cols-3 gap-0 p-0">
                <div className="w-100 col-span-2 items-centers overflow-y-scroll">
                    <div className="container flex-col flex gap-3 p-5 max-w-3xl">
                        <p className="text-3xl font-bold mb-5">Upcoming Events</p>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                    </div>
                </div>
                <div className="hidden lg:flex overflow-y-scroll">
                    <div className="max-w-xl mx-auto">
                        <Card className="mt-5 rounded-none">
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
                        {recievedFollows.map((followRequest) => (
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
                                    <Button variant="secondary">Accept</Button>
                                    <Button variant="outline">Deny</Button>
                                </CardFooter>
                            </Card>
                        ))}
                        <Card className="mt-5 rounded-none">
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