import {useState} from "react";
import AvatarIcon from "@/components/AvatarIcon";

export interface Props {
	id: string | undefined, // for already existing RSVP and write-ins
	guests: number,
	firstName: string | undefined,
	lastName: string | undefined,
	user: {
		email: string,
		name: string,
		image: string
		id: string,
	} | undefined,
	removeInvite: () => void,
}

export default function IncludedInvite({id, guests = 0, firstName, lastName, user, removeInvite}: Props){
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
		console.error("Unable to render RSVP:" + RSVP);
		nameSafe = "Invalid RSVP";
		emailSafe = "Error";
		imageSafe = "";
	}

	return (
		<div className="flex justify-between items-center p-2 rounded-lg hover:bg-accent cursor-pointer">
			<div className="flex space-x-4 items-center">
				<AvatarIcon name={user.name} image={user.image}/>
				<div>
					<p className="text-sm font-medium leading-none">{user.name}</p>
					<p className="text-sm text-muted-foreground">{user.email}</p>
				</div>
			</div>
			<div onClick={removeInvite}>rat</div>
		</div>
	);
}