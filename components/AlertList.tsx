import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Check, ShieldQuestion, TriangleAlert} from "lucide-react";

interface AlertMessages {
    alerts: {title: string, message: string, icon: 1 | 2 | 3}[];
}
export default function AlertList({alerts}: AlertMessages) {
    return (
        <>
            {alerts.filter((alert) => alert.title).map((alert) => (
                <Alert className="top-left-gradient mb-4">
                    {alert.icon===1? <Check className="h-4 w-4" /> : (alert.icon===2? <TriangleAlert className="h-4 w-4" /> : <ShieldQuestion className="h-4 w-4" />)}
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription>
                        {alert.message}
                    </AlertDescription>
                </Alert>
            ))}
        </>
    );
}