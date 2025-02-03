"use client"

import {EventWithRsvp} from "@/components/Types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {CalendarPlus, Clock, LetterText, MapPin, Pencil} from "lucide-react";
import AdminAttendanceLog from "@/components/admin/AdminAttendanceLog";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {UserRole} from "@prisma/client";

export interface Props{
    eventData: EventWithRsvp;
    role: UserRole;
}

export default function EventDetailsPanel({eventData, role}: Props){
    return (
        <Card className="glass-dark">
            <CardHeader className="flex flex-col md:flex-row justify-between gap-5 pb-4">
                <CardTitle className="text-4xl font-bold">{eventData.title}</CardTitle>
                <div className="flex flex-col md:flex-row gap-4">
                    <Link target="_blank"
                          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${encodeURIComponent(format(new Date(eventData.eventStart), "yyyyMMdd'T'HHmmss") + '/' + format(new Date(eventData.eventEnd), "yyyyMMdd'T'HHmmss"))}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.address)}`}>
                        <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                            <CalendarPlus/>
                            Add to Calendar
                        </Button>
                    </Link>
                    {role === "ADMIN" &&
                        <>
                            <AdminAttendanceLog eventId={eventData.id} text="Attendance"/>
                            <Link target="_blank" href={`/ESMT/calendar/${eventData.id}`}>
                                <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                                    <Pencil/>
                                    Edit
                                </Button>
                            </Link>
                        </>}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-5">
                    <div className="flex flex-row justify-start gap-4">
                        <Badge variant="secondary">{eventData.eventType}</Badge>
                        <Badge variant="outline">{eventData.inviteRigidity}</Badge>
                    </div>
                    <div>
                        <div className="flex flex-row justify-start gap-2 items-center mb-1">
                            <Clock className="h-5 w-5"/>
                            <p>Date / Time</p>
                        </div>
                        <p className="text-muted-foreground">{format(eventData.eventStart, "MM/dd/yyyy h:mm a")} - {format(eventData.eventEnd, "MM/dd/yyyy h:mm a")}</p>
                    </div>

                    <div>
                        <div className="flex flex-row justify-start gap-2 items-center mb-1">
                            <MapPin className="h-5 w-5"/>
                            <p>Location</p>
                        </div>
                        <p className="text-muted-foreground">{eventData.address ? eventData.address : "None provided"}</p>
                    </div>

                    <div>
                        <div className="flex flex-row justify-start gap-2 items-center mb-1">
                            <LetterText className="h-5 w-5"/>
                            <p>Description</p>
                        </div>
                        <p className="text-muted-foreground">{eventData.description ? eventData.description : "No description provided"}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}