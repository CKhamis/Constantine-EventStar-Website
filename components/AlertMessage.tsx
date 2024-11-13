import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Check, TriangleAlert, ShieldQuestion} from "lucide-react";

interface Props{
    title: string;
    message: string;
    code: 1 | 2 | 3;
}

export default function AlertMessage({title, message, code=1}: Props) {
    if(!message){return null}
    const icon = code===1? <Check className="h-4 w-4" /> : (code===2? <TriangleAlert className="h-4 w-4" /> : <ShieldQuestion className="h-4 w-4" />);
    return (
        <Alert className="top-left-gradient mb-4">
            {icon}
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {message}
            </AlertDescription>
        </Alert>
    )
}