'use client'

import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import Image from "next/image";
import axios from "axios";
import {EIResponse} from "@/app/api/events/invited/route";
import {EVResponse} from "@/app/api/events/view/[id]/route";

export interface Props {
    eventId: string,
}

export default function DynamicContent({eventId}: Props) {
    const [loading, setLoading] = useState(true);
    const [RSVP, setRSVP] = useState<EIResponse | null>();
    const [eventInfo, setEventInfo] = useState<EVResponse | null>();

    async function refresh(){
        setLoading(true);
        await axios.get("/api/events/view/" + eventId)
            .then((response) => {
                // Event exists, but can either be just event or rsvp + event

                // Data can either be event or rsvp + event
                if(response.data.event){
                    setEventInfo(response.data.event);
                    setRSVP(response.data);
                }else{
                    setEventInfo(response.data);
                    setRSVP(null);
                }
            })
            .catch((error) => {
                console.log(error.status); // event not found, access denied, or need login
            });
        setLoading(false);
    }

    useEffect(() => {
        refresh()
    }, []);

    return (
        <>
            {loading && <LoadingIcon/>}
            <div className="w-100 lg:h-screen grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 lg:h-100 lg:overflow-y-scroll">
                    <div className="top-left-gradient">
                        <div className="container flex-col flex gap-3 py-3 max-w-5xl">
                            <div className="flex flex-row justify-start items-center gap-3 ">
                                <Image src="/icons/Events.svg" alt="Event icon" width={50} height={50}/>
                                <p className="text-3xl font-bold">Event Details</p>
                            </div>
                        </div>
                    </div>
                    <div className="container flex-col flex gap-3 py-3 max-w-5xl">
                        {eventInfo? (
                            <p>{eventInfo.title}</p>
                        ) : (
                            <p>Event not found</p>
                        )}
                    </div>
                </div>
                <div className="h-100 bg-amber-600">
                    {RSVP ? (
                        <p>{RSVP.response}</p>
                    ) : (
                        <p>Please log in with an autorized acc to rsvp</p>
                    )}
                </div>
            </div>
        </>
    );
}