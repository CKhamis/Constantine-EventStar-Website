import {notificationFrequencySchema, verificationSchema} from "@/components/ValidationSchemas";
import axios from "axios";
import {useEffect, useState} from "react";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {REGEXP_ONLY_DIGITS} from "input-otp";

export type Props = {
    selectedDiscordId: string;
    enableNextAction: () => void;
}

export default function Step2({selectedDiscordId, enableNextAction}: Props) {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<number>(0);

    const form = useForm<z.infer<typeof verificationSchema>>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            vn: "",
        },
        mode: "onSubmit",
    });

    const freqForm = useForm<z.infer<typeof notificationFrequencySchema>>({
        resolver: zodResolver(notificationFrequencySchema),
        defaultValues: { freq: 1 },
        mode: "onSubmit",
    });

    async function onSubmitFrequency(values: z.infer<typeof notificationFrequencySchema>) {
        try {
            setLoading(true);
            const response = await axios.post(
                "/api/user/notifications/providers/discord/setFrequency",
                values
            );
            console.log(response.data);
            // optionally enable next step / show a toast / advance state
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    async function onSubmit(values: z.infer<typeof verificationSchema>) {
        try{
            setLoading(true);
            const response = await axios.post('/api/user/notifications/providers/discord/processVerification', values);
            if(response.status === 200){
                // Success
                setState(1);
                enableNextAction();
            }
        }catch(e){
            console.log(e)
        }finally {
            setLoading(false);
        }
    }

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
        // Immediate send
        submitVerification();
    }, []);

    if(state == 0){
        return (
            <div className="p-5 flex flex-col items-start gap-5">
                {loading ? (
                    <p className="text-4xl font-bold">Now Loading</p>
                ) : (
                    <div className="flex flex-col gap-5 items-start w-50">
                        <p className="text-4xl font-bold">Verify Your Discord Account</p>
                        <p>You will receive a randomized number in your DMs. This number will be valid for the next 20 mins. Paste that number below:</p>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col gap-4 items-start"
                            >
                                <FormField
                                    control={form.control}
                                    name="vn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputOTP
                                                    maxLength={4}
                                                    pattern={REGEXP_ONLY_DIGITS}
                                                    value={field.value}
                                                    onChange={(val) => field.onChange(val)}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    variant="default"
                                    type="submit"
                                    disabled={form.watch("vn")?.length !== 4 || loading}
                                >
                                    Submit
                                </Button>
                            </form>
                        </Form>
                    </div>
                )}
            </div>
        );
    }else if(state === 1){
        return (
            <div className="p-5 flex flex-col items-start gap-5">
                <div className="flex flex-col gap-5 items-start w-50">
                    <p className="text-4xl font-bold">Discord Account Verified</p>
                    <p>
                        Select how often you want to be notified. By default, you will only get essential notifications.
                    </p>

                    <Form {...freqForm}>
                        <form
                            onSubmit={freqForm.handleSubmit(onSubmitFrequency)}
                            className="flex flex-col gap-4 items-start"
                        >
                            <FormField
                                control={freqForm.control}
                                name="freq"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <select
                                                className="w-full border rounded-md px-3 py-2"
                                                value={String(field.value)}
                                                onChange={(e) => field.onChange(e.target.value)} // z.coerce.number() will convert it
                                                disabled={loading}
                                            >
                                                <option value="0">0 — No notifications</option>
                                                <option value="1">1 — Essential (event created, 1 hour before start)</option>
                                                <option value="2">2 — Standard (RSVP + event reminders)</option>
                                                <option value="3">3 — All notifications (most reminders)</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={loading}>
                                Save notification settings
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        );
    }else{
        return (
            <div className="p-5 flex flex-col items-start gap-5">
                <p className="text-4xl font-bold">OOPS! Something went wrong</p>
            </div>
        );
    }
}