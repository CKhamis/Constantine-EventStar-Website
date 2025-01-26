"use client"

import {LoadingIcon} from "@/components/LoadingIcon";
import {useEffect, useState} from "react";
import axios from "axios";
import {EventWithRsvp} from "@/components/Types";
import Image from "next/image";
import Link from "next/link";
import AvatarIcon from "@/components/AvatarIcon";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {format} from "date-fns";

export interface Props{
    eventId: string;
}

export default function UserInfo({eventId}: Props){
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<EventWithRsvp | null>(null);

    const refresh = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/esmt/events/view/" + eventId)
            setEvent(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, [])

    if (loading && event === null) {
        return (
            <LoadingIcon />
        );
    }

    if(event === null){
        return (
            <div className="w-100 h-screen flex flex-col items-center justify-center p-10 top-left-gradient">
                <Image src="/agent/error.gif" alt="waiting" height={150} width={150} className="mb-5" />
                <p className="text-4xl font-bold text-center">OOPS! There was an error with the event</p>
                <p className="mt-3">The event may have been deleted</p>
                <Link href="/" className="underline text-muted-foreground mt-3">Back to home page</Link>
            </div>
        );
    }

    return (
        <div className="container">
            {loading? <LoadingIcon /> : ""}
            <div className="w-100 border-b flex flex-row justify-between py-5">
                <div className="flex flex-row justify-start gap-5 items-center">
                    <div>
                        <p className="font-bold text-4xl">{event.title}</p>
                        <p className="mt-3 ml-1 text-muted-foreground">{event.eventType} | {format(event.eventStart, "MM/dd/yyyy h:mm a")}</p>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm">Groups</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>All groups</DropdownMenuLabel>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}