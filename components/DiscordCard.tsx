import {Card, CardContent} from "@/components/ui/card";
import AvatarIcon from "@/components/AvatarIcon";
import {DiscordUsernameSearchResult} from "@/app/api/user/notifications/providers/discord/searchUser/route";
import {cn} from "@/lib/utils";

export type Props = DiscordUsernameSearchResult & {
    onClick: (id: number) => void,
    isSelected: boolean,
}

export default function DiscordCard({id, name, avatar, global_name, onClick, isSelected}:Props){
    return (
        <Card onClick={() => onClick(id)} className={cn( "w-full cursor-pointer transition-all flex flex-row items-center gap-5 p-5 mb-3", isSelected  ? "border-primary ring-2 ring-primary shadow-md"  : "hover:border-muted-foreground/40")}>
            <AvatarIcon name={name} image={avatar} size={"large"} />
            <div className="flex flex-col">
                <p className="text-2xl">{global_name? global_name : name}</p>
                <p className="text-muted-foreground text-md">{global_name? name : "Discord Username"}</p>
            </div>
        </Card>
    );
}