"use client"
import {useEffect, useState} from 'react'
import axios from "axios";
import {Enroller, User} from "@prisma/client";
import AlertList, {alertContent} from "@/components/AlertList";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {EnrollerTable} from "@/app/ESMT/users/enrollment/EnrollerTable";
import {enrollerWithAuthorAndUser} from "@/components/Types";

export default function DynamicContent() {
    // State
    const [userList, setUserList] = useState<enrollerWithAuthorAndUser[]>([]);
    const [enrollerList, setEnrollerList] = useState<Enroller[]>([]);

    const [alertMessages, setAlertMessages] = useState<alertContent[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/esmt/users/all");
            setUserList(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of users", icon: 2 }]);
        }
    };

    const fetchEnrollers = async () => {
        try {
            const response = await axios.get("/api/esmt/users/enrollment/all");
            setEnrollerList(response.data);
        } catch (err) {
            console.error("Error fetching enrollers:", err);
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of enrollers", icon: 2 }]);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchEnrollers();
    }, []);

    console.log(enrollerList);

    async function createEnroller() {
        try{
            const response = await axios.post('/api/esmt/users/enrollment/new', {id: 'cm590zsg4000abuk07zy063tg'});
            console.log(response);
        }catch(e){
            console.log(e)
        }
    }

    return (
        <>
            <div className="container mt-4">
                <AlertList alerts={alertMessages}/>
                <div className="flex justify-between gap-4 mb-4">
                    <h1 className="text-3xl">User Enrollment</h1>
                    <Button variant="secondary" className="h-9" onClick={createEnroller}>
                        + New Enroller
                    </Button>
                </div>
                <EnrollerTable data={enrollerList} />
            </div>
        </>
    );
}