import AdminUI from "@/components/admin/AdminUI";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ChevronLeft, TriangleAlert} from "lucide-react";
import {EventWithRsvp} from "@/components/Types";
import axios from "axios";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

interface Props{
    params: {
        eventId: string;
    }
}

export default async function ViewEventPage({params}: Props){
    const {eventId} = await params;

    async function fetchEvent() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/view/${eventId}`);            return response.data;
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
                            <Card>
                                {eventData.title}
                                <br/>
                                {eventData.address}
                                <br/>
                                {eventData.description}
                            </Card>
                        </div>
                        <div className="flex flex-col gap-4 mb-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle className="text-2xl font-medium">Event Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Please select an event to view details</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }catch(_){
        return (
            <>
                <TopBar />
                <div className="flex items-center flex-col justify-center min-h-[300]">
                    <div className="flex flex-row gap-4 items-center mb-4">
                        <TriangleAlert className="h-10 w-10" />
                        <p className="text-xl font-bold">Error Finding Event</p>
                    </div>
                    <p>Please make sure the URL of the event is correct.</p>
                </div>
            </>
        );
    }
}