import {CalendarCheck, ChartSpline, IdCard, Star} from "lucide-react";

export default function About(){
    return (
        <>
            <p className="text-4xl font-bold mb-2">What is EventStar?</p>
            <p>EventStar is a brand new service developed by Constantine Khamis that will organize event information, automate invitation reminders, act as a rating systems for restaurants, and much more. To learn more, please read through this page carefully.</p>
            <p className="text-3xl font-bold mb-2 mt-5">Features</p>
            <p>While EventStar is still in active construction, here is a short list of features you can expect now or in the future:</p>
            <ul className="mt-4">
                <li className="flex flex-row justify-start gap-5 mb-5">
                    <div className="flex-shrink-0">
                        <CalendarCheck className="w-10 h-10"/>
                    </div>
                    <div>
                        <p className="font-bold text-xl">Plan, Track, and Check into Events</p>
                        <p className="text-muted-foreground">With EventStar, members can see the events they are invited to, respond to whether they will attend, and view other members&#39; responses. They can also access the full history of events they have attended or plan to attend at any time.</p>
                    </div>
                </li>
                <li className="flex flex-row justify-start gap-5 mb-5">
                    <div className="flex-shrink-0">
                        <ChartSpline className="w-10 h-10"/>
                    </div>
                    <div>
                        <p className="font-bold text-xl">Track and Earn Points</p>
                        <p className="text-muted-foreground">EventStar offers its own reward service just for using the platform. Points can be redeemed for various rewards, such as a high five, a goodnight text, or even the chance to gamble and double your points!</p>
                    </div>
                </li>
                <li className="flex flex-row justify-start gap-5 mb-5">
                    <div className="flex-shrink-0">
                        <IdCard className="w-10 h-10"/>
                    </div>
                    <div>
                        <p className="font-bold text-xl">Your Very own Membership Card</p>
                        <p className="text-muted-foreground">Certain EventStar members will receive a custom-made NFC-compatible membership card. This card can be used to validate attendance at events. Use this card to check in instead of entering your 4-digit PIN in the EventStar terminal.</p>
                    </div>
                </li>
                <li className="flex flex-row justify-start gap-5 mb-5">
                    <div className="flex-shrink-0">
                        <Star className="w-10 h-10"/>
                    </div>
                    <div>
                        <p className="font-bold text-xl">Rate Spots with Friends</p>
                        <p className="text-muted-foreground">The spots feature allows you and others to rate and add locations for selection during regular hangouts. You can rate places on a 0-100 scale, apply a veto restriction, and see how other members have rated a particular location.</p>
                    </div>
                </li>
            </ul>
            <p>More features are expected to release soon!</p>
            <p className="text-3xl font-bold mb-2 mt-5">EventStar Terminal</p>
            <p>EventStar will be a physical device located in the host's residence. This device will include a keypad and NFC reader. Members are expected to check in with this machine when they arrive to validate their RSVP status. Checking in with a 4-digit pin and scanning a membership card are both valid ways of checking in. Members are eligible to earn points using this device rather than having the host manually enter it.</p>
        </>
    );
}