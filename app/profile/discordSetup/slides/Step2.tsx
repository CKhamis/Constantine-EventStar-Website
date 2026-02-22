import {discordUsernameSearch} from "@/components/ValidationSchemas";
import axios from "axios";
import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {DiscordUsernameSearchResponse} from "@/app/api/user/notifications/providers/discord/searchUser/route";
import DiscordCard from "@/components/DiscordCard";
import z from "zod";

export type Props = {
    enableNextAction: () => void;
    setSelectedDiscordId: (id: number) => void;
    selectedDiscordId: number | null;
}

export default function Step2({enableNextAction, setSelectedDiscordId, selectedDiscordId}: Props) {
    const [loading, setLoading] = useState(false);
    const [discordSearchResults, setDiscordSearchResults] = useState<DiscordUsernameSearchResponse>();

    const searchForm = useForm<z.infer<typeof discordUsernameSearch>>({
        resolver: zodResolver(discordUsernameSearch),
        defaultValues: {
            username: "",
        },
    });

    async function onSubmit(values: z.infer<typeof discordUsernameSearch>) {
        try{
            setLoading(true);
            const response = await axios.post('/api/user/notifications/providers/discord/searchUser', values);
            setDiscordSearchResults(response.data);
            console.log(response.data);
        }catch(e){
            console.log(e)
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (selectedDiscordId !== null) {
            enableNextAction();
        }
    }, [selectedDiscordId, enableNextAction]);

    return (
        <div className="p-5 flex flex-col md:flex-row gap-5">
            <div className="w-full md:flex-[5]">
                <p className="text-4xl font-bold">Enter your Discord Username</p>
                <p className="">In the search box below, enter your Discord username. Once you press next, a message will be sent to the account to verify the account is yours.</p>
                <Card className="mt-10">
                    <CardHeader>
                        {/*<CardTitle>Enter your Discord Username</CardTitle>*/}
                    </CardHeader>
                    <CardContent>
                        <Form {...searchForm}>
                            <form onSubmit={searchForm.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={searchForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Discord Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="costiboasty" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={loading || !searchForm.formState.isValid}>
                                    {loading && <Loader2 className="animate-spin"/>}
                                    Submit
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-5 md:mt-0 w-full md:flex-[3]">
                <p className="text-3xl font-bold mb-3">{loading? "Searching..." : "Search Results"}</p>
                {discordSearchResults?.results.map(m => (
                    <DiscordCard key={m.id} name={m.name} id={m.id} avatar={m.avatar} global_name={m.global_name} onClick={() => setSelectedDiscordId(m.id)} isSelected={m.id === selectedDiscordId} />
                ))}
                {discordSearchResults?.results.length === 0 && (<p>None found</p>)}
                <p></p>
            </div>

        </div>
    );
}