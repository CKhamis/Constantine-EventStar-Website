'use client'
import Footer from "@/components/Footer";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {CalendarCheck2} from "lucide-react";
import MainNav from "@/components/MainNav";
import Calendar from 'react-calendar'
import '@/components/Calendar.css';
import {useEffect, useState} from "react";
import {EIResponse} from "@/app/api/events/invited/route";
import axios from "axios";
import Image from "next/image";

export default function DynamicContent() {
    const [loading, setLoading] = useState(true);
    const [nextEvent, setNextEvent] = useState<EIResponse | null>();

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
        setLoading(false);
    }

    useEffect(() => {
        refresh()
    }, []);

    return (
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
                    <Card className="rounded-none">
                        {nextEvent? (
                            <>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <p className="text-3xl font-bold">{nextEvent.event.title}</p>
                                </CardHeader>
                            </>
                        ) : (
                            <div className="flex justify-center items-center">
                                <p className="p-10">No upcoming events</p>
                            </div>
                        )}
                    </Card>
                    <Footer/>
                </div>
            </div>
            <div className="h-100 border-l-2 white-gradient lg:h-100 lg:overflow-y-scroll hidden lg:block">
                <div className="border-b-2 w-100">
                    <div className="max-w-md mx-auto pb-4">
                        <Calendar calendarType="gregory"/>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto">


                </div>
            </div>
        </div>
    );
}
