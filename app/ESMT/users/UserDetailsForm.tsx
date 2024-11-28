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
import {User} from "@prisma/client";
import {useForm} from "react-hook-form";
import {editUserSchema} from "@/components/ValidationSchemas";
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useState} from "react";
import axios from "axios";
import {alertContent} from "@/components/AlertList";

interface Props {
    user: User;
    refresh: () => void;
    addMessage: (alert: alertContent) => void;
}

export default function UserDetailsForm({user, refresh, addMessage}:Props){
    const form = useForm<z.infer<typeof editUserSchema>>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email?? undefined,
            discordId: user.discordId,
            id: user.id,
            phoneNumber: user.phoneNumber
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const isFormValid = form.formState.isValid;

    async function onEditUser(values: z.infer<typeof editUserSchema>) {
        try{
            await axios.post('/api/esmt/users/edit', values).finally(refresh);
            addMessage({ title: "User Modification", message: values.firstName + " " + values.lastName + " was modified and saved to server", icon: 1 });
        }catch(e){
            addMessage({ title: "User Modification", message: "There was an error saving user details", icon: 2});
            console.log(e);
        }
    }

    const deleteUser = async (id: string) => {
        setIsDialogOpen(false);
        try{
            await axios.post('/api/esmt/users/delete', {"id": id}).finally(refresh);
            addMessage({ title: "User Deleted", message: "User and all related information was deleted from server", icon: 1 });
        }catch(e){
            addMessage({ title: "Unable to Delete User", message: "There was an issue deleting user", icon: 2 });
            console.log(e);
        }
    }

    return (
        <Dialog key={user.id} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer">
                    <Avatar className="h-12 w-12">
                        {user.image && <AvatarImage src={user.image} alt={`${user.firstName} ${user.lastName}`}/>}
                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24">
                            {user.image && <AvatarImage src={user.image} alt={`${user.firstName} ${user.lastName}`}/>}
                            <AvatarFallback>{user?.firstName[0]}{user?.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <DialogTitle className="text-2xl font-semibold">Edit User Details</DialogTitle>
                    </div>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onEditUser)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Terence" {...field} />
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
                                        <Input placeholder="Bird" {...field} />
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
                        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                            <p>Date Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                            <p>Last Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild disabled={!isFormValid}>
                                <Button type="submit">
                                    Save
                                </Button>
                            </DialogClose>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" className="mb-4">
                                        Delete User
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
                                        <DialogDescription>
                                            This action cannot be undone. This will permanently delete
                                            {` ${user.firstName} ${user.lastName}`} and remove all related information including invite history, profile information, contact info, and more.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button variant="destructive" onClick={() => deleteUser(user.id)}>Delete</Button>
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