import {Button} from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import {useRouter} from "next/navigation";

export default function Final(){
    const router = useRouter();

    async function invalidateToken() {
        try{
            await axios.post('/api/user/setup/finish', {});
            router.push("/");
        }catch(e){
            console.log(e)
        }finally {

        }
    }

    return (
        <div className="flex flex-col justify-center items-center mt-10">
            <Image src={"/icons/Logo.svg"} alt={"EventStar logo"} width={200} height={200} />
            <p className="text-3xl font-bold mt-5">Account Setup Complete</p>
            <p className="mt-3">Click the button below to go to the home screen. Please enjoy EventStar!</p>
            <Button size="lg" className="mt-7" onClick={invalidateToken}>Home</Button>
        </div>
    );
}