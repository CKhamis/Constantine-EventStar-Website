"use client"
import {Card, CardHeader} from "@/components/ui/card";
import {userWithEventAndGroupsAndRsvpAndAccountsAndSessions} from "@/components/Types";
import UserInfoSettings from "@/app/ESMT/users/[id]/tabContent/UserInfoSettings";
import {useState} from "react";
import AlertList, {alertContent} from "@/components/AlertList";

export interface Props {
    user: userWithEventAndGroupsAndRsvpAndAccountsAndSessions;
    refreshAction: () => void;
}
export default function Overview({user, refreshAction}: Props){
    const [alertMessages, setAlertMessages] = useState<alertContent[]>([]);

    const addMessage = (message: alertContent)=> {
        setAlertMessages((prevMessages) => [...prevMessages, message]);
    }

    return (
        <>
            <AlertList alerts={alertMessages}/>
            <div className="grid grid-cols-3">
                <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-row justify-evenly items-center gap-4">
                                <div className="flex flex-col items-center gap-3">
                                    <p className="font-bold">Points Accumulated</p>
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
                                    <p className="font-bold">Membership Card ID</p>
                                    <p className="text-3xl">{user.cardId? user.cardId : "None"}</p>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                <div className="col-span-2 md:col-span-2 md:pl-4 mb-5">
                    <p className="font-bold text-2xl mb-3">General Information</p>
                    <UserInfoSettings user={user} refresh={refreshAction} addMessage={addMessage}/>
                </div>
            </div>
        </>
    );
}