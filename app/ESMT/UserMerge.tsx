import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {esmtUser} from "@/app/api/ESMT/user/all/route";
import {useState} from "react";
import {Card} from "@/components/ui/card";
import AvatarIcon from "@/components/AvatarIcon";
import {ESMTUserDetails} from "@/app/api/ESMT/user/detail/[id]/route";

interface Props{
	users: esmtUser[]
}

export default function UserMerge({users}:Props){
	const [host, setHost] = useState<ESMTUserDetails | null>(null);


    const handleSelect = async (id: string) => {
        try {
            const res = await fetch(`/api/ESMT/user/detail/${id}`);
            if (!res.ok) throw new Error("Failed to fetch user details");
            const data: ESMTUserDetails = await res.json();
            setHost(data);
        } catch (err) {
            console.error(err);
            setHost(null);
        }
    };

	return (
		<div className="grid-cols-1">
			<p className="text-2xl font-bold">1. Select Host Account</p>
			<div className="md:grid-cols-3 grid w-100 mt-2 gap-5">
				<Select onValueChange={(e) => handleSelect(e)}>
					<SelectTrigger>
						<SelectValue placeholder="Choose User" />
					</SelectTrigger>
					<SelectContent>
						{users.map(user => (<SelectItem value={user.id} key={user.id}>{user.name}</SelectItem>))}
					</SelectContent>
				</Select>
				<Card className="p-5 flex flex-col gap-5">
                    <div className="flex flex-row justify-start align-center items-center gap-4">
                        <AvatarIcon name={host?.name} key={host?.id} size="small" image={host?.image} />
                        <p className="text-xl font-bold">{host? host.name : "None Selected"}</p>
                    </div>
                    <div className="flex flex-row justify-evenly align-center items-center gap-5">
                        <div className="flex flex-col justify-center align-center items-center">
                            <p className="text-bold text-2xl">{host? host.followedBy.length : "?"}</p>
                            <p className="">Followers</p>
                        </div>
                        <div className="flex flex-col justify-center align-center items-center">
                            <p className="text-bold text-2xl">{host? host.event.length : "?"}</p>
                            <p className="">Events</p>
                        </div>
                        <div className="flex flex-col justify-center align-center items-center">
                            <p className="text-bold text-2xl">{host? host.following.length : "?"}</p>
                            <p className="">Following</p>
                        </div>
                        <div className="flex flex-col justify-center align-center items-center">
                            <p className="text-bold text-2xl">{host? host.accounts.length : "?"}</p>
                            <p className="">Accounts</p>
                        </div>
                        <div className="flex flex-col justify-center align-center items-center">
                            <p className="text-bold text-2xl">{host? host.rsvp.length : "?"}</p>
                            <p className="">RSVP</p>
                        </div>
                    </div>
                </Card>
				<Card className="p-5 flex gap-5 items-stretch align-center">
                    <div className="flex items-center overflow-x-scroll gap-4">
                        <div className="flex flex-col justify-center align-center items-center">
                            <p className="text-bold text-2xl">{host? host.accounts.length : "?"}</p>
                            <p className="">Accounts</p>
                        </div>
                        <div className="flex flex-col justify-center align-center items-center">
                            <p className="text-bold text-2xl">{host? host.accounts.length : "?"}</p>
                            <p className="">Accounts</p>
                        </div>
                    </div>
                </Card>
			</div>

		</div>
	);
}