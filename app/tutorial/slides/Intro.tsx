import Image from "next/image";

export default function Intro(){
    return (
        <div className="flex flex-col gap-10 justify-center items-center mt-16">
            <Image src={"/icons/Logo.svg"} alt={"EventStar logo"} width={200} height={200} />
            <p className="text-4xl font-bold text-center">Welcome to EventStar!</p>
            <p className="">Please select &#34;Next&#34; to proceed.</p>
        </div>
    );
}