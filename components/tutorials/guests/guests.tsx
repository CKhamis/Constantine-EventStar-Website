import Image from "next/image";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export interface Props{
	setOpen: () => void
}

export function GuestPopup({setOpen}: Props) {
	return (
			<div className="w-screen h-screen flex flex-col items-center justify-center p-10 fixed left-0 top-0 z-[100]">
				<Card className="max-w-3xl">
					<div className="top-left-gradient rounded-xl">
						<CardHeader>
							<p className="text-2xl font-bold">+1 Feature</p>
							<p className="text-muted-foreground">New feature of EventStar</p>
						</CardHeader>
						<CardContent className="flex flex-col items-center justify-center">
							<Image width={700} height={600} src="/tutorials/guests.png" alt="Guest Feature Image"/>
							<p className="mt-8">EventStar events can now allow guests to invite +1s. Event Organizers are in charge of adjusting how many you are allowed to bring.</p>
						</CardContent>
						<CardFooter>
							<Button onClick={setOpen}>Dismiss</Button>
						</CardFooter>
					</div>
				</Card>
			</div>
	)
}
