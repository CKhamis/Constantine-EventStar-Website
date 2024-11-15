"use client"
import AdminUI from "@/components/admin/AdminUI";
import AlertMessage from "@/components/AlertMessage";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import axios from "axios";
import {Guest} from "@prisma/client";
import {Search} from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import EditGuestForm from "@/app/ESMT/guests/EditGuestForm";
import * as z from "zod";
import {editGuestSchema} from "@/components/ValidationSchemas";
import AlertList from "@/components/AlertList";

export default function AdminGuests() {
    // Create Message
    const router = useSearchParams();
    const createMessageParam = router.get("message");

    // State
    const [guests, setGuests] = useState<Guest[]>([]);
    const [alertMessages, setAlertMessages] = useState<{title: string, message: string, icon: 1 | 2 | 3}[]>([{ title: createMessageParam==="1"? "Guest Added" : "", message: createMessageParam==="1"? "Guest created successfully!" : "", icon: 1 }]);

    const fetchGuests = async () => {
        try {
            const response = await axios.get("/api/esmt/guests/all");
            setGuests(response.data);
        } catch (err) {
            console.error("Error fetching guests:", err);
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of guests", icon: 2 }]);
        }
    };

    async function onEditGuest(values: z.infer<typeof editGuestSchema>) {
        try{
            await axios.post('/api/esmt/guests/edit', values).finally(fetchGuests);
            setAlertMessages([...alertMessages, { title: "Guest Modification", message: values.firstName + " " + values.lastName + " was modified and saved to server", icon: 1 }]);
        }catch(e){
            setAlertMessages([...alertMessages, { title: "Guest Modification", message: "There was an error saving guest details", icon: 2 }]);
            console.log(e);
        }
        return null;
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
                        {filteredGuests.map((guest) => (
                            <Dialog key={guest.id}>
                                <DialogTrigger asChild>
                                    <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={guest.avatarUrl} alt={`${guest.firstName} ${guest.lastName}`} />
                                            <AvatarFallback>{guest.firstName[0]}{guest.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{guest.firstName} {guest.lastName}</p>
                                            <p className="text-sm text-muted-foreground">{guest.email}</p>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <EditGuestForm guest={guest} onEditGuest={onEditGuest}/>
                            </Dialog>
                        ))}
                    </div>
                </div>
            </AdminUI>
        </>
    );
}