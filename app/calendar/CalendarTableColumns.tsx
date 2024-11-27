"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Event } from "@prisma/client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import Link from "next/link";

export const eventTableColumns: ColumnDef<Event>[] = [
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
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.getValue("eventStart") as Date;
            return format(date, "PPP");
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