import {DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
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

interface Props {
    guest: Guest;
    onEditGuest: (values: z.infer<typeof editGuestSchema>) => Promise<null>;
}

export default function EditGuestForm({guest, onEditGuest}:Props){
    const form = useForm<z.infer<typeof editGuestSchema>>({
        resolver: zodResolver(editGuestSchema),
        defaultValues: {...guest}
    });

    const isFormValid = form.formState.isValid;

    return (
        <DialogContent className="sm:max-w-[425px]">
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
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}