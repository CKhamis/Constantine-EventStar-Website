import Image from "next/image";

export default function Information(){
    return (
        <div className="p-5 flex flex-col gap-4">
            <p className="text-4xl font-bold">Discord Evdent Notifications</p>
            <p className="">EventStar can keep you updated automatically by sending event notifications straight to your Discord DMs.</p>
            <ul className="list-disc ml-5">
                <li className="mt-3">When an event is created</li>
                <li className="mt-3">Reminders to RSVP if you haven’t responded</li>
                <li className="mt-3">Reminders before events you’re attending</li>
                <li className="mt-3">More helpful updates over time</li>
            </ul>
            <p className="text-3xl font-bold">You’re in Control</p>
            <p>Choose how many notifications you want by default:</p>
            <ul className="list-disc ml-5">
                <li className="mt-3">None – No Discord messages</li>
                <li className="mt-3">Minimal – Creation + final reminder</li>
                <li className="mt-3">Standard – RSVP reminders + event reminders</li>
                <li className="mt-3">All – Full reminder coverage before RSVPs and events</li>
            </ul>
            <p>You can always adjust notification levels per event, so important events get more attention and casual ones stay quiet.</p>
            <p className="text-3xl font-bold">What You’ll See</p>
            <p>Each notification includes:</p>
            <ul className="list-disc ml-5">
                <li className="mt-3">Event name, date, and time</li>
                <li className="mt-3">Your RSVP status (when relevant)</li>
                <li className="mt-3">A direct link to the event page</li>
            </ul>
        </div>
    );
}