import {
    Dialog,
    DialogClose,
    DialogContent, DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Guest} from "@prisma/client";
import {useForm} from "react-hook-form";
import {editGuestSchema} from "@/components/ValidationSchemas";
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import AlertMessage from "@/components/AlertMessage";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useState} from "react";
import axios from "axios";
import {alertContent} from "@/components/AlertList";

interface Props {
    guest: Guest;
    refresh: () => void;
    addMessage: (alert: alertContent) => void;
}

export default function GuestDetailsForm({guest, refresh, addMessage}:Props){
    const form = useForm<z.infer<typeof editGuestSchema>>({
        resolver: zodResolver(editGuestSchema),
        defaultValues: {...guest}
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const isFormValid = form.formState.isValid;

    async function onEditGuest(values: z.infer<typeof editGuestSchema>) {
        try{
            await axios.post('/api/esmt/guests/edit', values).finally(refresh);
            addMessage({ title: "Guest Modification", message: values.firstName + " " + values.lastName + " was modified and saved to server", icon: 1 });
        }catch(e){
            addMessage({ title: "Guest Modification", message: "There was an error saving guest details", icon: 2});
            console.log(e);
        }
    }

    const deleteGuest = async (id: string) => {
        setIsDialogOpen(false);
        try{
            await axios.post('/api/esmt/guests/delete', {"id": id}).finally(refresh);
            addMessage({ title: "Guest Deleted", message: "Guest and all related information was deleted from server", icon: 1 });
        }catch(e){
            addMessage({ title: "Unable to Delete Guest", message: "There was an issue deleting guest", icon: 2 });
            console.log(e);
        }
    }

    return (
        <Dialog key={guest.id} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={guest.avatarUrl} alt={`${guest.firstName} ${guest.lastName}`} />
                        <AvatarFallback>{guest.firstName[0]}{guest.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium leading-none">{guest.firstName} {guest.lastName}</p>
                        <p className="text-sm text-muted-foreground">{guest.email}</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={guest?.avatarUrl} alt={`${guest?.firstName} ${guest?.lastName}`} />
                            <AvatarFallback>{guest?.firstName[0]}{guest?.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <DialogTitle className="text-2xl font-semibold">Edit Guest Details</DialogTitle>
                    </div>
                </DialogHeader>
                <Form {...form}>
                    <AlertMessage title="Form Error" message={""} code={2} />
                    <form onSubmit={form.handleSubmit(onEditGuest)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormDescription>This field is required.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
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
                                        <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                            <p>Date Created: {new Date(guest.createdAt).toLocaleDateString()}</p>
                            <p>Last Updated: {new Date(guest.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild disabled={!isFormValid}>
                                <Button type="submit">
                                    Save
                                </Button>
                            </DialogClose>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive">
                                        Delete Guest
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure you want to delete this guest?</DialogTitle>
                                        <DialogDescription>
                                            This action cannot be undone. This will permanently delete
                                            {` ${guest.firstName} ${guest.lastName}`} and remove all related information including invite history, profile information, contact info, and more.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button variant="destructive" onClick={() => deleteGuest(guest.id)}>Delete</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}