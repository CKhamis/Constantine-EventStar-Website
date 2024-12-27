import {enrollerResponse} from "@/components/Types";

export type Props = {
    enrollerResponse: enrollerResponse;
}

export default function Final({enrollerResponse}: Props){
    return (
        <div className="flex flex-col justify-center items-center">
            <p className="text-3xl font-bold">You're Almost Done!</p>
            <p>Click the button below to log in. You cannot go back to this screen once it's pressed</p>
        </div>
    );
}