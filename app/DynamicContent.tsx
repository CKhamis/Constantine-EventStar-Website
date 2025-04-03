'use client'
import Footer from "@/components/Footer";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {
    CalendarCheck2, CalendarPlus,
    Check,
    CircleHelp,
    Clock,
    House,
    LetterText,
    MapPin,
    PersonStanding,
    View,
    X
} from "lucide-react";
import Calendar from 'react-calendar'
import '@/components/Calendar.css';
import {useEffect, useState} from "react";
import axios from "axios";
import Image from "next/image";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {format} from "date-fns";
import {NEResponse} from "@/app/api/events/next/route";
import AvatarIcon from "@/components/AvatarIcon";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {LoadingIcon} from "@/components/LoadingIcon";
import Link from "next/link";
import {EIResponse} from "@/app/api/events/invited/route";

type ValuePiece = Date | null;
type calendarDate = ValuePiece | [ValuePiece, ValuePiece];

export default function DynamicContent() {
    const [loading, setLoading] = useState(true);
    const [nextEvent, setNextEvent] = useState<NEResponse | null>();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [RSVPs, setRSVPs] = useState<EIResponse[]>([]);

    function changeDate(date: calendarDate) {
        if(!Array.isArray(date)) {
            setSelectedDate(date ?? new Date());
            return;
        }
        if(date === null){
            setSelectedDate(new Date());
            return;
        }
        setSelectedDate(date[0] ?? date[1] ?? new Date());
    }

    async function refresh(){
        setLoading(true);

        await axios.get("/api/events/next")
            .then((response) => {
                if(response.data.message){
                    setNextEvent(null)
                }else{
                    setNextEvent(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });

        await axios.get("/api/events/invited")
            .then((response) => {
                setRSVPs(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        setLoading(false);
    }

    async function updateRSVP(eventId: string, response: string){
        setLoading(true);
        try{
            await axios.post(`/api/events/rsvp/${eventId}`, {response: response})
                .finally(refresh);
        }catch (e){
            console.log(e)
        }
    }

    useEffect(() => {
        refresh()
    }, []);

    return (
        <>
            {loading && <LoadingIcon/>}
            <div className="w-100 lg:h-screen grid grid-cols-1 lg:grid-cols-4">
                <div className="lg:col-span-3 lg:h-100 lg:overflow-y-scroll lg:flex flex-col">
                    <div className="top-left-gradient">
                        <div className="container flex-col flex gap-3 py-3">
                            <div className="flex flex-row justify-start items-center gap-3">
                                <Image src="/icons/Logo.svg" alt="EventStar Logo" width={50} height={50}/>
                                <p className="text-3xl font-bold">EventStar Home</p>
                            </div>
                        </div>
                    </div>
                    <div className="container mt-4">
                        <p className="mb-3 font-bold text-4xl"></p>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                                    <CalendarCheck2 className="-4 w-4 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">r</div>
                                    <p className="text-xs text-muted-foreground">Currently in database</p>
                                </CardContent>
                            </Card>
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">RSVP Frequency</CardTitle>
                                    <CalendarCheck2 className="-4 w-4 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1 / 1 / 1 / 1</div>
                                    <p className="text-xs text-muted-foreground">Currently in database</p>
                                </CardContent>
                            </Card>
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">RSVP Frequency</CardTitle>
                                    <CalendarCheck2 className="-4 w-4 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1 / 1 / 1 / 1</div>
                                    <p className="text-xs text-muted-foreground">Currently in database</p>
                                </CardContent>
                            </Card>
                        </div>

                        <p className="text-xl font-bold mt-5 mb-2">Next event</p>
                        <Card className="rounded-none mb-5">
                            {nextEvent ? (
                                <>
                                    <CardHeader>
                                        <div className="flex flex-row items-center justify-between space-y-0 gap-2">
                                            <CardTitle className="text-3xl">{nextEvent.event.title}</CardTitle>
                                            <div className="flex flex-row justify-end gap-3">
                                                <ToggleGroup type="single" variant="default" defaultValue={nextEvent.response} disabled={new Date(nextEvent.event.rsvpDuedate) < new Date()}>
                                                    <ToggleGroupItem value="YES" aria-label="Toggle check" onClick={() => updateRSVP(nextEvent.event.id, "YES")}>
                                                        <Check className="h-4 w-4"/>
                                                    </ToggleGroupItem>
                                                    <ToggleGroupItem value="MAYBE" aria-label="Toggle question" onClick={() => updateRSVP(nextEvent.event.id, "MAYBE")}>
                                                        <CircleHelp className="h-4 w-4"/>
                                                    </ToggleGroupItem>
                                                    <ToggleGroupItem value="NO" aria-label="Toggle x" onClick={() => updateRSVP(nextEvent.event.id, "NO")}>
                                                        <X className="h-4 w-4"/>
                                                    </ToggleGroupItem>
                                                </ToggleGroup>
                                                <Link target="_blank"
                                                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(nextEvent.event.title)}&dates=${encodeURIComponent(format(new Date(nextEvent.event.eventStart), "yyyyMMdd'T'HHmmss") + '/' + format(new Date(nextEvent.event.eventEnd), "yyyyMMdd'T'HHmmss"))}&details=${encodeURIComponent(nextEvent.event.description)}&location=${encodeURIComponent(nextEvent.event.address)}`}>
                                                    <Button variant="outline"
                                                            className="flex items-center justify-center gap-2 w-full">
                                                        <CalendarPlus/>
                                                        Add to Calendar
                                                    </Button>
                                                </Link>
                                                <Link href={"/event/" + nextEvent.event.id}><Button>View Event</Button></Link>
                                            </div>
                                        </div>
                                        {/*<p className="text-xs text-muted-foreground">{format(new Date(nextEvent.event.eventStart), "M/dd/yyyy hh:mm a")} - {format(new Date(nextEvent.event.eventEnd), "M/dd/yyyy hh:mm a")}</p>*/}
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-3">
                                        <div>
                                            <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                <House className="h-5 w-5"/>
                                                <p>Event Host</p>
                                            </div>
                                            <div className="flex flex-row items-center justify-start gap-2 mt-2">
                                                <AvatarIcon image={nextEvent.event.author.image}
                                                            name={nextEvent.event.author.name} size="xsmall"/>
                                                <p className="text-muted-foreground">{nextEvent.event.author.name}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                <Clock className="h-5 w-5"/>
                                                <p>Date / Time</p>
                                            </div>
                                            <p className="text-muted-foreground">{format(nextEvent.event.eventStart, "MM/dd/yyyy h:mm a")} - {format(nextEvent.event.eventEnd, "MM/dd/yyyy h:mm a")}</p>
                                        </div>

                                        <div>
                                            <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                <MapPin className="h-5 w-5"/>
                                                <p>Location</p>
                                            </div>
                                            <p className="text-muted-foreground">{nextEvent.event.address ? nextEvent.event.address : "None provided"}</p>
                                        </div>

                                        <div>
                                            <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                <View className="h-5 w-5"/>
                                                <p>Event Visibility</p>
                                            </div>
                                            <p className="text-muted-foreground">{nextEvent.event.inviteVisibility}</p>
                                        </div>

                                        <div>
                                            <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                                <PersonStanding className="h-5 w-5"/>
                                                <p>Response</p>
                                            </div>
                                            {nextEvent.response === "NO_RESPONSE" ?
                                                <Badge variant="destructive">Unanswered</Badge> :
                                                <p className="text-muted-foreground">{nextEvent.response}</p>}

                                        </div>
                                    </CardContent>
                                    <CardContent>
                                        <div className="flex flex-row justify-start gap-2 items-center mb-1">
                                            <LetterText className="h-5 w-5"/>
                                            <p>Description</p>
                                        </div>
                                        <p className="text-muted-foreground">{nextEvent.event.description ? nextEvent.event.description : "No description provided"}</p>
                                    </CardContent>
                                </>
                            ) : (
                                <div className="flex flex-col justify-center items-center py-5">
                                    <img src="/agent/empty.png" alt="No events found"/>
                                    <p className="p-10 font-bold">No upcoming events</p>
                                </div>
                            )}
                        </Card>
                        <Footer/>
                    </div>
                </div>
                <div className="h-100 border-l-2 white-gradient lg:h-100 lg:overflow-y-scroll hidden lg:block">
                    <div className="border-b-2 w-100">
                        <div className="max-w-md mx-auto pb-4">
                            <Calendar calendarType="gregory" onChange={changeDate} value={selectedDate} />
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto p-5">
                        <p className="text-2xl font-bold text-center mb-5">Events on {format(selectedDate, "PPP")}</p>
                        {RSVPs
                            .filter((e) => new Date(e.event.eventStart).getDate() === selectedDate.getDate() && new Date(e.event.eventStart).getMonth() === selectedDate.getMonth() && new Date(e.event.eventStart).getFullYear() === selectedDate.getFullYear())
                            .length === 0? (
                            <div className="w-100 h-100 flex justify-center flex-col items-center">
                                <Image src="/agent/empty.png" height={200} width={200} alt="" className="mt-10"/>
                                <p className="font-bold text-3xl mb-5">Event not found</p>
                            </div>
                        ) : (<></>)}
                        {RSVPs
                            .filter((e) => new Date(e.event.eventStart).getDate() === selectedDate.getDate() && new Date(e.event.eventStart).getMonth() === selectedDate.getMonth() && new Date(e.event.eventStart).getFullYear() === selectedDate.getFullYear())
                            .sort((a, b) => {return new Date(a.event.eventStart).getTime() - new Date(b.event.eventStart).getTime()})
                            .map((rsvp) => (
                            <Card key={rsvp.id} className="mb-4 rounded-none">
                                <CardHeader className="flex flex-col justify-center">
                                    <p className="text-2xl font-bold text-center">{rsvp.event.title}</p>
                                    <p className="text-muted-foreground text-center">by {rsvp.event.author.name}</p>
                                    <ToggleGroup type="single" variant="default" defaultValue={rsvp.response} disabled={new Date(rsvp.event.rsvpDuedate) < new Date()}>
                                        <ToggleGroupItem value="YES" aria-label="Toggle check" onClick={() => updateRSVP(rsvp.event.id, "YES")}>
                                            <Check className="h-4 w-4"/>
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="MAYBE" aria-label="Toggle question" onClick={() => updateRSVP(rsvp.event.id, "MAYBE")}>
                                            <CircleHelp className="h-4 w-4"/>
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="NO" aria-label="Toggle x" onClick={() => updateRSVP(rsvp.event.id, "NO")}>
                                            <X className="h-4 w-4"/>
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex flex-row justify-center gap-2 items-center mb-1">
                                            <Clock className="h-5 w-5"/>
                                            <p>Date / Time</p>
                                        </div>
                                        <p className="text-muted-foreground text-center">{format(rsvp.event.eventStart, "MM/dd/yyyy h:mm a")} - {format(rsvp.event.eventEnd, "MM/dd/yyyy h:mm a")}</p>
                                    </div>

                                    <div>
                                        <div className="flex flex-row justify-center gap-2 items-center mb-1">
                                            <MapPin className="h-5 w-5"/>
                                            <p>Location</p>
                                        </div>
                                        <p className="text-muted-foreground text-center">{rsvp.event.address ? rsvp.event.address : "None provided"}</p>
                                    </div>

                                    <div className="flex flex-row justify-center pt-5">
                                        <Link href={"/event/" + rsvp.event.id}><Button variant="secondary">View Event</Button></Link>
                                    </div>
                                </CardContent>
                            </Card>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}
