'use client'

import AvatarIcon from "@/components/AvatarIcon";
import {Button} from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
export interface Props{
    session: {user: {id: string, name: string, image: string, email: string}}
}

export default function DynamicContent({session}: Props) {

    return (
        <div className="w-100 top-left-gradient">
            <div className="top-left-gradient">
                <div className="container p-5 flex justify-between items-center">
                    <div className="flex flex-row justify-start items-center gap-3">
                        <AvatarIcon size="large" image={session.user.image} name={session.user.name}/>
                        <div>
                            <p className="text-3xl font-bold">{session.user.name}</p>
                            <p>{session.user.email}</p>
                        </div>
                    </div>
                    <Button>Send Follow Requests</Button>
                </div>
            </div>
            <Tabs defaultValue="account" className="w-100">
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">Make changes to your account here.</TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>

        </div>
    );
}