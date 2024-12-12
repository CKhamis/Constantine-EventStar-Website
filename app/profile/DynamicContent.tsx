'use client'

import { Card, CardHeader } from "@/components/ui/card";
import AvatarIcon from "@/components/AvatarIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/app/profile/ProfileForm";
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function DynamicContent() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refresh = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/users/self");
            setUser(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            router.push("/api/auth/signin");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-4">
                <p className="font-semibold text-2xl">Now Loading</p>
            </div>
        );
    }

    if (!user) {
        // This would never run
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="md:col-span-1 flex flex-col gap-5">
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
            </div>
            <div className="md:col-span-2 mb-5">
                <Tabs defaultValue="profile" className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <p className="text-2xl font-bold mb-4">Profile Information</p>
                        <ProfileForm user={user} refresh={refresh}/>
                    </TabsContent>
                    <TabsContent value="events">Change your password here.</TabsContent>
                    <TabsContent value="settings">Change your settings here.</TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

