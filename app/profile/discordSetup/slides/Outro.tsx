import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Outro(){
    return (
        <div className="flex flex-col gap-7 justify-center items-center mt-8">
            <Image src={"/agent/approve.png"} alt={"Discord Setup Avatar"} width={300} height={300} />
            <p className="text-4xl font-bold text-center">All Done!</p>
            <p className="text-2xl text-center">You are now able to get communications from EventStar right from your Discord account.</p>
            <Link href="/profile"><Button>Account Settings</Button></Link>
        </div>
    );
}