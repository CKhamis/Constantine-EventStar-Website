"use client"
import AdminUI from "@/components/admin/AdminUI";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from 'react'
import { Input } from "@/components/ui/input"
import axios from "axios";
import {Guest} from "@prisma/client";
import {Search} from "lucide-react";
import GuestDetailsForm from "@/app/ESMT/guests/GuestDetailsForm";
import AlertList, {alertContent} from "@/components/AlertList";

export default function AdminGuests() {
    // Create Message
    const router = useSearchParams();
    const createMessageParam = router.get("message");

    // State
    const [guests, setGuests] = useState<Guest[]>([]);
    const [alertMessages, setAlertMessages] = useState<alertContent[]>([{ title: createMessageParam==="1"? "Guest Added" : "", message: createMessageParam==="1"? "Guest created successfully!" : "", icon: 1 }]);

    const fetchGuests = async () => {
        try {
            const response = await axios.get("/api/esmt/guests/all");
            setGuests(response.data);
        } catch (err) {
            console.error("Error fetching guests:", err);
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of guests", icon: 2 }]);
        }
    };

    const addMessage = (message: alertContent)=> {
        setAlertMessages((prevMessages) => [...prevMessages, message]);
    }

    useEffect(() => {
        fetchGuests();
    }, []);

    // Search
    const [searchTerm, setSearchTerm] = useState('')
    const filteredGuests = guests.filter(guest =>
        `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <>
            <AdminUI>
                <div className="container mt-4">
                    <AlertList alerts={alertMessages} />
                    <h1 className="text-3xl mb-4">All Guests</h1>
                    <div className="relative max-w-sm mb-4">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="Search guests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredGuests.map((guest, index) => (
                            <GuestDetailsForm guest={guest} key={index} refresh={fetchGuests} addMessage={addMessage} />
                        ))}
                    </div>
                </div>
            </AdminUI>
        </>
    );
}