import {miniUser} from "@/components/Types";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Controller, useForm} from "react-hook-form";
import * as z from "zod";
import {cuidSchema} from "@/components/ValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

export interface Props {
    userList: miniUser[];
    createEnroller: (userId: string) => void;
}

export default function NewEnrollerForm({userList, createEnroller}: Props){

    const form = useForm<z.infer<typeof cuidSchema>>({
        resolver: zodResolver(cuidSchema),
        defaultValues: {
            id: undefined,
        }
    });

    const isFormValid = form.formState.isValid;

    function submitForm(values: z.infer<typeof cuidSchema>){
        createEnroller(values.id);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">+ New Enroller</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[300px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitForm)} className="space-y-8">
                        <DialogHeader>
                            <DialogTitle>New Enroller</DialogTitle>
                            <DialogDescription>
                                This creates a link that allows guests to link their user account with login
                                credentials.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2 py-4">
                            <FormItem>
                                <FormLabel>Select User</FormLabel>
                                <FormControl>
                                    <Controller
                                        name="id"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a user" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {userList.map((user) => (
                                                            <SelectItem value={user.id} key={user.id}>
                                                                {user.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button type="submit" disabled={!isFormValid}>Save changes</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
);
}