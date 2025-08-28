import AvatarIcon from "@/components/AvatarIcon";

export interface Props {
	email: string,
	name: string,
	image: string
	id: string,
	addInvite: () => void,
}

export default function ExcludedInvite({email, name, image, id, addInvite}:Props) {
	return(
		<div className="flex justify-between items-center p-2 rounded-lg hover:bg-accent cursor-pointer" onClick={() => addInvite()}>
			<div className="flex space-x-4 items-center">
				<AvatarIcon name={name} image={image}/>
				<div>
					<p className="text-sm font-medium leading-none">{name}</p>
					<p className="text-sm text-muted-foreground">{email}</p>
				</div>
			</div>
		</div>
	)
}