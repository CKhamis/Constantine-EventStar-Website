"use client"
import AdminUI from "@/components/admin/AdminUI";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from 'react'
import { Input } from "@/components/ui/input"
import axios from "axios";
import {User} from "@prisma/client";
import {Search} from "lucide-react";
import AlertList, {alertContent} from "@/components/AlertList";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import UserDetailsForm from "@/app/ESMT/users/UserDetailsForm";

export default function AdminUsers() {
    // Create Message
    const router = useSearchParams();
    const createMessageParam = router.get("message");

    // State
    const [users, setUsers] = useState<User[]>([]);
    const [alertMessages, setAlertMessages] = useState<alertContent[]>([{ title: createMessageParam==="1"? "User Added" : "", message: createMessageParam==="1"? "User created successfully!" : "", icon: 1 }]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/esmt/users/all");
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of users", icon: 2 }]);
        }
    };

    const addMessage = (message: alertContent)=> {
        setAlertMessages((prevMessages) => [...prevMessages, message]);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    // Search
    const [searchTerm, setSearchTerm] = useState('')
    const filteredUsers = users.filter(user =>
        `${user.name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <>
            <div className="container mt-4">
                <AlertList alerts={alertMessages} />
                <div className="flex justify-between gap-4 mb-4">
                    <h1 className="text-3xl">All Users</h1>
                    <Link href="/ESMT/users/new">
                        <Button variant="secondary" className="h-9">
                            + New User
                        </Button>
                    </Link>
                </div>

                <div className="relative max-w-sm mb-4">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        type="search"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredUsers.map((user) => (
                        <UserDetailsForm user={user} key={user.id} refresh={fetchUsers} addMessage={addMessage} />
                    ))}
                </div>
            </div>
        </>
    );
}