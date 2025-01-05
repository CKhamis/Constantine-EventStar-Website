'use client'
import AlertList, {alertContent} from "@/components/AlertList";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import {Group} from "@prisma/client";
import {GroupTable} from "@/app/ESMT/groups/GroupTable";

export default function DynamicContent(){
    const [groups, setGroups] = useState<Group[]>([]);
    const [alertMessages, setAlertMessages] = useState<alertContent[]>([]);

    const fetchGroups = async () => {
        try {
            const response = await axios.get("/api/esmt/groups/all");
            setGroups(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of groups", icon: 2 }]);
        }
    };

    function refresh(){
        fetchGroups();
    }

    useEffect(() => {
        refresh();
    }, []);

    return (
        <div className="container mt-4">
            <AlertList alerts={alertMessages}/>
            <div className="flex justify-between gap-4 mb-4">
                <h1 className="text-3xl">User Groups</h1>
                <Link href="/ESMT/calendar/new">
                    <Button variant="secondary">+ New Group</Button>
                </Link>
                <Button variant="secondary" onClick={() => console.log(groups)}>Group</Button>
            </div>
            <GroupTable data={groups} deleteEnroller={()=> console.log("delete")} />
        </div>
    );
}