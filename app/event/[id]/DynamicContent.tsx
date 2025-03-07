'use client'

import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import Image from "next/image";
import axios from "axios";
import {EIResponse} from "@/app/api/events/invited/route";

export interface Props {
    eventId: string,
}

export default function DynamicContent({eventId}: Props) {
    const [loading, setLoading] = useState(true);
    const [RSVPs, setRSVPs] = useState<EIResponse[]>([]);

    async function refresh(){
        setLoading(true);
        await axios.get("/api/events/view/" + eventId)
            .then((response) => {
                // setRSVPs(response.data);
                console.log(response);
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
        <>
            {loading && <LoadingIcon/>}
            <div className="w-100 lg:h-screen grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 h-100 overflow-y-scroll">
                    <div className="top-left-gradient">
                        <div className="container flex-col flex gap-3 py-3 max-w-5xl">
                            <div className="flex flex-row justify-start items-center gap-3 ">
                                <Image src="/icons/Events.svg" alt="Event icon" width={50} height={50}/>
                                <p className="text-3xl font-bold">Event Details</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-100 bg-amber-600">

                </div>
            </div>
        </>
    );
}