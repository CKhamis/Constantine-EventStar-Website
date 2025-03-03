import {Rsvp, Event} from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {format, addHours} from "date-fns";
import {Button} from "@/components/ui/button";
import axios from "axios";


export interface Props {
    rsvp: (Rsvp & { event: Event })[];
    userId: string;
    refresh: () => Promise<void>;
}

export default function Attendance({rsvp, userId, refresh}: Props) {
    const currentTime = new Date();

    const alterAttendance = async (newTime: Date | null, rsvpId: string) => {
        try {
            await axios.post("/api/esmt/users/attendance/edit", {id: rsvpId, arrivalTime: newTime}).finally(refresh);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    return (
        <div className="container">
            <p className="text-2xl font-bold mb-8">Event Attendance</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>RSVP Due</TableHead>
                        <TableHead>Response</TableHead>
                        <TableHead>Arrival</TableHead>
                        <TableHead>Validator</TableHead>
                        <TableHead className="text-right">Manual Override</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rsvp.filter(rsvp => {
                        const endTime = new Date(rsvp.event.eventEnd);
                        return endTime < currentTime;
                    }).map((rsvp) => (
                        <TableRow key={rsvp.id}>
                            <TableCell className="font-bold text-xl">{rsvp.event.title}</TableCell>
                            <TableCell>{format(rsvp.event.eventStart, 'd/M/y hh:mm a')}</TableCell>
                            <TableCell>{format(rsvp.event.rsvpDuedate, 'd/M/y hh:mm a')}</TableCell>
                            <TableCell>{rsvp.response}</TableCell>
                            <TableCell>{rsvp.arrival? format(rsvp.arrival, 'hh:mm a') : "Unmarked"}</TableCell>
                            <TableCell>{rsvp.validator}</TableCell>
                            <TableCell className="flex flex-row justify-end gap-3">
                                <Button onClick={() => alterAttendance(null, rsvp.id)} variant="destructive" size="sm">A</Button>
                                <Button onClick={() => alterAttendance(new Date(rsvp.event.eventStart), rsvp.id)} variant="secondary" size="sm">P</Button>
                                <Button onClick={() => alterAttendance(addHours(new Date(rsvp.event.eventStart), 1), rsvp.id)} variant="outline" size="sm">L</Button>
                            </TableCell>
                        </TableRow>)
                    )}
                </TableBody>
            </Table>

        </div>
    );
}