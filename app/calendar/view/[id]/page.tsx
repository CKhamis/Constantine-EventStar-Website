import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarPlus, ChevronLeft, Clock, LetterText, MapPin, Pencil, TriangleAlert} from "lucide-react";
import {EventWithRsvp} from "@/components/Types";
import axios from "axios";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import RsvpPanel from "@/app/calendar/view/[id]/RsvpPanel";
import GuestList from "@/app/calendar/view/[id]/GuestList";
import {auth} from "@/auth";
import AdminAttendanceLog from "@/components/admin/AdminAttendanceLog";

type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}

export default async function ViewEventPage(props: { params: Params }){
    const session = await auth();

    if (!session || !session.user || !session.user.id){
        return (<>login to view page</>)
    }

    const params = await props.params
    const eventId = params.id;

    async function fetchEvent() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/view/${eventId}`);
            return response.data;
        } catch (err) {
            console.error("Error fetching event:", err);
            return null;
        }
    }

    try{
        const eventData:EventWithRsvp = await fetchEvent();
        return (
            <>
                <TopBar />
                <div className="container mt-4">
                    <div className="flex flex-row gap-2 items-center mb-4">
                        <Link href="/calendar">
                            <Button variant="outline" size="icon">
                                <ChevronLeft/>
                            </Button>
                        </Link>
                        <p className="text-lg font-bold">Back to Events</p>
                    </div>
                    <div className="grid items-start gap-4 lg:grid-cols-3 mt-5">
                        <div className="grid auto-rows-max items-start lg:col-span-2 mb-4">
                            <Card className="glass-dark">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle className="text-4xl font-bold">{eventData.title}</CardTitle>
                                    <div className="flex flex-row gap-4">
                                        <Link target="_blank" href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${encodeURIComponent(eventData.eventStart + '/' + eventData.eventEnd)}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.address)}`}>
                                            <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                                                <CalendarPlus />
                                                Add to Calendar
                                            </Button>
                                        </Link>
                                        {session.user.role === "ADMIN" &&
                                            <>
                                                <AdminAttendanceLog eventId={eventId}/>
                                                <Link target="_blank" href={`/ESMT/calendar/${eventId}`}>
                                                    <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                                                        <Pencil />
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
                        </div>
                        <div className="flex flex-col gap-4 mb-4">
                            <RsvpPanel eventId={eventData.id} rsvpDue={eventData.rsvpDuedate} backgroundStyle={eventData.backgroundStyle}/>
                            <GuestList eventId={eventData.id} userId={session.user.id} />
                        </div>
                    </div>
                </div>
                <Footer/>
            </>
        );
    } catch (e) {
        console.log(e);
        return (
            <>
                <TopBar/>
                <div className="flex items-center flex-col justify-center min-h-[300]">
                    <div className="flex flex-row gap-4 items-center mb-4">
                        <TriangleAlert className="h-10 w-10"/>
                        <p className="text-xl font-bold">Error Finding Event</p>
                    </div>
                    <p>Please make sure the URL of the event is correct.</p>
                </div>
            </>
        );
    }
}