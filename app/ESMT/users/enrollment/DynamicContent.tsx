"use client"
import {useEffect, useState} from 'react'
import axios from "axios";
import {Enroller} from "@prisma/client";
import AlertList, {alertContent} from "@/components/AlertList";
import {EnrollerTable} from "@/app/ESMT/users/enrollment/EnrollerTable";
import {enrollerStatisticsResponse, miniUser} from "@/components/Types";
import NewEnrollerForm from "@/app/ESMT/users/enrollment/NewEnrollerForm";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Link, Star, User, Users} from "lucide-react";
import {Button} from "@/components/ui/button";
import {enrollerTableColumns} from "@/app/ESMT/users/enrollment/EnrollerTableColumns";


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
            const response = await axios.get("/api/esmt/users/enrollment/stats");
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

        console.log(enrollerStats)
    }

    useEffect(() => {
        refresh();
    }, []);

    async function createEnroller(userId: string) {
        try{
            await axios.post('/api/esmt/users/enrollment/new', {id: userId});
            setAlertMessages([...alertMessages, { title: "Enroller Created", message: "Please copy and send the link to continue.", icon: 1 }]);
        }catch(e){
            console.log(e)
        }finally {
            refresh();
        }
    }

    async function deleteEnroller(enrollerId: string) {
        try{
            await axios.post('/api/esmt/users/enrollment/delete', {id: enrollerId}).finally(refresh);
            setAlertMessages([...alertMessages, { title: "Enroller Deleted", message: "You can re-create one in this page.", icon: 1 }]);
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
                            <Users className="w-4 text-muted-foreground" />
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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Enroller Count</CardTitle>
                            <Link className="w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{enrollerList.length}</div>
                            <p className="text-xs text-muted-foreground"></p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Favorite Provider</CardTitle>
                            <Star className="w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            {enrollerStats.length > 0 ? (
                                <>
                                    <div className="text-2xl font-bold">{enrollerStats[0].provider.toUpperCase()}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Used {enrollerStats[0]._count.provider} times
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">N/A</div>
                                    <p className="text-xs text-muted-foreground">No data available</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <EnrollerTable data={enrollerList} deleteEnroller={deleteEnroller}/>
            </div>
        </>
    );
}