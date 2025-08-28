import AvatarIcon from "@/components/AvatarIcon";

export interface Props {
	user: {
		email: string,
		name: string,
		image: string
		id: string,
	},
	addInvite: (id: string) => void,
}

export default function ExcludedInvite({user, addInvite}:Props) {
	return(
		<div className="flex justify-between items-center p-2 rounded-lg hover:bg-accent cursor-pointer" onClick={() => addInvite(user.id)}>
			<div className="flex space-x-4 items-center">
				<AvatarIcon name={user.name} image={user.image}/>
				<div>
					<p className="text-sm font-medium leading-none">{user.name}</p>
					<p className="text-sm text-muted-foreground">{user.email}</p>
				</div>
			</div>
		</div>
	)
}