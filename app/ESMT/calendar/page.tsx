"use client"
import AdminUI from "@/components/admin/AdminUI";
import AlertList, {alertContent} from "@/components/AlertList";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarCheck2, CalendarClock, CalendarHeart, User} from "lucide-react";
import {EventTable} from "@/app/ESMT/calendar/EventTable";
import {eventTableColumns} from "@/app/ESMT/calendar/EventTableColumns";
import axios from "axios";
import {Event} from "@prisma/client"

export default function AdminCalendar(){
    // Create Message
    const router = useSearchParams();
    const createMessageParam = router.get("message");
    const [events, setEvents] = useState<Event[]>([]);

    const [alertMessages, setAlertMessages] = useState<alertContent[]>([{ title: createMessageParam==="1"? "Event Created" : "", message: createMessageParam==="1"? "Event created successfully!" : "", icon: 1 }]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get("/api/esmt/events/all");
            setEvents(response.data);
        } catch (err) {
            console.error("Error fetching events:", err);
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of events", icon: 2 }]);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    const onEdit = (id:string) =>{
        console.log(id)
    }
    const onDelete = (id:string) =>{
        console.log(id)
    }

    return (
        <AdminUI>
            <div className="container mt-4">
                <AlertList alerts={alertMessages} />
                <div className="flex justify-between gap-4 mb-4">
                    <h1 className="text-3xl">All Events</h1>
                    <Link href="/ESMT/calendar/new">
                        <Button variant="secondary" className="h-9">
                            + New Event
                        </Button>
                    </Link>
                </div>
                <div className="mb-4 hidden lg:grid grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                            <CalendarCheck2 className="-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{events.length}</div>
                            <p className="text-xs text-muted-foreground">Currently in database</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">RSVP Count</CardTitle>
                            <User className="-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">87</div>
                            <p className="text-xs text-muted-foreground">Out of 3000 events</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Most Common Meet Time</CardTitle>
                            <CalendarClock className="-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">6:00PM</div>
                            <p className="text-xs text-muted-foreground">56 events</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Favorite Event Type</CardTitle>
                            <CalendarHeart className="-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">PARTY</div>
                            <p className="text-xs text-muted-foreground">22 events</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid items-start gap-4 lg:grid-cols-3">
                    <div className="grid auto-rows-max items-start lg:col-span-2">
                        <EventTable columns={eventTableColumns(onEdit, onDelete)} data={events} />
                    </div>
                    <div className="flex flex-col gap-4 bg-amber-400">
                        <p className="text-2xl font-bold">Page under construction</p>
                    </div>
                </div>
            </div>
        </AdminUI>
);
}