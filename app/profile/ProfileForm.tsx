"use client"
import {useForm} from "react-hook-form";
import * as z from "zod";
import {editUserSchema} from "@/components/ValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios from "axios";
import AlertList, {alertContent} from "@/components/AlertList";
import {useState} from "react";
import {User} from "@prisma/client";

export interface Props{
    user: User;
    refresh: () => void;
}

export default function ProfileForm({user, refresh}: Props) {
    const form = useForm<z.infer<typeof editUserSchema>>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            name: user.name ?? "no name",
            email: user.email?? "",
            discordId: user.discordId ?? "",
            id: user.id,
            phoneNumber: user.phoneNumber ?? ""
        }
    });

    const isFormValid = form.formState.isValid;
    const [alertMessages, setAlertMessages] = useState<alertContent[]>([]);


    async function onEditUser(values: z.infer<typeof editUserSchema>) {
        try{
            await axios.post('/api/users/edit', values).finally(refresh);
            addMessage({ title: "User Modification", message: values.name + " was modified and saved to server. Refresh to see changes", icon: 1 });
        }catch(e){
            addMessage({ title: "User Modification", message: "There was an error saving user details", icon: 2});
            console.log(e);
        }
    }

    const addMessage = (message: alertContent)=> {
        setAlertMessages((prevMessages) => [...prevMessages, message]);
    }

    return (
        <>
            <AlertList alerts={alertMessages} />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onEditUser)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>First and Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Terence Bird" {...field} />
                                </FormControl>
                                <FormDescription>This field is required.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Phone number</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="5058425662" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="terence@ab.com" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="discordId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Discord ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="terence" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={!isFormValid}>
                        Save
                    </Button>
                </form>
            </Form>
        </>
    );
}