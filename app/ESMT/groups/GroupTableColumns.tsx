"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import AvatarIcon from "@/components/AvatarIcon";
import {Group} from "@prisma/client";

export const groupTableColumns = (
    deleteEnroller: (id: string) => void
): ColumnDef<Group>[] => [
    {
        id: "name",
        accessorKey: "user.name",
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
            const name = row.original.name;
            return (
                <div className="flex flex-row gap-5 justify-start items-center">
                    <p className="font-bold text-lg">{name}</p>
                </div>
            );
        },
    },
    // {
    //     accessorKey: "expires",
    //     header: ({ column }) => (
    //         <Button
    //             variant="ghost"
    //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         >
    //             Expires
    //             <ArrowUpDown className="ml-2 h-4 w-4" />
    //         </Button>
    //     ),
    //     cell: ({ row }) => {
    //         const date = row.getValue("expires") as Date;
    //         return format(date, "MM/dd/yyyy h:mm a");
    //     },
    // },
    // {
    //     accessorKey: "id",
    //     header: "Actions",
    //     cell: ({ row }) => {
    //         const id: string = row.getValue("id");
    //         const link = `${process.env.NEXT_PUBLIC_BACKEND_URL}/enrollment/${id}`;
    //
    //         const handleCopy = () => {
    //             navigator.clipboard.writeText(link)
    //                 .then(() => {
    //                     // Handle successful copy
    //                 })
    //                 .catch((error) => {
    //                     console.error("Failed to copy link:", error);
    //                 });
    //         };
    //
    //         return (
    //             <div className="flex flex-row gap-5 justify-start items-center">
    //                 <Button variant="secondary" onClick={handleCopy}>
    //                     Copy Link
    //                 </Button>
    //                 <Button variant="destructive" onClick={() => deleteEnroller(id)}>
    //                     Delete
    //                 </Button>
    //             </div>
    //         );
    //     },
    // },
];