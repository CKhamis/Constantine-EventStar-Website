'use client'

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Check, X} from "lucide-react"
import {format} from "date-fns"
import Link from "next/link"
import {UseFormReturn} from "react-hook-form"
import {z} from "zod"
import {rsvpSchema} from "@/components/ValidationSchemas"
import {EVResponse} from "@/app/api/events/view/[id]/route"

export interface RsvpFormProps {
	eventInfo: EVResponse | null | undefined
	userId: string
	eventId: string
	form: UseFormReturn<z.infer<typeof rsvpSchema>>
	submitStatus: 'idle' | 'loading' | 'success' | 'error'
	onWriteInSubmit: (data: z.infer<typeof rsvpSchema>) => void
	onSubmit: (data: z.infer<typeof rsvpSchema>) => void
}

export default function RsvpForm({
	                                 eventInfo,
	                                 userId,
	                                 eventId,
	                                 form,
	                                 submitStatus,
	                                 onWriteInSubmit,
	                                 onSubmit,
                                 }: RsvpFormProps) {
	const isExpired = eventInfo ? new Date(eventInfo.rsvpDuedate) < new Date() : true;

	// CASE 1: no logged-in user, event is FULL
	if (!userId && eventInfo?.inviteVisibility === "FULL") {
		return (
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onWriteInSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="firstName"
						render={({field}) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input type="text" placeholder="Enter your first name" disabled={isExpired} {...field} />
								</FormControl>
								<FormMessage/>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="lastName"
						render={({field}) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input type="text" placeholder="Enter your last name" disabled={isExpired} {...field} />
								</FormControl>
								<FormMessage/>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="response"
						render={({field}) => (
							<FormItem>
								<FormLabel>Your Attendance</FormLabel>
								<Select onValueChange={field.onChange} value={field.value} disabled={isExpired}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select your RSVP status"/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="YES">Yes</SelectItem>
										<SelectItem value="NO">No</SelectItem>
										<SelectItem value="MAYBE">Maybe</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage/>
							</FormItem>
						)}
					/>

					{eventInfo.maxGuests > 0 && (
						<FormField
							control={form.control}
							name="guests"
							render={({field}) => (
								<FormItem>
									<FormLabel>+1s (max {eventInfo.maxGuests} per invite)</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={isExpired}
											min="0"
											max={eventInfo.maxGuests}
											placeholder="0"
											{...field}
											onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
											value={field.value || 0}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
					)}

					<p className="text-foreground text-sm">Write the same first and last names to change your RSVP</p>
					<p className="text-muted-foreground text-sm">
						{isExpired ? "too late to respond" : `Respond by ${format(new Date(eventInfo.rsvpDuedate), "PPP hh:mm a")}`}
					</p>

					<div className="flex flex-row gap-4 items-center justify-start">
						<Button type="submit" disabled={submitStatus === "loading" || isExpired}>
							{submitStatus === "loading" ? "Submitting..." : "Save"}
						</Button>
						<Link href={"/api/auth/signin?callbackUrl=/event/" + eventId}>
							<Button variant="secondary">I have an account</Button>
						</Link>
						{submitStatus === "success" && <Check className="h-4 w-4 text-green-500"/>}
						{submitStatus === "error" && <X className="h-4 w-4 text-red-500"/>}
					</div>
				</form>
			</Form>
		);
	}

	// CASE 2: logged-in user, event is FULL OR is an invited guest
	if (userId && (eventInfo?.inviteVisibility === "FULL" || eventInfo?.RSVP.some(r => r.user && r.user.id === userId))) {
		return (
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6 relative">
					<FormField
						control={form.control}
						name="response"
						render={({field}) => (
							<FormItem>
								<FormLabel>Your Attendance</FormLabel>
								<Select onValueChange={field.onChange} value={field.value} disabled={isExpired}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select your RSVP status"/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="YES">Yes</SelectItem>
										<SelectItem value="NO">No</SelectItem>
										<SelectItem value="MAYBE">Maybe</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage/>
							</FormItem>
						)}
					/>

					{eventInfo.maxGuests > 0 && (
						<FormField
							control={form.control}
							name="guests"
							render={({field}) => (
								<FormItem>
									<FormLabel>+1s (max {eventInfo.maxGuests} per invite)</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={isExpired}
											min="0"
											max={eventInfo.maxGuests}
											placeholder="0"
											{...field}
											onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
											value={field.value || 0}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
					)}

					<p className="text-muted-foreground text-sm">
						{isExpired ? "too late to respond" : `Respond by ${format(new Date(eventInfo.rsvpDuedate), "PPP hh:mm a")}`}
					</p>

					<div className="flex flex-row gap-4 items-center justify-start">
						<Button type="submit" disabled={submitStatus === "loading" || isExpired}>
							{submitStatus === "loading" ? "Submitting..." : "Save"}
						</Button>
						{submitStatus === "success" && <Check className="h-4 w-4 text-green-500"/>}
						{submitStatus === "error" && <X className="h-4 w-4 text-red-500"/>}
					</div>
				</form>
			</Form>
		);
	}

	// CASE 3: logged-in but no eventInfo, or not logged-in and not FULL
	return (
		<div className="flex flex-col gap-5 mt-5">
			<p>Please log in with an invited EventStar account to RSVP to this event!</p>
			<Link href={"/api/auth/signin?callbackUrl=/event/" + eventId}>
				<Button size="sm">Log in</Button>
			</Link>
		</div>
	);
}