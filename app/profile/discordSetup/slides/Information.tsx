import Image from "next/image";

export default function Information(){
    return (
        <div className="p-5">
            <p className="text-4xl font-bold mb-2">How does it work?</p>
            <p className="mt-2">EventStar is able to directly message your Discord account for certain events and reminders.</p>
            <p className="mt-2">The amount of notifications you receive is completely up to you and can be decided on an event-by-event basis. Notifications can remind you to RSVP to an event if you haven't already, notify you when new events are created, and let you know when an event is starting if you signed up for it.</p>
            <p className="mt-2">This setup process will allow you to set a default notification amount. This default amount can be changed at any time after setup.</p>
            <p className="mt-2">More details about notification settings will appear in a later slide.</p>
        </div>
    );
}