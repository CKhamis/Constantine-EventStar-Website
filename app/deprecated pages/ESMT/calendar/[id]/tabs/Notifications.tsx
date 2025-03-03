import {EventWithRsvpWithUserWithAccount} from "@/components/Types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import axios from "axios";

export interface Props {
    eventDetails: EventWithRsvpWithUserWithAccount;
    refresh: () => Promise<void>;
}

export default function Notifications({eventDetails, refresh}: Props){

    const sendNotification = async () => {
        try {
            await axios.post("/api/esmt/events/email/newEvent", {id: eventDetails.id, to: eventDetails.RSVP.filter((rsvp) => rsvp.User.newEventEmails).map((rsvp) => rsvp.User.email)})
                .then(refresh)
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    return (
        <>
            <div className="flex flex-row justify-between items-center mb-5">
                <p className="text-2xl font-bold mb-8">Event Attendance</p>
                <p>Notifications sent: {eventDetails.reminderCount}</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Send Email Notification</CardTitle>
                </CardHeader>
                <CardContent className="">
                    <p>Sends an email notification to all guests to the event. This event has {eventDetails.RSVP.length} guest{eventDetails.RSVP.length === 1? "" : "s"} and {eventDetails.RSVP.filter((rsvp) => rsvp.User.newEventEmails).length} have New Event Emails turned on.</p>
                    <Button onClick={sendNotification} className="mt-5">Send to All</Button>
                </CardContent>
            </Card>
        </>
    );
}