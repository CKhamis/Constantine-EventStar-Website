"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { enrollerWithAuthorAndUser } from "@/components/Types";
import AvatarIcon from "@/components/AvatarIcon";

export const enrollerTableColumns = (
    deleteEnroller: (id: string) => void
): ColumnDef<enrollerWithAuthorAndUser>[] => [
    {
        id: "name",
        accessorKey: "user.name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc" ? "desc" : "asc")}
            >
                User
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const name = row.original.user.name;
            return (
                <div className="flex flex-row gap-5 justify-start items-center">
                    <AvatarIcon name={name} image={row.original.user.image} size={"small"} />
                    <p className="font-bold text-lg">{name}</p>
                </div>
            );
        },
    },
    {
        accessorKey: "expires",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Expires
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.getValue("expires") as Date;
            return format(date, "MM/dd/yyyy h:mm a");
        },
    },
    {
        accessorKey: "id",
        header: "Actions",
        cell: ({ row }) => {
            const id: string = row.getValue("id");
            const link = `${process.env.NEXT_PUBLIC_BACKEND_URL}/enrollment/${id}`;

            const handleCopy = () => {
                navigator.clipboard.writeText(link)
                    .then(() => {
                        // Handle successful copy
                    })
                    .catch((error) => {
                        console.error("Failed to copy link:", error);
                    });
            };

            return (
                <div className="flex flex-row gap-5 justify-start items-center">
                    <Button variant="secondary" onClick={handleCopy}>
                        Copy Link
                    </Button>
                    <Button variant="destructive" onClick={() => deleteEnroller(id)}>
                        Delete
                    </Button>
                </div>
            );
        },
    },
];