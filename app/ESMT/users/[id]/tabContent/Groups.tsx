import {Group} from "@prisma/client";
import axios from "axios";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";

export interface Props{
    userId: string;
    groupList: Group[];
    refresh: () => Promise<void>;
}

export default function Groups({groupList, userId, refresh}: Props){

    const leaveGroup = async (groupId: string) => {
        try {
            await axios.post("/api/esmt/users/groups/remove", {id1: userId, id2: groupId}).finally(refresh);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    return (
        <div className="container">
            <div className="flex flex-row justify-between items-center">
                <p className="text-2xl font-bold mb-2">Associated Groups</p>
                <Button variant="default" size="icon">+</Button>
            </div>
            <div className="grid grid-cols-1 gap-5 mt-5">
                {groupList.map((group: Group) => (
                    <Card key={group.id}>
                        <div className="flex flex-row justify-between items-center pt-6 px-6 pb-2">
                            <CardTitle className="text-xl font-bold">{group.name}</CardTitle>
                            <div className="flex flex-row justify-end items-center gap-5">
                                <Button variant="outline" size="sm" onClick={() => leaveGroup(group.id)}>Remove</Button>
                                <Link href={"/ESMT/groups/" + group.id}><Button variant="secondary" size="sm">Edit</Button></Link>
                            </div>
                        </div>
                        <CardContent>
                            <Badge className="mb-2">{group.status}</Badge>
                            <p>{group.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}