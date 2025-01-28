"use client"
import {
    CalendarCheck2, Check, CircleHelp,
    Clock,
    LetterText, MapPin, TicketCheck, X,
} from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import axios from "axios";
import {Progress} from "@/components/ui/progress";
import {RsvpWithEvent} from "@/components/Types";
import Image from "next/image";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";

export interface Props {
    userId: string
}

export default function DynamicContent({userId}: Props) {
    const [loading, setLoading] = useState(true);
    const [eventList, setEventList] = useState<RsvpWithEvent[]>([]);
    const [completeResponsesCount, setCompleteResponsesCount] = useState(0);
    const [responseCounts, setResponseCounts] = useState<{
        YES?: number,
        MAYBE?: number,
        NO?: number,
        NO_RESPONSE?: number
    }>({YES: 0, NO: 0, MAYBE: 0, NO_RESPONSE: 0});
    const [nextRSVP, setNextRSVP] = useState<RsvpWithEvent | undefined>(undefined);

    const today = new Date();

    const refresh = async () => {
        try {
            setLoading(true);
            await axios.post("/api/events/upcoming", {id: userId})
                .then((response) => {
                    setEventList(response.data);
                    return response.data;
                })
                .then(() => {
                    setCompleteResponsesCount(eventList.filter((rsvp) => rsvp.response !== "NO_RESPONSE").length);
                    setResponseCounts(eventList.reduce((counts, rsvp) => {
                        counts[rsvp.response] = (counts[rsvp.response] || 0) + 1;
                        return counts;
                    }, {}));
                    setNextRSVP(eventList
                        .filter(rsvp => (rsvp.response === "YES" || rsvp.response === "MAYBE") && new Date(rsvp.event.eventStart) >= today)
                        .sort((a, b) => new Date(a.event.eventStart).getUTCDate() - new Date(b.event.eventStart).getUTCDate())
                        .at(0));
                })
                .finally(() => setLoading(false));

        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => {
        refresh()
    }, [])

    if (loading) {
        return (
            <LoadingIcon />
        );
    }

    return (
        <div className="container mt-4">
            <div className="flex justify-between gap-4 mb-4">
                <h1 className="text-3xl">Event Calendar</h1>
            </div>
            <div className="mb-4 hidden lg:grid grid-cols-4 gap-4">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardDescription>Unanswered RSVPs</CardDescription>
                        <CardTitle className="text-4xl">{eventList.length - completeResponsesCount} {eventList.length - completeResponsesCount === 1? 'Event' : 'Events'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(completeResponsesCount / eventList.length) * 100} aria-label={eventList.length - completeResponsesCount + " left"} />
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">Please reply to all RSVPs</p>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
                        <TicketCheck className="-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{eventList.length}</div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">Currently invited for</p>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Your Responses</CardTitle>
                        <CalendarCheck2 className="-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{responseCounts.YES? responseCounts.YES : 0} / {responseCounts.MAYBE? responseCounts.MAYBE : 0} / {responseCounts.NO? responseCounts.NO : 0} / {responseCounts.NO_RESPONSE? responseCounts.NO_RESPONSE : 0}</div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">Yes / No / Maybe / No response</p>
                    </CardFooter>
                </Card>
            </div>
            <div className="grid grid-cols-3 mt-4 gap-4 mb-10">
                {/*<div className="col-span-3 lg:col-span-2">*/}
                {/*    <EventTable data={eventsOnly}/>*/}
                {/*</div>*/}
                <div className="col-span-3 lg:col-span-2">
                    <p className="text-2xl font-bold mb-5">All Events ({eventList.length})</p>
                    {eventList.map((event) => {
                        return (
                            <Card key={event.id} className="mb-4">
                                <CardHeader>
                                    <div className="flex flex-row items-center justify-between space-y-0 gap-2">
                                        <CardTitle className="text-2xl">{event.event.title}</CardTitle>
                                        <div>
                                            <ToggleGroup type="single" variant="default" defaultValue={event.response} disabled={new Date(event.event.rsvpDuedate) < new Date()}>
                                                <ToggleGroupItem value="YES" aria-label="Toggle check">
                                                    <Check className="h-4 w-4" />
                                                </ToggleGroupItem>
                                                <ToggleGroupItem value="MAYBE" aria-label="Toggle question">
                                                    <CircleHelp className="h-4 w-4" />
                                                </ToggleGroupItem>
                                                <ToggleGroupItem value="NO" aria-label="Toggle x">
                                                    <X className="h-4 w-4" />
                                                </ToggleGroupItem>
                                            </ToggleGroup>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{format(new Date(event.event.eventStart), "M/dd/yyyy hh:mm a")} - {format(new Date(event.event.eventEnd), "M/dd/yyyy hh:mm a")}</p>
                                </CardHeader>
                                <CardContent>
                                    {event.event.description}
                                </CardContent>
                                <CardFooter>
                                    <Link href={"/calendar/view/" + event.event.id}><Button>View Event</Button></Link>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
                {nextRSVP ?
                    <div className="col-span-3 lg:col-span-1">
                        <div className="flex flex-row justify-between items-center mb-4">
                            <p className="text-2xl font-bold">Next Event</p>
                            {nextRSVP.response === "NO_RESPONSE" ?
                                <Badge variant="destructive">Unanswered</Badge>
                                :
                                <Badge variant="outline">Responded</Badge>
                            }
                        </div>
                        <Card className="mb-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="text-2xl font-bold">{nextRSVP.event.title}</CardTitle>
                                <div className="flex flex-row gap-4">
                                    <Link href={"/calendar/view/" + nextRSVP.event.id}>
                                        <Button variant="secondary">
                                            View
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-5">
                                    <div className="flex flex-row justify-start gap-4">
                                        <Badge variant="secondary">{nextRSVP.event.eventType}</Badge>
                                        <Badge variant="outline">{nextRSVP.event.inviteRigidity}</Badge>
                                    </div>

                                    <div>
                                        <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                            <Clock className="h-5 w-5"/>
                                            <p>Date / Time</p>
                                        </div>
                                        <p className="text-muted-foreground">{format(nextRSVP.event.eventStart, "MM/dd/yyyy h:mm a")} - {format(nextRSVP.event.eventEnd, "MM/dd/yyyy h:mm a")}</p>
                                    </div>

                                    <div>
                                        <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                            <MapPin className="h-5 w-5"/>
                                            <p>Location</p>
                                        </div>
                                        <p className="text-muted-foreground">{nextRSVP.event.address ? nextRSVP.event.address : "None provided"}</p>
                                    </div>

                                    <div>
                                        <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                            <LetterText className="h-5 w-5"/>
                                            <p>Description</p>
                                        </div>
                                        <p className="text-muted-foreground">{nextRSVP.event.description ? nextRSVP.event.description : "No description provided"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    :
                    <div className="flex flex-col items-center justify-center">
                        <Image src="/agent/waiting.png" alt={"awkward"} height={200} width={200}/>
                        <p className="text-center text-2xl font-bold">No Events</p>
                    </div>
                }
            </div>
        </div>
    );
}