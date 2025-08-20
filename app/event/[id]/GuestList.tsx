'use client'

import {useState} from "react";
import GuestListItem from "@/app/event/[id]/GuestListItem";

export interface Props {
    RSVPs: {
        id: string,
        response: string,
        guests: number,
        firstName: string | undefined,
        lastName: string | undefined,
        user: {
            email: string,
            name: string,
            image: string
            id: string,
        } | undefined,
    }[],
    response: string,
    authorId: string,
    viewerId: string | null,
    following: {id: string, name: string, email: string, image: string | null, phoneNumber: string}[] | null | undefined,
    action: () => void,
    maxGuests: number,
    eventId: string
}

export default function GuestList({RSVPs, response, authorId, viewerId, following, action, maxGuests, eventId}: Props){
    let viewerRole: "A" | "V" | "W";

    if(viewerId){
        // Viewer has an account
        if(viewerId === authorId){
            // Viewer is the author of event
            viewerRole = "A";
        }else{
            // Viewer is just a viewer of event
            viewerRole = "V";
        }
    }else{
        // User is a write-in
        viewerRole = "W";
    }

    return (
        <>
            {RSVPs.filter((rsvp) => rsvp.response === response).map((rsvp) =>
                <GuestListItem key={rsvp.id} maxGuests={maxGuests} RSVP={rsvp} action={action} authorId={authorId} viewerRole={viewerRole} eventId={eventId} isFollowing={!!viewerId && !!following && following.some(user => user.id === viewerId)} />
            )}
        </>
    );

}