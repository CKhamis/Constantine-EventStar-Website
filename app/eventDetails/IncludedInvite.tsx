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

	//TODO: (Before release) Implement guest number change
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
		<div className="flex justify-between items-center p-2 rounded-lg hover:bg-accent cursor-pointer">
			<div className="flex space-x-4 items-center">
				<AvatarIcon name={nameSafe} image={imageSafe}/>
				<div>
					<p className="text-sm font-medium leading-none">{nameSafe}</p>
					<p className="text-sm text-muted-foreground">{emailSafe}</p>
				</div>
			</div>
			<div onClick={removeInvite}>rat</div>
		</div>
	);
}