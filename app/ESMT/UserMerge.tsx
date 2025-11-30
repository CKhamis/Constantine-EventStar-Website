import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {esmtUser} from "@/app/api/ESMT/user/all/route";
import {useState} from "react";
import {Card} from "@/components/ui/card";
import AvatarIcon from "@/components/AvatarIcon";
import {ESMTUserDetails} from "@/app/api/ESMT/user/detail/[id]/route";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {format} from "date-fns";
import {AlertOctagon} from "lucide-react";
import { Form } from "@/components/ui/form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {esmtMergeFormSchema} from "@/components/ValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import z from "zod";
import {toast} from "sonner";
import axios from "axios";

interface Props{
	users: esmtUser[],
	setLoading: (isLoading: boolean) => void,
	refresh: () => void,
}

export default function UserMerge({users, setLoading, refresh}:Props){
	const [host, setHost] = useState<ESMTUserDetails | null>(null);
	const [secondary, setSecondary] = useState<ESMTUserDetails | null>(null);


    const changeHost = async (id: string) => {
        try {
            const res = await fetch(`/api/ESMT/user/detail/${id}`);
            if (!res.ok) throw new Error("Failed to fetch user details");
            const data: ESMTUserDetails = await res.json();
            setHost(data);

	        form.setValue("name", data.name ?? "");
	        form.setValue("email", data.email ?? "");
	        form.setValue("discordId", data.discordId ?? "");
	        form.setValue("phone", data.phoneNumber ?? "");
	        form.setValue("hostId", data.id ?? "");


        } catch (err) {
            console.error(err);
            setHost(null);
        }
    };

	const changeSecondary = async (id: string) => {
		try {
			const res = await fetch(`/api/ESMT/user/detail/${id}`);
			if (!res.ok) throw new Error("Failed to fetch user details");
			const data: ESMTUserDetails = await res.json();
			setSecondary(data);

			form.setValue("secondaryId", data.id);

		} catch (err) {
			console.error(err);
			setSecondary(null);
		}
	};

	const form = useForm<z.infer<typeof esmtMergeFormSchema>>({
		resolver: zodResolver(esmtMergeFormSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			discordId: "",

			hostId: "",
			secondaryId: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof esmtMergeFormSchema>) => {
		setLoading(true);

		try {
			const response = await axios.post("/api/ESMT/user/merge", values);

			console.log("Merge successful:", response.data);

			toast.success("Users successfully merged!");
			refresh();
		} catch (err: any) {
			console.error(err);

			const message =
				err.response?.data?.message || "There was a problem merging users.";

			toast.error(message);
		} finally {
			setLoading(false);
		}
	};


	return (
		<div className="grid-cols-1">
			<Card className="p-5">
				<p className="text-2xl font-bold flex items-center gap-2">
					<AlertOctagon />
					Caution
				</p>
				<p>This setting merges two separate EventStar accounts and turns it into one. This will combine all sign-in options, event invitations, RSVPs, followers, following, and other data points. This process cannot be reversed. Please make sure to back up database before.</p>
			</Card>
			<p className="text-2xl font-bold mt-5">1. Select Host Account</p>
			<div className="md:grid-cols-3 grid w-100 mt-2 gap-5">
				<Select onValueChange={(e) => changeHost(e)}>
					<SelectTrigger>
						<SelectValue placeholder="Choose User" />
					</SelectTrigger>
					<SelectContent>
						{users.map(user => (<SelectItem value={user.id} key={user.id}>{user.name}</SelectItem>))}
					</SelectContent>
				</Select>
				<Card className="p-5 flex flex-col gap-5">
                    <div className="flex flex-row justify-start align-center items-center gap-4">
                        <AvatarIcon name={host?.name} key={host?.id} size="small" image={host?.image} />
                        <p className="text-xl font-bold">{host? host.name : "None Selected"}</p>
                    </div>
                    <div className="flex flex-row justify-evenly align-center items-center gap-5 overflow-x-auto pb-5">
	                    <div className="flex flex-col justify-center align-center items-center">
                            <p className="text-bold text-2xl">{host? host.followedBy.length : "?"}</p>
                            <p className="text-sm">Followers</p>
                        </div>
                        <div className="flex flex-col justify-center align-center items-center">
                            <p className="text-bold text-2xl">{host? host.event.length : "?"}</p>
                            <p className="text-sm">Events</p>
                        </div>
                        <div className="flex flex-col justify-center align-center items-center">
                            <p className="text-bold text-2xl">{host? host.following.length : "?"}</p>
                            <p className="text-sm">Following</p>
                        </div>
                        <div className="flex flex-col justify-center align-center items-center">
                            <p className="text-bold text-2xl">{host? host.accounts.length : "?"}</p>
                            <p className="text-sm">Accounts</p>
                        </div>
                        <div className="flex flex-col justify-center align-center items-center">
                            <p className="text-bold text-2xl">{host? host.rsvp.length : "?"}</p>
                            <p className="text-sm">RSVP</p>
                        </div>
                    </div>
                </Card>
				<Card className="p-5 flex flex-col gap-5 align-center">
					<p className="text-xl font-bold">Sign In Options</p>
                    <Table className="overflow-y-auto">
	                    <TableBody>
		                    {host?.accounts.map(account => (
			                    <TableRow key={account.id}>
				                    <TableCell>{account.provider}</TableCell>
				                    <TableCell>{format(new Date(account.createdAt), "M/dd/yyyy hh:mm a")}</TableCell>
			                    </TableRow>
		                    ))}
	                    </TableBody>
                    </Table>
                </Card>
			</div>

			<p className="text-2xl font-bold mt-5">2. Select Secondary Account</p>
			<div className="md:grid-cols-3 grid w-100 mt-2 gap-5">
				<div>
					<Select onValueChange={(e) => changeSecondary(e)}>
						<SelectTrigger>
							<SelectValue placeholder="Choose User" />
						</SelectTrigger>
						<SelectContent>
							{users.map(user => (<SelectItem value={user.id} key={user.id}>{user.name}</SelectItem>))}
						</SelectContent>
					</Select>
					{host?.id === secondary?.id && host?
						<p className="flex items-center gap-2 text-red-700 mt-3 align-center">
							<AlertOctagon />
							Both accounts need to be different
						</p>
						:
						<></>
					}

				</div>
				<Card className="p-5 flex flex-col gap-5">
					<div className="flex flex-row justify-start align-center items-center gap-4">
						<AvatarIcon name={secondary?.name} key={secondary?.id} size="small" image={secondary?.image} />
						<p className="text-xl font-bold">{secondary? secondary.name : "None Selected"}</p>
					</div>
					<div className="flex flex-row justify-evenly align-center items-center gap-5 overflow-x-auto pb-5">
						<div className="flex flex-col justify-center align-center items-center">
							<p className="text-bold text-2xl">{secondary? secondary.followedBy.length : "?"}</p>
							<p className="text-sm">Followers</p>
						</div>
						<div className="flex flex-col justify-center align-center items-center">
							<p className="text-bold text-2xl">{secondary? secondary.event.length : "?"}</p>
							<p className="text-sm">Events</p>
						</div>
						<div className="flex flex-col justify-center align-center items-center">
							<p className="text-bold text-2xl">{secondary? secondary.following.length : "?"}</p>
							<p className="text-sm">Following</p>
						</div>
						<div className="flex flex-col justify-center align-center items-center">
							<p className="text-bold text-2xl">{secondary? secondary.accounts.length : "?"}</p>
							<p className="text-sm">Accounts</p>
						</div>
						<div className="flex flex-col justify-center align-center items-center">
							<p className="text-bold text-2xl">{secondary? secondary.rsvp.length : "?"}</p>
							<p className="text-sm">RSVP</p>
						</div>
					</div>
				</Card>
				<Card className="p-5 flex flex-col gap-5 align-center">
					<p className="text-xl font-bold">Sign In Options</p>
					<Table className="overflow-y-auto">
						<TableBody>
							{secondary?.accounts.map(account => (
								<TableRow key={account.id}>
									<TableCell>{account.provider}</TableCell>
									<TableCell>{format(new Date(account.createdAt), "M/dd/yyyy hh:mm a")}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
			</div>

			<p className="text-2xl font-bold mt-5">3. Combine User Information</p>
			<Card className="p-5 mt-3">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
						<input type="hidden" {...form.register("hostId")} />
						<input type="hidden" {...form.register("secondaryId")} />

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type="email" placeholder="Enter email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input placeholder="Optional" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="discordId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Discord ID</FormLabel>
									<FormControl>
										<Input placeholder="Optional" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div>
							<Button type="submit" variant="destructive" className="w-fit">
								Merge Accounts
							</Button>
							<p className="text-muted-foreground text-sm">This operation cannot be undone</p>
						</div>
					</form>
				</Form>
			</Card>

		</div>
	);
}