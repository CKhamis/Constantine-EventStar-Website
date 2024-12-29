"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import {enrollerWithAuthorAndUser} from "@/components/Types";
import AvatarIcon from "@/components/AvatarIcon";

export const enrollerTableColumns: ColumnDef<enrollerWithAuthorAndUser>[] = [
    {
        accessorKey: "user.name", // Nested path
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
            return <div className="flex flex-row gap-5 justify-start items-center">
                <AvatarIcon name={name} image={row.original.user.image} size={"small"} />
                <p className="font-bold text-lg">{name}</p>
            </div>;
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
        header: "Enrollment Link",
        cell: ({ row }) => {
            const id: string = row.getValue("id");
            const link = `${process.env.NEXT_PUBLIC_BACKEND_URL}/enrollment/${id}`;

            const handleCopy = () => {
                navigator.clipboard.writeText(link)
                    .then(() => {

                    })
                    .catch((error) => {
                        console.error("Failed to copy link:", error);
                    });
            };

            return (
                <Button variant="secondary" onClick={handleCopy}>
                    Copy Link
                </Button>
            );
        },
    },

];