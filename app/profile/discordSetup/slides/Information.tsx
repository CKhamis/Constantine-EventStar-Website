import Image from "next/image";

export default function Information(){
    return (
        <div className="p-5 flex flex-col gap-5">
            <p className="text-4xl font-bold mb-2">Discord Event Notifications</p>
            <p className="">EventStar can keep you updated automatically by sending event notifications straight to your Discord DMs.</p>
            <ul className="list-disc">
                <li>When an event is created</li>
                <li>Reminders to RSVP if you haven’t responded</li>
                <li>Reminders before events you’re attending</li>
                <li>More helpful updates over time</li>
            </ul>
            <p className="text-3xl font-bold mb-2">You’re in Control</p>
            <p>Choose how many notifications you want by default:</p>
            <ul className="list-disc">
                <li>None – No Discord messages</li>
                <li>Minimal – Creation + final reminder</li>
                <li>Standard – RSVP reminders + event reminders</li>
                <li>All – Full reminder coverage before RSVPs and events</li>
            </ul>
            <p>You can always adjust notification levels per event, so important events get more attention and casual ones stay quiet.</p>
            <p className="text-3xl font-bold mb-2">What You’ll See</p>
            <p>Each notification includes:</p>
            <ul className="list-disc">
                <li>Event name, date, and time</li>
                <li>Your RSVP status (when relevant)</li>
                <li>A direct link to the event page</li>
            </ul>
        </div>
    );
}