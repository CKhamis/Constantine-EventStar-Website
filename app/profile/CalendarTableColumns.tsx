"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { EventWithResponse } from "@/components/Types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";

export const eventTableColumns: ColumnDef<EventWithResponse>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const title = row.getValue("title") as string;
            return <p className="font-bold text-lg">{title}</p>;
        },
    },
    {
        accessorKey: "eventType",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const eventType = row.getValue("eventType") as string;
            return <div className="flex justify-center"><Badge variant="secondary">{eventType}</Badge></div>;
        },
    },
    {
        accessorKey: "eventStart",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Start
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.getValue("eventStart") as Date;
            return format(date, "MM/dd/yyyy h:mm a");
        },
    },
    {
        accessorKey: "eventEnd",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                End
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.getValue("eventEnd") as Date;
            return format(date, "MM/dd/yyyy h:mm a");
        },
    },
    {
        accessorKey: "inviteRigidity",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Invite Rigidity
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const inviteRigidity = row.getValue("inviteRigidity") as string;
            return <div className="flex flex-row justify-center"><Badge variant="outline">{inviteRigidity}</Badge></div>;
        },
    },
    {
        accessorKey: "response",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Response
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const response = row.getValue("response") as string;
            if(response === "NO_RESPONSE"){
                return <div className="flex flex-row justify-center"><Badge variant="destructive">Unanswered</Badge></div>;
            }else if(response === "YES"){
                return <div className="flex flex-row justify-center"><Badge variant="default">Yes</Badge></div>;
            }else if(response === "NO"){
                return <div className="flex flex-row justify-center"><Badge variant="outline">No</Badge></div>;
            }else {
                return <div className="flex flex-row justify-center"><Badge variant="secondary">Maybe</Badge></div>;
            }
        },
    },
    {
        accessorKey: "arrival",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Attendance
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const arrival = row.getValue("arrival") as string;
            const start = new Date(row.getValue("eventStart"));
            const end = new Date(row.getValue("eventEnd"));
            const today = new Date();
            const response = row.getValue("response") as string;

            console.log("Arrival: " + arrival);
            console.log("rn: " + today);
            console.log("Start: " + start);
            console.log("End: " + end);

            if(response === "YES"){
                if (arrival) {
                    return <div className="flex flex-row justify-center"><Badge variant="secondary">Went</Badge></div>;
                } else if (today < end) {
                    return <div className="flex flex-row justify-center"><Badge variant="outline">Pending</Badge></div>;
                } else {
                    return <div className="flex flex-row justify-center"><Badge variant="destructive">Skipped</Badge></div>;
                }
            }else{
                return <div className="flex flex-row justify-center"><Badge variant="outline">--</Badge></div>;
            }

        },
    },
    {
        accessorKey: "id",
        header: "Invite",
        cell: ({ row }) => {
            const id: string = row.getValue("id");
            return (
                <Link href={"/calendar/view/" + id}>
                    <Button variant="secondary">
                        View
                    </Button>
                </Link>
            );
        },
    },
];