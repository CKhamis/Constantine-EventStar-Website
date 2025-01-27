import {EventWithRsvpWithUserWithAccount} from "@/components/Types";
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
import {Badge} from "@/components/ui/badge";
import axios from "axios";


export interface Props {
    eventDetails: EventWithRsvpWithUserWithAccount;
    refresh: () => Promise<void>;
}

export default function Attendance({eventDetails, refresh}: Props) {
    const now = new Date();

    const alterAttendance = async (newTime: Date | null, rsvpId: string) => {
        try {
            await axios.post("/api/esmt/users/attendance/edit", {id: rsvpId, arrivalTime: newTime}).finally(refresh);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    return (
        <>
            <p className="text-2xl font-bold mb-8">Event Attendance</p>
            <Table className="glass-dark">
                <TableCaption>{eventDetails.RSVP.length} Guests invited.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Enrollment</TableHead>
                        <TableHead>Response</TableHead>
                        <TableHead>Event Start</TableHead>
                        <TableHead>Arrival Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Edit Attendance</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {eventDetails.RSVP.map((rsvp) => {
                        const oneHourAfterStart = addHours(new Date(eventDetails.eventStart), 1);
                        const status = () => {
                            if(rsvp.response === "YES"){
                                if (now > eventDetails.eventEnd) {
                                    if (rsvp.arrival) {
                                        if (new Date(rsvp.arrival) < oneHourAfterStart) {
                                            return "Attended";
                                        } else {
                                            return "Late";
                                        }
                                    } else {
                                        return "Flaked";
                                    }
                                } else {
                                    return "Pending"
                                }
                            }else{
                                // No response, No, or maybe
                                if (now < new Date(eventDetails.eventStart)) {
                                    return <Badge variant="secondary">Not Going</Badge>;
                                } else if (now > new Date(eventDetails.eventEnd)) {
                                    if(rsvp.arrival){
                                        return <Badge variant="destructive">Unannounced</Badge>;
                                    }else{
                                        return <Badge variant="outline">Didn&#39;t Go</Badge>;
                                    }
                                }else{
                                    return <Badge variant="outline">Not there</Badge>;
                                }
                            }
                        }

                        return (
                            <TableRow key={rsvp.id}>
                                <TableCell className="font-bold text-xl gap-4 flex flex-row items-center justify-start">
                                    <AvatarIcon name={rsvp.User.name} size="small" image={rsvp.User.image}/>
                                    {rsvp.User.name}
                                </TableCell>
                                <TableCell>{rsvp.User.accounts.length > 0? <Badge variant="secondary">Yes</Badge> : <Badge variant="destructive">No</Badge>}</TableCell>
                                <TableCell>{rsvp.response}</TableCell>
                                <TableCell>{format(eventDetails.eventStart, 'hh:mm a')}</TableCell>
                                <TableCell>{rsvp.arrival ? format(rsvp.arrival, 'hh:mm a') : "None"}</TableCell>
                                <TableCell>{status()}</TableCell>
                                <TableCell className="">
                                    <Button onClick={() => alterAttendance(null, rsvp.id)} variant="destructive" size="sm">A</Button>
                                    <Button onClick={() => alterAttendance(new Date(eventDetails.eventStart), rsvp.id)} className="mx-2" variant="secondary" size="sm">P</Button>
                                    <Button onClick={() => alterAttendance(addHours(new Date(eventDetails.eventStart), 1), rsvp.id)} variant="outline" size="sm">L</Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

        </>
    );
}