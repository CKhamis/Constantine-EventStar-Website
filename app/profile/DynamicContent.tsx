'use client'

import { Card, CardHeader } from "@/components/ui/card";
import AvatarIcon from "@/components/AvatarIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/app/profile/ProfileForm";
import axios from "axios";
import { useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import {LoadingIcon} from "@/components/LoadingIcon";
import {EventTable} from "@/app/profile/EventTable";
import {AccountResponse, EventWithResponse} from "@/components/Types";
import AccountSettings from "@/app/profile/AccountSettings";
import {IdCard} from "lucide-react";

export interface Props{
    sessionUser: User;
    eventList: EventWithResponse[];
    initialAccountList: AccountResponse[];
}

export default function DynamicContent({sessionUser, eventList, initialAccountList}: Props) {
    const [user, setUser] = useState<User>(sessionUser);
    const [accountList, setAccountList] = useState<AccountResponse[]>(initialAccountList);
    const [loading, setLoading] = useState(false);

    const refresh = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/users/self");
            setUser(response.data);

            const accounts = await axios.post("/api/users/connectedAccounts/all", {id: user.id});
            setAccountList(accounts.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="md:col-span-1 flex flex-col gap-5">
                {loading? <LoadingIcon size="lg" /> : ""}
                <Card>
                    <CardHeader>
                        <div className="flex flex-row justify-between items-center gap-4">
                            <div className="flex flex-row gap-4 items-center">
                                <AvatarIcon image={user.image} name={user.name} size="large"/>
                                <div>
                                    <p className="text-lg font-bold">{user.name}</p>
                                    <p>{user.email}</p>
                                </div>
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
                        <AccountSettings accountList={accountList} refresh={refresh}/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

