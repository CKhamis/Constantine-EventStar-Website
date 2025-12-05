import Image from "next/image";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export interface Props{
	setOpen: () => void
}

export function GuestPopup({setOpen}: Props) {
	return (
			<div className="w-screen h-screen flex flex-col items-center justify-center p-10 fixed left-0 top-0 z-[100]">
				<Card className="max-w-xl">
					<div className="top-left-gradient rounded-xl">
						<CardHeader>
							<p className="text-2xl font-bold">Bring a Friend (or Two)!</p>
							<p className="text-muted-foreground">New feature of EventStar 4.5+</p>
						</CardHeader>
						<CardContent className="flex flex-col items-center justify-center">
							<Image width={500} height={600} src="/agent/Plusone.gif" alt="Guest Feature Image" unoptimized={true} />
							<p className="mt-8">Invited guests can now add their own +1s to your EventStar events. Organizers decide how many guests each invitee can bring.</p>
						</CardContent>
						<CardFooter>
							<Button onClick={setOpen}>Dismiss</Button>
						</CardFooter>
					</div>
				</Card>
			</div>
	)
}
