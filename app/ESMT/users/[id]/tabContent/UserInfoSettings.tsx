import {
    Dialog,
    DialogClose,
    DialogContent, DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {editUserSchema} from "@/components/ValidationSchemas";
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import axios from "axios";
import {alertContent} from "@/components/AlertList";
import {userWithEventAndGroupsAndRsvpAndAccountsAndSessions} from "@/components/Types";

interface Props {
    user: userWithEventAndGroupsAndRsvpAndAccountsAndSessions;
    refresh: () => void;
    addMessage: (alert: alertContent) => void;
}

export default function UserInfoSettings({user, refresh, addMessage}:Props){
    const form = useForm<z.infer<typeof editUserSchema>>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            name: user.name ?? "no name",
            email: user.email?? "",
            discordId: user.discordId ?? "",
            id: user.id,
            phoneNumber: user.phoneNumber ?? "",
            pin: user.pin
        }
    });

    const isFormValid = form.formState.isValid;

    async function onEditUser(values: z.infer<typeof editUserSchema>) {
        try{
            await axios.post('/api/esmt/users/edit', values).finally(refresh);
            addMessage({ title: "User Modification", message: values.name + " was modified and saved to server", icon: 1 });
        }catch(e){
            addMessage({ title: "User Modification", message: "There was an error saving user details", icon: 2});
            console.log(e);
        }
    }

    return (
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
                <FormField
                    control={form.control}
                    name="pin"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Pin ID</FormLabel>
                            <FormControl>
                                <Input placeholder="1234" {...field} />
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
    );
}