'use client'

import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image";
import axios from "axios";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import UserDetailsForm from "@/app/ESMT/UserDetailsForm";
import {esmtUser} from "@/app/api/ESMT/user/all/route";
import UserMerge from "@/app/ESMT/UserMerge";

interface Props {
    id: string;
}

export default function DynamicContent({id}: Props) {
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState<esmtUser[]>([]);

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

    // Search
    const [searchTerm, setSearchTerm] = useState('')
    const filteredUsers = userList.filter(user =>
        `${user.name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                <Tabs defaultValue="account" className="w-full">
                    <TabsList>
                        <TabsTrigger value="account">User Accounts</TabsTrigger>
                        <TabsTrigger value="merge">Merge Users</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <div className="relative max-w-sm mb-4">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredUsers.map((user) => (
                                <UserDetailsForm id={id} user={user} key={user.id} refresh={refresh} />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="merge">
	                    <UserMerge users={userList} setLoading={setLoading} refresh={refresh} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}