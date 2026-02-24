import {discordVerification} from "@/components/ValidationSchemas";
import axios from "axios";
import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import DiscordCard from "@/components/DiscordCard";
import z from "zod";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {REGEXP_ONLY_DIGITS} from "input-otp";

export type Props = {
    selectedDiscordId: string;
}

export default function Step2({selectedDiscordId}: Props) {
    const [loading, setLoading] = useState(false);
    const [otpInput, setOtpInput] = useState<string | undefined>(null);

    // const searchForm = useForm<z.infer<typeof discordVerification>>({
    //     resolver: zodResolver(discordVerification),
    //     defaultValues: {
    //         id: "",
    //     },
    // });

    // async function onSubmit(values: z.infer<typeof discordVerification>) {
    //     try{
    //         setLoading(true);
    //         const response = await axios.post('/api/user/notifications/providers/discord/sendVerification', values);
    //         setDiscordSearchResults(response.data);
    //         console.log(response.data);
    //     }catch(e){
    //         console.log(e)
    //     }finally {
    //         setLoading(false);
    //     }
    // }

    async function submitVerification(){
        try{
            setLoading(true);
            const response = await axios.post('/api/user/notifications/providers/discord/sendVerification', {id: selectedDiscordId});
            console.log(response.data);
        }catch(e){
            console.log(e)
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log(typeof selectedDiscordId);
        // Immediate send
        submitVerification();
    }, []);

    return (
        <div className="p-5 flex flex-col gap-5">
            {loading? <p className="text-4xl font-bold">Loading...</p> : (<>
                <p className="text-4xl font-bold">Verify Your Discord Account</p>
                <p>You will receive a randomized number in your DMs. Paste that number below:</p>
                <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS} value={otpInput} onChange={(value: string) => setOtpInput(value)}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>
                </InputOTP>
                <Button variant="default" type="submit" disabled={otpInput?.length !== 4} onClick={submitVerification}>Terence</Button>
            </>)}

        </div>
    );
}