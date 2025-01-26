import {EventWithRsvpWithUser} from "@/components/Types";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import AvatarIcon from "@/components/AvatarIcon";
import {addHours, format} from "date-fns";
import {Button} from "@/components/ui/button";


export interface Props {
    eventDetails: EventWithRsvpWithUser
}

export default function Attendance({eventDetails}: Props) {

    return (
        <>
            <p className="text-2xl font-bold mb-8">Event Attendance</p>
            <Table className="glass-dark">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Response</TableHead>
                        <TableHead>Arrival Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {eventDetails.RSVP.map((rsvp) => (
                        <TableRow key={rsvp.id}>
                            <TableCell className="font-bold text-xl gap-4 flex flex-row items-center justify-start">
                                <AvatarIcon name={rsvp.User.name} size="small" image={rsvp.User.image} />
                                {rsvp.User.name}
                            </TableCell>
                            <TableCell>{rsvp.response}</TableCell>
                            <TableCell>{format(rsvp.arrival, 'PPP hh:mm a')}</TableCell>
                            <TableCell>status</TableCell>
                            <TableCell className="">
                                <Button onClick={() => console.log("f")} variant="destructive" size="sm">A</Button>
                                <Button onClick={() => console.log("f")} variant="secondary" size="sm" className="mx-2">P</Button>
                                <Button onClick={() => console.log("f")} variant="outline" size="sm">L</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </>
    );
}