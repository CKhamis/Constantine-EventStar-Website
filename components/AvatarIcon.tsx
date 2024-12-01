import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface Props{
    name: string | null
    image: string | null
}
export default function AvatarIcon({name, image}: Props){
    const initials = () => {
        if (!name) return "?";
        const parts = name.split(" ");
        return parts.length > 1
            ? parts[0][0] + parts[1][0]
            : parts[0][0];
    }

    return (
        <Avatar className="h-12 w-12">
            {image && <AvatarImage src={image} alt={`${name}`}/>}
            <AvatarFallback>{initials()}</AvatarFallback>
        </Avatar>
    );
}