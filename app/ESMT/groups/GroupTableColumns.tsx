"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {Group, User} from "@prisma/client";
import {format} from "date-fns";
import {Badge} from "@/components/ui/badge";

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
            <p>Delete</p>
        ),
        cell: ({ row }) => {
            const id: string = row.getValue("id");

            return (
                <div className="flex flex-row gap-5 justify-start items-center">
                    <Button variant="destructive" onClick={() => deleteGroup(id)}>
                        Delete
                    </Button>
                </div>
            );
        },
    },
];