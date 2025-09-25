'use client'
import Footer from "@/components/Footer";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {
    CalendarDays, CalendarPlus,
    Check,
    CircleHelp,
    Clock,
    House,
    LetterText,
    MapPin, NotebookPen,
    PersonStanding, UserRoundPen,
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
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {FRResponse} from "@/app/api/user/connections/incoming/route";
import { toast } from "sonner"


type ValuePiece = Date | null;
type calendarDate = ValuePiece | [ValuePiece, ValuePiece];

export interface Props {
    userId:string
}

export default function DynamicContent({userId} : Props) {
    const [loading, setLoading] = useState(true);
    const [nextEvent, setNextEvent] = useState<NEResponse | null>();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [RSVPs, setRSVPs] = useState<EIResponse[]>([]);
    const [recievedFollows, setRecievedFollows] = useState([]);

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

    const highlightDates = ({date, view}: {date: Date, view: string}) => {
        if(view === 'month'){

            // Check if date exists in the startDates

            if(RSVPs.filter((d) => new Date(d.event.eventStart).getDate() === date.getDate() && new Date(d.event.eventStart).getMonth() === date.getMonth() && new Date(d.event.eventStart).getFullYear() === date.getFullYear()).length > 0){
                return 'highlight-date'
            }
        }
    };

    async function refresh(){
        setLoading(true);

        await axios.get("/api/user/connections/incoming")
            .then((response) => {
                setRecievedFollows(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

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
                .then(() => toast("RSVP Updated", {description: "Changed response to: " + response}))
                .finally(refresh);
        }catch (e){
            console.log(e)
        }
    }

    async function respondFR(response:boolean, senderId:string){
        await axios.post("/api/user/connections/respond", {response: response, senderId: senderId, guests: 0})
            .then(() => toast("Request" + (response? "Accepted" : "Rejected"), {description: "Request deleted"}))
            .then(refresh)
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        refresh()
    }, []);

    return (
        <>
            {loading && <LoadingIcon/>}
            <div className="w-100 lg:h-screen grid grid-cols-1 lg:grid-cols-4">
                <div className="lg:col-span-3 lg:h-100 lg:overflow-y-scroll lg:flex flex-col">
                    {/*<div className="top-left-gradient">*/}
                    {/*    <div className="container flex-col flex gap-3 py-3">*/}
                    {/*        <div className="flex flex-row justify-start items-center gap-3">*/}
                    {/*            <Image src="/icons/Logo.svg" alt="EventStar Logo" width={50} height={50}/>*/}
                    {/*            <p className="text-3xl font-bold">EventStar Home</p>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className="container mt-4">
                        <Carousel>
                            <CarouselContent>
                                <CarouselItem>
                                    <div>
                                        <Card style={{
                                            backgroundImage: `url('/tiles/logoTiles.svg')`,
                                            backgroundSize: '120px'
                                        }} className="rounded-none">
                                            <CardContent className="flex items-center flex-col justify-center p-6 my-10">
                                                <div className="flex flex-row justify-start gap-5 items-center">
                                                    <Image src={"/icons/Logo.svg"} alt={"EventStar logo"} width={100} height={100}/>
                                                    <div>
                                                        <span className="text-4xl md:text-6xl font-semibold">EventStar</span>
                                                        <p className="text-muted-foreground ml-1">A Costi Online Service</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            </CarouselContent>
                        </Carousel>
                        <p className="text-muted-foreground text-xs mb-5">Version 4.5.0</p>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                                    <CalendarDays className="-4 w-4 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{RSVPs.length}</div>
                                    <p className="text-xs text-muted-foreground">For your account</p>
                                </CardContent>
                            </Card>
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">RSVP Responses</CardTitle>
                                    <UserRoundPen className="-4 w-4 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {RSVPs.filter((r) => r.response === "YES").length + " / "}
                                        {RSVPs.filter((r) => r.response === "NO").length + " / "}
                                        {RSVPs.filter((r) => r.response === "MAYBE").length + " / "}
                                        {RSVPs.filter((r) => r.response === "NO_RESPONSE").length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Yes / No / Maybe / None</p>
                                </CardContent>
                            </Card>
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Your Events</CardTitle>
                                    <NotebookPen className="-4 w-4 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {RSVPs.filter((r) => r.event.author.id === userId).length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Events you posted</p>
                                </CardContent>
                            </Card>
                        </div>

                        {recievedFollows.length > 0 &&
                            <p className="text-xl font-bold mt-5 mb-2">Incoming Follow Requests</p>}
                        {recievedFollows.map((followRequest: FRResponse) => (
                            <Card key={followRequest.id} className="rounded-none mb-5">
                                <CardContent className="flex flex-row justify-between items-center pt-5">
                                    <div className="flex flex-row justify-start items-center gap-3">
                                        <div>
                                            <AvatarIcon image={followRequest.sender.image} name={followRequest.sender.name} size={"small"}/>
                                        </div>
                                        <p className="font-bold text-xl">{followRequest.sender.name}</p>
                                    </div>
                                    <div className="lg:flex flex-col items-center hidden h-100">
                                        <p className="text-center">{format(new Date(followRequest.updatedAt), "PPP")}</p>
                                    </div>
                                    <div className="flex flex-row justify-end items-center gap-3">
                                        <Button variant="secondary" size="icon" onClick={() => respondFR(true, followRequest.sender.id)}><Check className="h-4 w-4"/></Button>
                                        <Button variant="outline" size="icon" onClick={() => respondFR(false, followRequest.sender.id)}><X className="h-4 w-4"/></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Card className="p-5 top-left-gradient rounded-none my-5">
                            <div className="flex flex-col md:flex-row justify-start items-center mb:items-start gap-10">
                                <Image src="/agent/wave.gif" alt="loading" width={200} height={200} className="mb-5 md:mb-0" unoptimized={true}/>
                                <div>
                                    <CardTitle className="text-4xl mb-4">Welcome back!</CardTitle>
                                    <p className="mb-3">This is where you&#39;ll see all the important stuff about you and your events. To see more events you&#39;re invited to, simply go to the feed tab!</p>
                                    <p className="mb-3">Below, you&#39;ll see the next event you&#39;re invited to. On desktop, you can take a look on the right side to see a calendar and the events that happen on days you click on. You can even RSVP to events while staying on this page for your convenience.</p>
                                    <p className="mb-6">Oh, also if you want to make your own event invites, just go to the box with a plus icon in the menu and start filling in the deetz! Just make sure you have your guests follow your account first.</p>
                                    <Link href="/feed" className="mr-3"><Button>View Feed</Button></Link>
                                    <Link href="/eventDetails"><Button>Create new Event</Button></Link>
                                </div>
                            </div>
                        </Card>

                        <p className="text-xl font-bold mt-5 mb-2">Next event</p>
                        <Card className="rounded-none mb-5">
                            {nextEvent ? (
                                <>
                                    <CardHeader>
                                        <div className="flex flex-col md:flex-row items-center justify-between space-y-0 gap-2">
                                            <CardTitle className="text-3xl">{nextEvent.event.title}</CardTitle>
                                            <div className="md:flex flex-row justify-end gap-3">
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
                                                <div className="flex flex-col md:flex-row justify-center gap-3 pt-3 md:pt-0">
                                                    <Link target="_blank"
                                                          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(nextEvent.event.title)}&dates=${encodeURIComponent(format(new Date(nextEvent.event.eventStart), "yyyyMMdd'T'HHmmss") + '/' + format(new Date(nextEvent.event.eventEnd), "yyyyMMdd'T'HHmmss"))}&details=${encodeURIComponent(nextEvent.event.description)}&location=${encodeURIComponent(nextEvent.event.address)}`}>
                                                        <Button variant="outline"
                                                                className="flex items-center justify-center gap-2 w-full">
                                                            <CalendarPlus/>
                                                            Add to Calendar
                                                        </Button>
                                                    </Link>
                                                    <Link href={"/event/" + nextEvent.event.id} className="w-full">
                                                        <Button className="flex items-center justify-center w-full">View Event</Button>
                                                    </Link>
                                                </div>
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
                                        <p className="text-muted-foreground overflow-x-hidden">{nextEvent.event.description ? nextEvent.event.description : "No description provided"}</p>
                                    </CardContent>
                                </>
                            ) : (
                                <div className="flex flex-col justify-center items-center py-5">
                                    <Image src="/agent/empty.png" height={200} width={200} alt="No events found"/>
                                    <p className="p-8 font-bold">No events planned</p>
                                </div>
                            )}
                        </Card>

                        <p className="text-xl font-bold mt-5 mb-2">Frequent Pages</p>
                        <div className="my-5 flex justify-center gap-10 align-center">
                            <Link className="flex flex-col items-center gap-2" href="/feed">
                                <Image src="/icons/Feed.svg" className="hover-minimize" alt="feed" width="80" height="80"/>
                                <p className="font-bold text-center">Feed</p>
                            </Link>
                            <Link className="flex flex-col items-center gap-2" href="/feed">
                                <Image src="/icons/NewEvent.svg" className="hover-minimize" alt="new event" width="80" height="80"/>
                                <p className="font-bold text-center">Create Event</p>
                            </Link>
                        </div>

                        <Footer/>
                    </div>
                </div>
                <div className="h-100 border-l-2 white-gradient lg:h-100 lg:overflow-y-scroll hidden lg:block">
                    <div className="border-b-2 w-100">
                        <div className="max-w-md mx-auto pb-4">
                            <Calendar calendarType="gregory" onChange={changeDate} value={selectedDate} tileClassName={highlightDates} />
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
