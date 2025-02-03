import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ChevronLeft, TriangleAlert} from "lucide-react";
import {EventWithRsvp} from "@/components/Types";
import axios from "axios";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RsvpPanel from "@/app/calendar/view/[id]/RsvpPanel";
import GuestList from "@/app/calendar/view/[id]/GuestList";
import {auth} from "@/auth";
import Image from "next/image";
import EventDetailsPanel from "@/app/calendar/view/[id]/EventDetailsPanel";

type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}

export default async function ViewEventPage(props: { params: Params }){
    const session = await auth();

    if (!session || !session.user || !session.user.id){
        // redirect("/api/auth/signin");
        return (
            <div className="w-100 h-screen flex flex-col items-center justify-center p-10 top-left-gradient">
                <Image src="/agent/error.gif" alt="error" height={200} width={200} className="mb-5"/>
                <p className="text-4xl font-bold text-center">OOPS! You need to log in first!</p>
                <p className="mt-3">If you are invited, you should already have an account created for you</p>
                <Link href="/api/auth/signin" className="underline text-muted-foreground mt-3">Log In</Link>
            </div>
        )
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

    try {
        const eventData: EventWithRsvp = await fetchEvent();
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
                    <div className="grid items-start gap-5 lg:grid-cols-3 mt-5">
                        <div className="grid auto-rows-max items-start lg:col-span-2 mb-4">
                            <EventDetailsPanel eventData={eventData} role={session.user.role} />
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