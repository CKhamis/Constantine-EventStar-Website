"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {ArrowUpDown, MoreHorizontal} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {Group, User} from "@prisma/client";
import {format} from "date-fns";
import {Badge} from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export const groupTableColumns = (
    deleteGroup: (id: string) => void
): ColumnDef<Group>[] => [
    {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc" ? "desc" : "asc")}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const name = row.original.name;
            return (
                <div className="flex flex-row gap-5 justify-start items-center px-4">
                    <p className="font-bold text-lg">{name}</p>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc" ? "desc" : "asc")}
            >
                Group
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            if(status === "ACTIVE"){
                return <div className="flex flex-row justify-start mx-4"><Badge variant="default">Active</Badge></div>;
            }else if(status === "INACTIVE"){
                return <div className="flex flex-row justify-start mx-4"><Badge variant="secondary">Inactive</Badge></div>;
            }else if(status === "DORMANT"){
                return <div className="flex flex-row justify-start mx-4"><Badge variant="outline">Dormant</Badge></div>;
            }else {
                return <div className="flex flex-row justify-start mx-4"><Badge variant="destructive">{status}</Badge></div>;
            }
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Created
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as Date;
            return format(date, "MM/dd/yyyy h:mm a");
        },
    },
    {
        accessorKey: "users",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Members
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const users = row.original.users as Array<User>;
            return (
                <div className="flex justify-start mx-4">
                    {users?.length || 0}
                </div>
            );
        },
    },
    {
        accessorKey: "id",
        header: () => (
            <p>Actions</p>
        ),
        cell: ({ row }) => {
            const id: string = row.getValue("id");

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
                        <DropdownMenuItem><Link href={"/ESMT/groups/" + id}>Edit</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteGroup(id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];