"use client"
import AdminUI from "@/components/admin/AdminUI";
import AlertList, {alertContent} from "@/components/AlertList";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarCheck2, CalendarClock, CalendarHeart, Eye, Pencil, Trash2, User} from "lucide-react";
import {EventTable} from "@/app/ESMT/calendar/EventTable";
import {eventTableColumns, eventTableColumnsWithRowClick} from "@/app/ESMT/calendar/EventTableColumns";
import axios from "axios";
import {Event} from "@prisma/client"
import { format } from 'date-fns'
import {Badge} from "@/components/ui/badge";
import {RsvpChart} from "@/app/ESMT/calendar/RsvpChart";

export default function AdminCalendar(){
    // Create Message
    const router = useSearchParams();
    const createMessageParam = router.get("message");
    const [events, setEvents] = useState<Event[]>([]);
    const [rsvpCount, setRSVPCount] = useState<number>(0);
    const [commonMeetTime, setCommonMeetTime] = useState<string>("None");
    const [commonEventType, setCommonEventType] = useState<string>("None");
    const [commonEventTypeCount, setCommonEventTypeCount] = useState<number>(0);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>();

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
        const total = events.reduce((sum, event) => sum + event.RSVP.length, 0);
        setRSVPCount(total);

        const timeOccurrences: Record<string, number> = {};
        let maxCount = 0;
        let commonTimeText = "None";

        const typeOccurrences: Record<string, number> = {};
        let maxTypeCount = 0;
        let commonTypeText = "None";

        events.forEach((event) => {
            const time = format(event.eventStart, 'h:mm a');
            timeOccurrences[time] = (timeOccurrences[time] || 0) + 1;
            typeOccurrences[event.eventType] = (typeOccurrences[time] || 0) + 1;

            if(timeOccurrences[time] > maxCount){
                maxCount = timeOccurrences[time];
                commonTimeText = time;
            }

            if(typeOccurrences[event.eventType] > maxTypeCount){
                maxTypeCount = typeOccurrences[event.eventType];
                commonTypeText = event.eventType;
            }
        });

        setCommonMeetTime(commonTimeText);
        setCommonEventType(commonTypeText);
        setCommonEventTypeCount(maxTypeCount);
    }, [events]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const onEdit = (id:string) =>{
        console.log(id)
    }
    const onDelete = (id:string) =>{
        console.log(id)
    }

    const onRowClick = (id: string) => {
        setSelectedEvent(events.find(event => event.id === id));
        console.log(selectedEvent)
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
                            <div className="text-2xl font-bold">{rsvpCount}</div>
                            <p className="text-xs text-muted-foreground">Out of {events.length} events</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Most Common Meet Time</CardTitle>
                            <CalendarClock className="-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{commonMeetTime}</div>
                            <p className="text-xs text-muted-foreground">56 events</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Favorite Event Type</CardTitle>
                            <CalendarHeart className="-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{commonEventType}</div>
                            <p className="text-xs text-muted-foreground">{commonEventTypeCount} events</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid items-start gap-4 lg:grid-cols-3">
                    <div className="grid auto-rows-max items-start lg:col-span-2">
                        <EventTable columns={eventTableColumnsWithRowClick(onEdit, onDelete, onRowClick)} data={events} />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                {selectedEvent?
                                    <>
                                        <CardTitle className="text-2xl font-medium">{selectedEvent.title}</CardTitle>
                                        <div className="flex flex-row gap-4 justify-end">
                                            <Link href={"/calendar/view/" + selectedEvent.id}>
                                                <Button variant="secondary" size="icon">
                                                    <Eye/>
                                                </Button>
                                            </Link>

                                            <Button variant="outline" size="icon" onClick={() => onEdit(selectedEvent.id)}>
                                                <Pencil/>
                                            </Button>

                                            <div className="flex flex-row gap-4 justify-end">
                                                <Button variant="outline" size="icon" onClick={() => onDelete(selectedEvent.id)}>
                                                    <Trash2/>
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <CardTitle className="text-2xl font-medium">Event Details</CardTitle>
                                }

                            </CardHeader>
                            <CardContent>
                            {selectedEvent ?
                                    <div className="grid grid-cols-1 gap-5">
                                        <div className="flex flex-row justify-start gap-4">
                                            <Badge variant="secondary">{selectedEvent.eventType}</Badge>
                                            <Badge variant="outline">{selectedEvent.inviteRigidity}</Badge>
                                        </div>
                                        <div className="flex flex-row justify-between">
                                            <p>{format(selectedEvent.eventStart, "MM/dd/yyyy h:mm a")}</p>
                                            <p>-</p>
                                            <p>{format(selectedEvent.eventEnd, "MM/dd/yyyy h:mm a")}</p>
                                        </div>
                                        <p>{selectedEvent.description? selectedEvent.description : "No description provided"}</p>
                                    </div>
                                     : <p>Please select an event to view details</p>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminUI>
);
}