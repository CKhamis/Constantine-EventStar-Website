"use client"
import AdminUI from "@/components/admin/AdminUI";
import NewEventForm from "@/app/ESMT/calendar/new/NewEventForm";
import axios from "axios";
import {useEffect, useState} from "react";
import {Guest} from "@prisma/client";
import AlertList, {alertContent} from "@/components/AlertList";

export default function AdminCalendar(){
    const [guests, setGuests] = useState<Guest[]>([]);
    const [alertMessages, setAlertMessages] = useState<alertContent[]>([]);

    const fetchGuests = async () => {
        try {
            const response = await axios.get("/api/esmt/guests/all");
            setGuests(response.data);
        } catch (err) {
            console.error("Error fetching guests:", err);
            //setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of guests", icon: 2 }]);
        }
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    return (
        <AdminUI>
            <div className="container mt-4 max-w-xl">
                <AlertList alerts={alertMessages} />
                <h1 className="text-3xl mb-4">Create New Event</h1>
                <NewEventForm />
            </div>
        </AdminUI>
    );
}