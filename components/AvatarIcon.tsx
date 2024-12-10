import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface Props{
    name?: string | null
    image?: string | null
    size?: "small" | "large"
}
export default function AvatarIcon({name, image, size = "small"}: Props){
    const initials = () => {
        if (!name) return "?";
        const parts = name.split(" ");
        return parts.length > 1
            ? parts[0][0] + parts[1][0]
            : parts[0][0];
    }

    if(size === "small"){
        return (
            <Avatar className="h-12 w-12">
                {image && <AvatarImage src={image} alt={`${name}`}/>}
                <AvatarFallback>{initials()}</AvatarFallback>
            </Avatar>
        );
    }else{
        return (
            <Avatar className="h-24 w-24">
                {image && <AvatarImage src={image} alt={`${name}`}/>}
                <AvatarFallback>{initials()}</AvatarFallback>
            </Avatar>
        );
    }

}