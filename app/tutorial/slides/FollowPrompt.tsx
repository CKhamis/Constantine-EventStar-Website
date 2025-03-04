'use client'

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import z from "zod";
import {editBasicUserInfoSchema, emailSchema} from "@/components/ValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Check, Loader2, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import axios from "axios";

export default function FollowPrompt(){
    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: ""
        },
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactElement>(<></>);

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

    return(
        <div className="p-5 flex flex-col justify-center">
            <p className="text-4xl font-bold mb-2">Follow Event Planner?</p>
            <p>Adding an event planner here can streamline the process of getting invites to events. If you don&#39;t want to follow anybody or want to do it later, press next.</p>
            <Card className="w-1/2 mt-10 mx-auto">
                <CardHeader className="text-2xl font-bold">Send Follow Requests</CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Planner&#39;s Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="costi.khamis@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={loading || !form.formState.isValid}>
                                {loading && <Loader2 className="animate-spin"/>}
                                Send Request
                            </Button>
                            {statusMessage}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}