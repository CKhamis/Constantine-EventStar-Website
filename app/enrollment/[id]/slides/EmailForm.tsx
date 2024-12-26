'use client'

export type Props = {
    ticketId: string;
}

export default function EmailForm({ticketId}: Props){

    return (
        <p>{ticketId}</p>
    );
}