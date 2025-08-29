import {useState} from "react";
import AvatarIcon from "@/components/AvatarIcon";
import {X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import axios from "axios";
import {toast} from "sonner";

export interface Props {
	id: string, // for already existing RSVP and write-ins
	guests: number,
	firstName: string | undefined,
	lastName: string | undefined,
	response: string,
	user: {
		email: string,
		name: string,
		image: string
		id: string,
	} | undefined,
	removeInvite: () => void,
	updateInvite: (id: string, response: string, guestOverride: number) => void,
}

export default function IncludedInvite({id, guests = 0, firstName, lastName, user, removeInvite, updateInvite, response}: Props){
	const [guestCount, setGuestCount] = useState(guests);

	let nameSafe: string;
	let emailSafe: string;
	let imageSafe: string;

	if(user){
		// EventStar user
		nameSafe = user.name;
		emailSafe = user.email;
		imageSafe = user.image;
	}else if(firstName && lastName){
		// Write-In guest
		nameSafe = firstName + " " + lastName;
		emailSafe = "Write-In Guest";
		imageSafe = "";
	}else{
		// Error
		nameSafe = "Invalid RSVP";
		emailSafe = "Error";
		imageSafe = "";
	}

	return (
		<div className="flex justify-between items-center p-2 rounded-lg hover:bg-accent">
			<div className="flex space-x-4 items-center flex-grow">
				<AvatarIcon name={nameSafe} image={imageSafe}/>
				<div>
					<p className="text-sm font-medium leading-none">{nameSafe}</p>
					<p className="text-sm text-muted-foreground">{emailSafe}</p>
				</div>
			</div>

			<div className="flex items-center justify-center flex-none space-x-2 mr-3">
				<p>+1s</p>
				<Input
					type="number"
					min="0"
					placeholder="0"
					onChange={(e) => {
						const value = e.target.valueAsNumber || 0;
						setGuestCount(value);
						updateInvite(id, response, value);
					}}
					value={guestCount || 0}
					className="w-16"
				/>
			</div>

			<Button variant="destructive" size="icon" className="size-8" onClick={removeInvite}>
				<X/>
			</Button>
		</div>
	);
}