import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import {
    CalendarCheck2,
    CalendarClock,
    CalendarHeart,
    ChevronLeft,
    Clock, Eye,
    LetterText, MapPin,
} from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import axios from "axios";
import {Rsvp} from "@prisma/client";
import {Progress} from "@/components/ui/progress";

export default async function Calendar(){
    const guestId = "e6d01aa9-9f07-499a-b803-0429a2d88dfc"; //todo: placeholder

    async function fetchEvent() {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/upcoming`, {id: guestId});
            return response.data;
        } catch (err) {
            console.error("Error fetching event:", err);
            return null;
        }
    }

    try{
        const eventList:Rsvp[] = await fetchEvent();

        // Event Analysis
        const completeResponsesCount = eventList.filter((rsvp) => rsvp.response !== "NO_RESPONSE").length;
        const nextEvent:Event = eventList[0].event || null;
        console.log(eventList);

        return (
            <>
                <TopBar/>
                <div className="container mt-4">
                    <div className="flex justify-between gap-4 mb-4">
                        <h1 className="text-3xl">Event Calendar</h1>
                    </div>
                    <div className="mb-4 hidden lg:grid grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="space-y-0 pb-2 col-span-2">
                                <CardTitle className="text-sm font-2xl">Your Calendar</CardTitle>
                                <CardDescription>A full list of all events you are invited to</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold"></div>
                                <p className="text-xs text-muted-foreground"></p>
                            </CardContent>
                        </Card>
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardDescription>RSVPs Left</CardDescription>
                                <CardTitle className="text-4xl">{eventList.length - completeResponsesCount}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Progress value={(completeResponsesCount / eventList.length) * 100} aria-label={eventList.length - completeResponsesCount + " left"} />
                            </CardContent>
                            <CardFooter>
                                <p className="text-xs text-muted-foreground">for coordination purposes</p>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                                <CalendarCheck2 className="-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{eventList.length}</div>
                                <p className="text-xs text-muted-foreground">Currently invited to</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid grid-cols-3 mt-4 gap-4">
                        <div className="col-span-3 lg:col-span-2">
                            d
                        </div>
                        <div className="col-span-3 lg:col-span-1">
                            <div className="flex flex-row justify-between items-center mb-4">
                                <p className="text-2xl font-bold">Next Event</p>
                                <Badge variant="destructive">Unanswered</Badge>
                            </div>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle className="text-2xl font-bold">{nextEvent.title}</CardTitle>
                                    <div className="flex flex-row gap-4">
                                        <Link href={"/calendar/view/" + nextEvent.id}>
                                            <Button variant="outline" size="icon">
                                                <Eye />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-5">
                                        <div className="flex flex-row justify-start gap-4">
                                            <Badge variant="secondary">{nextEvent.eventType}</Badge>
                                            <Badge variant="outline">{nextEvent.inviteRigidity}</Badge>
                                        </div>

                                        <div>
                                            <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                <Clock className="h-5 w-5"/>
                                                <p>Date / Time</p>
                                            </div>
                                            <p className="text-muted-foreground">{format(nextEvent.eventStart, "MM/dd/yyyy h:mm a")} - {format(nextEvent.eventEnd, "MM/dd/yyyy h:mm a")}</p>
                                        </div>

                                        <div>
                                            <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                <MapPin className="h-5 w-5"/>
                                                <p>Location</p>
                                            </div>
                                            <p className="text-muted-foreground">{nextEvent.address ? nextEvent.address : "None provided"}</p>
                                        </div>

                                        <div>
                                            <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                <LetterText className="h-5 w-5"/>
                                                <p>Description</p>
                                            </div>
                                            <p className="text-muted-foreground">{nextEvent.description ? nextEvent.description : "No description provided"}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <Footer/>
            </>
        );
    }catch (e){
        console.log(e)
        return(
            <p>OOPS!</p>
        );
    }
}