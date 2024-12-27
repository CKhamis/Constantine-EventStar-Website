import {enrollerResponse} from "@/components/Types";
import AvatarIcon from "@/components/AvatarIcon";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CircleArrowDown} from "lucide-react";

export type Props = {
    enrollerResponse: enrollerResponse;
}

export default function Review({enrollerResponse}: Props){
    return(
        <div className="flex flex-col justify-center items-center">
            <p className="text-3xl font-bold text-center">Please review the following information</p>

            <Card className="mt-10">
                <CardHeader>
                    <CardTitle>EventStar Inviter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row items-center gap-5">
                        <AvatarIcon name={enrollerResponse.author.name} image={enrollerResponse.author.image} size={"large"}/>
                        <p className="font-bold text-2xl">{enrollerResponse.author.name}</p>
                    </div>
                </CardContent>
            </Card>
            <CircleArrowDown className="mt-10" />
            <Card className="mt-10">
                <CardHeader>
                    <CardTitle>You</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row items-center gap-5">
                        <AvatarIcon name={enrollerResponse.user.name} image={enrollerResponse.user.image} size={"large"}/>
                        <p className="font-bold text-2xl">{enrollerResponse.user.name}</p>
                    </div>
                </CardContent>
            </Card>

            <p className="text-center mt-10">If everything looks correct to you, select next. Otherwise, let {enrollerResponse.author.name} know.</p>
        </div>
    );
}