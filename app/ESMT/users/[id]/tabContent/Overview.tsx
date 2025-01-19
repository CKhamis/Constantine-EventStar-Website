import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {userWithEventAndGroupsAndRsvpAndAccountsAndSessions} from "@/components/Types";

export interface Props {
    user: userWithEventAndGroupsAndRsvpAndAccountsAndSessions;
}
export default function Overview({user}: Props){
    return (
        <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-1 grid grid-cols-1 gap-4">
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
            </div>
            <div className="col-span-2 md:col-span-2">

            </div>
        </div>
    );
}