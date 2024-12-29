"use client"
import {useEffect, useState} from 'react'
import axios from "axios";
import {Enroller, User} from "@prisma/client";
import {CalendarCheck2, CalendarClock, CalendarHeart} from "lucide-react";
import AlertList, {alertContent} from "@/components/AlertList";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function DynamicContent() {
    // State
    const [userList, setUserList] = useState<User[]>([]);
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
            setUserList(response.data);
        } catch (err) {
            console.error("Error fetching enrollers:", err);
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of enrollers", icon: 2 }]);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchEnrollers();
    }, []);

    return (
        <>
            <div className="container mt-4">
                <AlertList alerts={alertMessages}/>
                <div className="flex justify-between gap-4 mb-4">
                    <h1 className="text-3xl">User Enrollment</h1>
                    <Link href="/ESMT/users/new">
                        <Button variant="secondary" className="h-9">
                            + New User
                        </Button>
                    </Link>
                </div>
                <div className="mb-4 hidden lg:grid grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <CalendarCheck2 className="-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{userList.length}</div>
                            <p className="text-xs text-muted-foreground">Currently in database</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Non-Enrolled Users</CardTitle>
                            <CalendarClock className="-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{enrollerList.length}</div>
                            <p className="text-xs text-muted-foreground">{enrollerList.length} have responded with yes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Fully Set Up Users</CardTitle>
                            <CalendarClock className="-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{enrollerList.length}</div>
                            <p className="text-xs text-muted-foreground">{enrollerList.length} {enrollerList.length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Favorite Event Type</CardTitle>
                            <CalendarHeart className="-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{enrollerList.length}</div>
                            <p className="text-xs text-muted-foreground">{enrollerList.length}</p>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </>
    );
}