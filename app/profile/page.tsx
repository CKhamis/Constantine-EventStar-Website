import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {Badge} from "@/components/ui/badge";
import DynamicContent from "@/app/profile/DynamicContent";
import axios from "axios";
import {AccountResponse, EventWithResponse, RsvpWithEvent} from "@/components/Types";

export default async function ProfilePage() {
    const session = await auth();

    if (!session || !session.user || !session.user.id){
        redirect("/api/auth/signin");
    }
    async function fetchEvents() {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/upcoming`, {id: session.user.id});
            return response.data;
        } catch (err) {
            console.error("Error fetching event:", err);
            return null;
        }
    }

    async function fetchAccountList() {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/connectedAccounts/all`,  {id: session.user.id});
            return response.data;
        } catch (err) {
            console.error("Error fetching accounts:", err);
            return null;
        }
    }

    const eventList:RsvpWithEvent[] = await fetchEvents();
    const eventsOnly:EventWithResponse[] = eventList.map((rsvp) => ({...rsvp.event, response: rsvp.response, arrival: rsvp.arrival}));

    const accountList:AccountResponse[] = await fetchAccountList();
    return (
        <>
            <TopBar/>
            <div className="container mt-4">
                <div className="flex justify-between gap-4 mb-4">
                    <h1 className="text-3xl">User Profile</h1>
                    <Badge>{session.user.role}</Badge>
                </div>
                <DynamicContent sessionUser={session.user} eventList={eventsOnly} initialAccountList={accountList}/>
            </div>
            <Footer/>
        </>
    )
}