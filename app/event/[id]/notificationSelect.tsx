import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Bell,
    BellOff,
    Sparkles,
    CalendarClock,
    Check, CalendarPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const options: {
    value: number;
    title: string;
    description: string;
    Icon: React.ComponentType<{ className?: string }>;
}[] = [
    {
        value: 0,
        title: "No notifications",
        description: "Turn off all Discord DMs",
        Icon: BellOff,
    },
    {
        value: 1,
        title: "Essential",
        description: "Event created, 1 hour before start",
        Icon: Bell,
    },
    {
        value: 2,
        title: "Standard",
        description: "RSVP reminders + event reminders",
        Icon: CalendarClock,
    },
    {
        value: 3,
        title: "All notifications",
        description: "All reminders and updates",
        Icon: Sparkles,
    },
];

export type Props = {
    value: number | null,
    onSelect: (value: number) => void,
    disabled?: boolean,
}

export function NotificationSelect({value, onSelect, disabled}: Props) {
    const [open, setOpen] = React.useState(false);

    const current = options.find((o) => o.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center justify-center gap-2 w-full" disabled={disabled}>
                    Notifications
                    <Bell className="h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 p-2">
                <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">Notification frequency (for this event)</p>
                    <p className="text-xs text-muted-foreground">
                        Current: {current ? `${current.value} — ${current.title}` : value}
                    </p>
                </div>

                <Command>
                    <CommandList>
                        <CommandEmpty>No options found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((opt) => (
                                <CommandItem
                                    key={opt.value}
                                    value={String(opt.value)}
                                    onSelect={async () => {
                                        await onSelect(opt.value);
                                        setOpen(false);
                                    }}
                                    className="flex items-start gap-3"
                                >
                                    <opt.Icon className="h-4 w-4 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">
                        {opt.value} — {opt.title}
                      </span>
                                            <Check
                                                className={cn(
                                                    "h-4 w-4",
                                                    opt.value === value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {opt.description}
                                        </p>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}