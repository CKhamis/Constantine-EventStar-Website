'use client'
import Image from "next/image";
import {AgentDialog} from "@/components/AgentDialog";
import {Button} from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import Link from "next/link";

export interface Props {
	eventId: string;
	open: boolean;
	onOpenChanged: (open: boolean) => void;
	submitAnyway: () => void;
}

export function Sus({eventId, open, onOpenChanged, submitAnyway}: Props) {
	return (
		<Dialog open={open} onOpenChange={onOpenChanged} defaultOpen={false}>
			<DialogContent className="max-w-md">
				<DialogTitle>Hmmmm...</DialogTitle>
				<DialogHeader className="flex-row justify-center align-center">
					<Image src="/agent/sus.gif" alt="loading" width={300} height={300}/>
				</DialogHeader>
				<DialogDescription className="flex flex-col items-center justify-center text-2xl text-center">
					<AgentDialog words={["Uhhhh hi there.🤓👆", "So basically, I just saw what you typed there and uuuuuuh 🚪", "It kinda looks like you already have an account.", "You should sign in with your account...or else."]} />
				</DialogDescription>

				<DialogFooter className="w-full flex items-center justify-center gap-4">
					<Link href={"/api/auth/signin?callbackUrl=/event/" + eventId}><Button>Ok FINE, I'll sign in</Button></Link>
					<Button variant="secondary"onClick={submitAnyway}>I don't have one</Button>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
				</DialogFooter>

			</DialogContent>

		</Dialog>
	)
}
