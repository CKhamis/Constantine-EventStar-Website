import Image from "next/image";
import {useRouter} from "next/navigation";

export default function Intro(){
    const router = useRouter();


    return (
        <div className="flex flex-col gap-10 justify-center items-center mt-16">
            <Image src={"/icons/Logo.svg"} alt={"EventStar logo"} width={300} height={300} />
            <p className="text-4xl font-bold text-center">Welcome to EventStar!</p>
            <p className="text-muted-foreground">You have been invited to a special invite-only service. More details to follow on the next page. Please select &#34;Next&#34; to proceed.</p>
        </div>
    );
}