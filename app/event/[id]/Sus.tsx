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
}

export function Sus({eventId, open, onOpenChanged}: Props) {
	return (
		<Dialog open={open} onOpenChange={onOpenChanged} defaultOpen={false}>
			<DialogContent className="max-w-md">
				<DialogTitle>Hmmmm...</DialogTitle>
				<DialogHeader>
					<Image src="/agent/Sus.png" alt="loading" width={400} height={400}/>
				</DialogHeader>
				<DialogDescription className="flex flex-col items-center justify-center text-2xl text-center">
					<AgentDialog words={["Uhhhh hi there.🤓👆", "So basically, I just saw what you typed there and uuuuuuh 🚪", "It kinda looks like you already have an account.", "You should sign in with your account...or else.", "I won't send you to the homescreen afterwards.", "Or will I? 😈"]} />
				</DialogDescription>

				<DialogFooter className="w-full flex items-center justify-center gap-4">
					<Link href={"/api/auth/signin?callbackUrl=/event/" + eventId}><Button>Ok FINE, I'll sign in</Button></Link>
					<Button variant="secondary">I don't have one</Button>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
				</DialogFooter>

			</DialogContent>

		</Dialog>
	)
}
