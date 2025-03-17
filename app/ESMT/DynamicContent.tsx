'use client'

import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AvatarIcon from "@/components/AvatarIcon";
import Image from "next/image";
import {User} from "@prisma/client";
import axios from "axios";

export default function DynamicContent() {
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState<User[]>([]);

    async function refresh(){
        setLoading(true);
        await axios.get("/api/ESMT/user/all")
            .then((response) => {
                // Event exists, but need to know if user was invited
                setUserList(response.data);
            })
            .catch((error) => {
                console.log(error.status); // event not found, access denied, or need login
            });
        setLoading(false);
    }

    useEffect(() => {
        refresh()
    }, []);

    return (
        <div className="container">
            {loading && <LoadingIcon/>}
            <div className="flex justify-between items-center border-b-2 pb-5 overflow-x-hidden py-5 mb-5">
                <div className="flex flex-row justify-start items-center gap-3">
                    <Image src="/icons/ESMT.svg" alt="ESMT logo" width={50} height={50} />
                    <div>
                        <p className="text-3xl font-bold">EventStar Management Terminal</p>
                        <p>Administrator tools</p>
                    </div>
                </div>
            </div>
            <div>
                <Tabs defaultValue="account" className="w-fit">
                    <TabsList>
                        <TabsTrigger value="account">User Accounts</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">Make changes to your account here.</TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </Tabs>
            </div>
        </div>
    );
}