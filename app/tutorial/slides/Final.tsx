import {Button} from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import {useRouter} from "next/navigation";

export default function Final(){
    const router = useRouter();

    async function invalidateToken() {
        try{
            await axios.post('/api/user/setup/finish', {});
            router.push("/api/auth/signin");
        }catch(e){
            console.log(e)
        }finally {

        }
    }

    return (
        <div className="flex flex-col justify-center items-center mt-10">
            <Image src={"/icons/Logo.svg"} alt={"EventStar logo"} width={200} height={200} />
            <p className="text-3xl font-bold mt-5">You&#39;re Almost Done!</p>
            <p className="mt-3">Click the button below to log in. You cannot go back to this screen once it&#39;s pressed</p>
            <Button size="lg" className="mt-7" onClick={invalidateToken}>Log in</Button>
            <p className="text-center mt-3 text-muted-foreground">Please make sure the email you entered matches the log in you are about to use!</p>
        </div>
    );
}