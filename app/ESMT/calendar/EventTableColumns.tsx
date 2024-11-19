"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Event, Rsvp } from "@prisma/client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { format } from 'date-fns'

export const eventTableColumns = (onEdit: (id: string) => void, onDelete: (id: string) => void
): ColumnDef<Event>[] => [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const title = row.getValue("title") as string
            return <p className="font-bold text-lg">{title}</p>
        },
    },
    {
        accessorKey: "eventType",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const eventType = row.getValue("eventType") as string
            return <Badge variant="secondary">{eventType}</Badge>
        },
    },
    {
        accessorKey: "eventStart",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("eventStart") as Date
            return format(date, 'PPP')
        },
    },
    {
        accessorKey: "inviteRigidity",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Invite Rigidity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const inviteRigidity = row.getValue("inviteRigidity") as string
            return <Badge variant="outline">{inviteRigidity}</Badge>
        },
    },
    {
        accessorKey: "RSVP",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Invitees
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ getValue }) => {
            const rsvp = getValue() as Rsvp[]
            return <div className="text-center">{rsvp.length}</div>
        }
    },
    {
        accessorKey: "id",
        header: "Actions",
        cell: ({ row }) => {
            const id: string = row.getValue("id")

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={"/calendar/view/" + id}>View Invite</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]