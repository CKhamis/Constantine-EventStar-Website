"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import {useForm} from "react-hook-form";
import { useEffect } from 'react'
import * as z from "zod";
import {createGroupSchema, editGroupSchema} from "@/components/ValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Loader2} from "lucide-react";
import { useState} from "react";
import {Status, User} from "@prisma/client";
import UserSelection from "./UserSelection";
import axios from "axios";
import AlertList, {alertContent} from "@/components/AlertList";
import { useRouter } from 'next/navigation';
import {groupWithUser} from "@/components/Types";

export default function DynamicContent({groupId}: {groupId: string}) {
    const router = useRouter();

    const form = useForm<z.infer<typeof editGroupSchema>>({
        resolver: zodResolver(editGroupSchema),
        defaultValues: {
            id: groupId,
            name: '',
            description: '',
            status: 'INACTIVE',
            users: []
        },
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [alertMessages, setAlertMessages] = useState<alertContent[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    // Enum formatting
    const statusOptions = Object.values(Status).map((value) => ({
        label: value.replace(/_/g, " "),
        value,
    }));

    async function onSubmit (values: z.infer<typeof createGroupSchema>) {
        try{
            setIsLoading(true);
            await axios.post('/api/esmt/groups/edit', values);
            router.push("/ESMT/groups?message=1");
        }catch(e){
            setIsLoading(false);
            console.log(e)
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to save group", icon: 2 }]);

        }
    }

    async function refresh() {
        try {
            const groupInfo:groupWithUser = await fetchGroupInfo();

            if (groupInfo) {
                form.reset({
                    ...groupInfo,
                    id: groupId,
                    users: groupInfo.users.map((user:User) => user.id) || []
                })
                setSelectedUsers(groupInfo.users.map((user:User) => user.id) || []);
            } else {
                setAlertMessages([...alertMessages, { title: "Error", message: "Group not found", icon: 2 }])
            }
        } catch (error) {
            console.error("Error fetching group data:", error)
            setAlertMessages([...alertMessages, { title: "Error", message: "Failed to load group data", icon: 2 }])
        }
    }

    useEffect(() => {
        refresh()
    }, [])

    async function fetchGroupInfo() {
        try {
            const response = await axios.get(`/api/esmt/groups/view/${groupId}`)
            return response.data
        } catch (err) {
            console.error("Error fetching event:", err)
            return null
        }
    }

    return (
        <Form {...form}>
            <AlertList alerts={alertMessages} />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-4">
                <UserSelection initialSelectedGuests={selectedUsers} onGuestsSelected={(data) => form.setValue("users", data)}/>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Group Name" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Group description"
                                    {...field}
                                    className="textarea-class"
                                    rows={4}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Invite Rigidity</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select invite rigidity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="animate-spin"/>}
                    Create Group
                </Button>
            </form>
        </Form>
    )
}