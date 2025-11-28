import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {esmtUser} from "@/app/api/ESMT/user/all/route";
import {useState} from "react";

interface Props{
	users: esmtUser[]
}

export default function UserMerge({users}:Props){
	const [host, setHost] = useState<esmtUser | null>(null);
	const [secondary, setSecondary] = useState<esmtUser | null>(null);

	return (
		<div className="grid-cols-1">
			<p className="text-2xl font-bold">1. Select Host Account</p>
			<div className="md:grid-cols-3 grid w-100 mt-2">
				<Select value={host?.id ?? undefined} onValueChange={(e) => setHost(users.find(u => u.id === e) || null)}>
					<SelectTrigger>
						<SelectValue placeholder="Choose User" />
					</SelectTrigger>
					<SelectContent>
						{users.map(user => (<SelectItem value={user.id} key={user.id}>{user.name}</SelectItem>))}
					</SelectContent>
				</Select>
				<p>2</p>
				<p>3</p>
			</div>

		</div>
	);
}