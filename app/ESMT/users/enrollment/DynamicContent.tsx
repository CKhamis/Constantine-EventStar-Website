"use client"
import {useEffect, useState} from 'react'
import axios from "axios";
import {Enroller} from "@prisma/client";
import AlertList, {alertContent} from "@/components/AlertList";
import {EnrollerTable} from "@/app/ESMT/users/enrollment/EnrollerTable";
import {enrollerStatisticsResponse, miniUser} from "@/components/Types";
import NewEnrollerForm from "@/app/ESMT/users/enrollment/NewEnrollerForm";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarCheck2, CalendarClock, CalendarHeart, User} from "lucide-react";


export default function DynamicContent() {
    // State
    const [userList, setUserList] = useState<miniUser[]>([]);
    const [enrollerList, setEnrollerList] = useState<Enroller[]>([]);
    const [enrollerStats, setEnrollerStats] = useState<enrollerStatisticsResponse[]>([]);
    const [totalUserCount, setTotalUserCount] = useState(0);

    const [alertMessages, setAlertMessages] = useState<alertContent[]>([]);

    const fetchUserCount = async () => {
        try {
            const response = await axios.get("/api/esmt/users/all");
            console.log(response.data.length);
            setTotalUserCount(response.data.length);
        } catch (err) {
            console.error("Error fetching users:", err);
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of users", icon: 2 }]);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/esmt/users/unenrolled");
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

    const fetchStatistics = async () => {
        try {
            console.log("alksdfasdf------------------------");
            const response = await axios.get("/api/esmt/users/enrollment/stats");
            console.log("successful----------");
            console.log(response.data)
            setEnrollerStats(response.data);
        } catch (err) {
            console.error("Error fetching stats:", err);
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of stats", icon: 2 }]);
        }
    };

    function refresh(){
        fetchUsers();
        fetchEnrollers();
        fetchStatistics();
        fetchUserCount();
    }

    useEffect(() => {
        refresh();
    }, []);

    async function createEnroller(userId: string) {
        try{
            const response = await axios.post('/api/esmt/users/enrollment/new', {id: userId});
            console.log(response);
        }catch(e){
            console.log(e)
        }finally {
            refresh();
        }
    }

    return (
        <>
            <div className="container mt-4">
                <AlertList alerts={alertMessages}/>
                <div className="flex justify-between gap-4 mb-4">
                    <h1 className="text-3xl">User Enrollment</h1>
                    <NewEnrollerForm userList={userList} createEnroller={createEnroller}/>
                </div>
                <div className="mb-4 hidden lg:grid grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <CalendarCheck2 className="-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUserCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Non-Enrolled Users</CardTitle>
                            <User className="-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{userList.length}</div>
                        </CardContent>
                    </Card>
                    {/*<Card>*/}
                    {/*    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">*/}
                    {/*        <CardTitle className="text-sm font-medium">Most Common Meet Time</CardTitle>*/}
                    {/*        <CalendarClock className="-4 w-4 text-muted-foreground"/>*/}
                    {/*    </CardHeader>*/}
                    {/*    <CardContent>*/}
                    {/*        <div className="text-2xl font-bold">{userList.length}</div>*/}
                    {/*        <p className="text-xs text-muted-foreground"></p>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                    {/*<Card>*/}
                    {/*    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">*/}
                    {/*        <CardTitle className="text-sm font-medium">Favorite Provider</CardTitle>*/}
                    {/*        <CalendarHeart className="-4 w-4 text-muted-foreground"/>*/}
                    {/*    </CardHeader>*/}
                    {/*    <CardContent>*/}
                    {/*        <div className="text-2xl font-bold">{enrollerStats[0].provider}</div>*/}
                    {/*        <p className="text-xs text-muted-foreground">Used {enrollerStats[0]._count.provider} times</p>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                </div>
                <EnrollerTable data={enrollerList}/>
            </div>
        </>
    );
}