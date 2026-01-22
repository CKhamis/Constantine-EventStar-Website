import z from "zod/index";
import {discordUsernameSchema} from "@/components/ValidationSchemas";
import axios from "axios";
import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export type Props = {
    enableNextAction: () => void;
}

export default function Information({enableNextAction}: Props) {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof discordUsernameSchema>>({
        resolver: zodResolver(discordUsernameSchema),
        defaultValues: {
            username: "",
        },
    });

    async function onSubmit(values: z.infer<typeof discordUsernameSchema>) {
        try{
            setLoading(true);
            await axios.post('', values); //todo: set this
            enableNextAction();
        }catch(e){
            console.log(e)
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-5 flex flex-col gap-4">
            <p className="text-4xl font-bold">Username Verification</p>
            <p className="">Please enter your Discord username, then press submit. You will then receive a direct message from our EventStar bot. Enter the number from that message here.</p>
            <Card className="mt-10">
                <CardHeader>
                    <CardTitle>Enter your Discord Username</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discord</FormLabel>
                                        <FormControl>
                                            <Input placeholder="costiboasty" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={loading || !form.formState.isValid}>
                                {loading && <Loader2 className="animate-spin"/>}
                                Submit
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}