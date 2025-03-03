import {Bell, Binoculars, CalendarCheck, ChartSpline, IdCard, Star, UserCheck} from "lucide-react";

export default function About(){
    return (
        <div className="p-5">
            <p className="text-4xl font-bold mb-2">What is EventStar?</p>
            <p>EventStar is a brand new service developed by Constantine Khamis that will organize event information, handle invitation reminders, and much more. To learn more about its various features, please read through this page carefully.</p>
            <p className="text-3xl font-bold mb-2 mt-5">How it Works</p>
            <p>EventStar sets itself apart through its account-based system. All guests will get their own account they can use to RSVP to events, view statistics about their event habits, follow event planners, or even become an event planner themselves.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ul className="mt-4 flex flex-col gap-6 p-2">
                    <p className="text-2xl font-bold w-100 border-b-2">Event Planners</p>
                    <li className="flex flex-row justify-start gap-5 mb-5">
                        <div className="flex-shrink-0">
                            <CalendarCheck className="w-10 h-10"/>
                        </div>
                        <div>
                            <p className="font-bold text-xl">Plan Events</p>
                            <p className="text-muted-foreground">EventStar allows event planners to modify their events exactly to their liking. This includes background images, descriptions, titles, invite lists, and more!</p>
                        </div>
                    </li>
                    <li className="flex flex-row justify-start gap-5 mb-5">
                        <div className="flex-shrink-0">
                            <IdCard className="w-10 h-10"/>
                        </div>
                        <div>
                            <p className="font-bold text-xl">See Who&#39;s Coming</p>
                            <p className="text-muted-foreground">Event Planners can see ethe full RSVP list for their events. They can also customize how the invitation list will appear to guests.</p>
                        </div>
                    </li>
                    <li className="flex flex-row justify-start gap-5 mb-5">
                        <div className="flex-shrink-0">
                            <ChartSpline className="w-10 h-10"/>
                        </div>
                        <div>
                            <p className="font-bold text-xl">Track Punctuality</p>
                            <p className="text-muted-foreground">Event Planners will gain access to powerful tools to analyze overall attendance and punctuality of their events and followers.</p>
                        </div>
                    </li>
                    {/*<li className="flex flex-row justify-start gap-5 mb-5">*/}
                    {/*    <div className="flex-shrink-0">*/}
                    {/*        <Star className="w-10 h-10"/>*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*        <p className="font-bold text-xl">Rate Spots with Friends</p>*/}
                    {/*        <p className="text-muted-foreground">The spots feature allows you and others to rate and add locations for selection during regular hangouts. You can rate places on a 0-100 scale, apply a veto restriction, and see how other members have rated a particular location.</p>*/}
                    {/*    </div>*/}
                    {/*</li>*/}
                </ul>
                <ul className="mt-4 flex flex-col gap-6 p-2">
                    <p className="text-2xl font-bold w-100 border-b-2">Guests</p>
                    <li className="flex flex-row justify-start gap-5 mb-5">
                        <div className="flex-shrink-0">
                            <Binoculars className="w-10 h-10"/>
                        </div>
                        <div>
                            <p className="font-bold text-xl">View Event Details</p>
                            <p className="text-muted-foreground">Guests of events can view all event details including location, meeting time, description, and other guests that are invited!</p>
                        </div>
                    </li>
                    <li className="flex flex-row justify-start gap-5 mb-5">
                        <div className="flex-shrink-0">
                            <UserCheck className="w-10 h-10"/>
                        </div>
                        <div>
                            <p className="font-bold text-xl">Follow Planners</p>
                            <p className="text-muted-foreground">Follow any event planner you like. You will see events they invited to you in your own calendar, where you can directly RSVP from!</p>
                        </div>
                    </li>
                    <li className="flex flex-row justify-start gap-5 mb-5">
                        <div className="flex-shrink-0">
                            <Bell className="w-10 h-10"/>
                        </div>
                        <div>
                            <p className="font-bold text-xl">Get Event Reminders</p>
                            <p className="text-muted-foreground">Event planners can choose to relay event reminders for their events, allowing you to be updated with new events or changes in existing ones.</p>
                        </div>
                    </li>
                    {/*<li className="flex flex-row justify-start gap-5 mb-5">*/}
                    {/*    <div className="flex-shrink-0">*/}
                    {/*        <Star className="w-10 h-10"/>*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*        <p className="font-bold text-xl">Rate Spots with Friends</p>*/}
                    {/*        <p className="text-muted-foreground">The spots feature allows you and others to rate and add locations for selection during regular hangouts. You can rate places on a 0-100 scale, apply a veto restriction, and see how other members have rated a particular location.</p>*/}
                    {/*    </div>*/}
                    {/*</li>*/}
                </ul>
            </div>
            <p className="pt-6 text-center">More features are expected to release soon!</p>
            {/*<p className="text-3xl font-bold mb-2 mt-5">EventStar Terminal</p>*/}
            {/*<p>EventStar will be a physical device located in the host&#39;s residence. This device will include a keypad and NFC reader. Members are expected to check in with this machine when they arrive to validate their RSVP status. Checking in with a 4-digit pin and scanning a membership card are both valid ways of checking in. Members are eligible to earn points using this device rather than having the host manually enter it.</p>*/}
        </div>
    );
}