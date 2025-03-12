'use client'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import z from "zod";
import {emailSchema} from "@/components/ValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Check, Loader2, X} from "lucide-react";
import axios from "axios";
import {useState} from "react";

export default function FollowDialog(){
    const [loading, setLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactElement>(<></>);

    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: ""
        },
    });

    async function onSubmit(values: z.infer<typeof emailSchema>) {
        try{
            setLoading(true);
            await axios.post('/api/user/connections/newRequest', values)
                .then((response) => {
                    setStatusMessage(<p className="text-green-400 flex flex-row gap-2"><Check />{response.data.message}</p>);
                })
                .catch((error) => {
                    setStatusMessage(<p className="text-red-400 flex flex-row gap-2"><X />{error.response.data.message}</p>);
                });

        }catch(e){
            console.log(e)
        }finally {
            setLoading(false);
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild><Button>Send Request</Button></DrawerTrigger>
            <DrawerContent className="lg:container lg:max-w-2xl p-5">
                <DrawerHeader>
                    <DrawerTitle>Send Follow Request</DrawerTitle>
                    <DrawerDescription>Type in their email to send a request</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Planner&#39;s Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="costi.k@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-row justify-start gap-5 items-center">
                                <Button type="submit" disabled={loading || !form.formState.isValid}>
                                    {loading && <Loader2 className="animate-spin"/>}
                                    Send Request
                                </Button>
                                {statusMessage}
                            </div>
                        </form>
                    </Form>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    );
}