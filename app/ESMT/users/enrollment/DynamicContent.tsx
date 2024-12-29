"use client"
import {useEffect, useState} from 'react'
import axios from "axios";
import {Enroller} from "@prisma/client";
import AlertList, {alertContent} from "@/components/AlertList";
import {Button} from "@/components/ui/button";
import {EnrollerTable} from "@/app/ESMT/users/enrollment/EnrollerTable";
import {enrollerWithAuthorAndUser} from "@/components/Types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type miniUser = {
    id: string,
    name: string,
    email: string,
}

export default function DynamicContent() {
    // State
    const [userList, setUserList] = useState<miniUser[]>([]);
    const [enrollerList, setEnrollerList] = useState<Enroller[]>([]);

    const [alertMessages, setAlertMessages] = useState<alertContent[]>([]);

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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="secondary">+ New Enroller</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[300px]">
                            <DialogHeader>
                                <DialogTitle>New Enroller</DialogTitle>
                                <DialogDescription>
                                    This creates a link that allows guests to link their user account with login credentials.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-2 py-4">
                                <Label htmlFor="username" className="text-left">
                                    Username
                                </Label>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {userList.map((user) => (
                                                <SelectItem value={user.id} key={user.id}>{user.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <EnrollerTable data={enrollerList} />
            </div>
        </>
    );
}