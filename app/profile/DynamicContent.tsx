'use client'

import { Card, CardHeader } from "@/components/ui/card";
import AvatarIcon from "@/components/AvatarIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/app/profile/ProfileForm";
import axios from "axios";
import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import {EventTable} from "@/app/profile/EventTable";
import {EventWithResponse, userWithAccountsAndGroups} from "@/components/Types";
import AccountSettings from "@/app/profile/AccountSettings";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import Link from "next/link";

export interface Props{
    eventList: EventWithResponse[];
}

export default function DynamicContent({eventList}: Props) {
    const [user, setUser] = useState<userWithAccountsAndGroups | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/users/self");
            setUser(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, [])


    if (loading && user === null) {
        return (
            <LoadingIcon />
        );
    }

    if(user === null){
        return (
            <div className="w-100 h-screen flex flex-col items-center justify-center p-10 top-left-gradient">
                <Image src="/agent/waiting.png" alt="waiting" height={150} width={150} />
                <p className="text-4xl font-bold text-center">OOPS! There was an error with your account</p>
                <p className="mt-3">Please contact the server operator for more information</p>
                <Link href="/" className="underline text-muted-foreground mt-3">Back to home page</Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="md:col-span-1 flex flex-col gap-5">
                {loading? <LoadingIcon /> : ""}
                <Card>
                    <CardHeader>
                        <div className="flex flex-row justify-between items-center gap-4">
                            <div className="flex flex-row gap-4 items-center">
                                <AvatarIcon image={user.image} name={user.name} size="large"/>
                                <div>
                                    <p className="text-lg font-bold">{user.name}</p>
                                    <p>{user.email}</p>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <p className="text-muted-foreground text-xs cursor-pointer mt-2">View Groups</p>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel>Your Groups</DropdownMenuLabel>
                                            {user?.groups.map((group) => <DropdownMenuItem key={group.id}>{group.name}</DropdownMenuItem>)}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex flex-row justify-evenly items-center gap-4">
                            <div className="flex flex-col items-center gap-3">
                                <p className="font-bold">Your Points</p>
                                <p className="text-3xl">{user.points}</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex flex-row justify-evenly items-center gap-4">
                            <div className="flex flex-col items-center gap-3">
                                <p className="font-bold">Date Joined</p>
                                <p className="text-2xl">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <p className="font-bold">Last Modified</p>
                                <p className="text-2xl">{new Date(user.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex flex-row justify-evenly items-center gap-4">
                            <div className="flex flex-col items-center gap-3">
                                <p className="font-bold">Your ID Pin</p>
                                <p className="text-4xl">{user.pin}</p>
                                <p className="text-muted-foreground text-xs">Can only be changed by an admin</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>
            <div className="md:col-span-2 mb-5">
                <Tabs defaultValue="profile">
                    <TabsList>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <p className="text-2xl font-bold mb-4">Profile Information</p>
                        <ProfileForm user={user} refresh={refresh}/>
                    </TabsContent>
                    <TabsContent value="events">
                        <EventTable data={eventList}/>
                    </TabsContent>
                    <TabsContent value="settings">
                        <p className="text-2xl font-bold mb-4">Settings</p>
                        <AccountSettings accountList={user.accounts} refresh={refresh}/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

