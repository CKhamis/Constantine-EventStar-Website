"use client"
import AvatarIcon from "@/components/AvatarIcon";
import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import axios from "axios";
import {userWithEventAndGroupsAndRsvpAndAccountsAndSessions} from "@/components/Types";
import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Button} from "@/components/ui/button";
import Overview from "@/app/ESMT/users/[id]/tabContent/Overview";
import UserSettings from "@/app/ESMT/users/[id]/tabContent/UserSettings";

export interface Props{
    userId: string;
}

export default function UserInfo({userId}: Props){
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<userWithEventAndGroupsAndRsvpAndAccountsAndSessions | null>(null);


    const refresh = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/esmt/users/view/" + userId);
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
                <Image src="/agent/error.gif" alt="waiting" height={150} width={150} className="mb-5" />
                <p className="text-4xl font-bold text-center">OOPS! There was an error with the user</p>
                <p className="mt-3">The user may have been deleted</p>
                <Link href="/" className="underline text-muted-foreground mt-3">Back to home page</Link>
            </div>
        );
    }

    return (
        <div className="container">
            {loading? <LoadingIcon /> : ""}
            <div className="w-100 border-b flex flex-row justify-between py-5">
                <div className="flex flex-row justify-start gap-5 items-center">
                    <AvatarIcon image={user.image} name={user.name} size="large" />
                    <div>
                        <p className="font-bold text-4xl">{user.name}</p>
                        <p className="mt-3 ml-1 text-muted-foreground">{user.email} | {user.role}</p>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm">Groups</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>All groups</DropdownMenuLabel>
                        {user?.groups.map((group) => <DropdownMenuItem key={group.id}>{group.name}</DropdownMenuItem>)}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Tabs defaultValue="overview" className="w-100 mt-4">
                <TabsList className="grid w-full grid-cols-6 mb-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="groups">Groups</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="polariscope">Polariscope</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview"><Overview user={user} refreshAction={refresh} /></TabsContent>
                <TabsContent value="groups">Change your password here.</TabsContent>
                <TabsContent value="events">Change your password here.</TabsContent>
                <TabsContent value="attendance">Change your password here.</TabsContent>
                <TabsContent value="polariscope">To be added in a future update.</TabsContent>
                <TabsContent value="settings"><UserSettings accountList={user.accounts} refreshAction={refresh} /></TabsContent>
            </Tabs>

        </div>
    );
}