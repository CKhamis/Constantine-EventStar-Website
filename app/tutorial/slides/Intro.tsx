import Image from "next/image";

export default function Intro(){
    return (
        <div className="flex flex-col gap-7 justify-center items-center mt-16">
            <Image src={"/agent/wave.gif"} alt={"EventStar logo"} width={300} height={300} />
            <p className="text-4xl font-bold text-center">Welcome to EventStar!</p>
            <p className="">Please select &#34;Next&#34; to proceed.</p>
        </div>
    );
}