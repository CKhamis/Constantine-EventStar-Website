import {SelectContent, SelectItem} from "@/components/ui/select";

export function NotificationAmounts(){
    return (
        <SelectContent>
            <SelectItem value="0">
                0 — No notifications
            </SelectItem>

            <SelectItem value="1">
                1 — Essential (event created, 1 hour before start)
            </SelectItem>

            <SelectItem value="2">
                2 — Standard (RSVP + event reminders)
            </SelectItem>

            <SelectItem value="3">
                3 — All notifications (most reminders)
            </SelectItem>
        </SelectContent>
    );
}