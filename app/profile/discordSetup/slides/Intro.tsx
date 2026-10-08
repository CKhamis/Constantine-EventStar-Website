import Image from "next/image";

export default function Intro(){
    return (
        <div className="flex flex-col gap-7 justify-center items-center mt-8">
            <Image src={"/agent/wave.gif"} alt={"Discord Setup Avatar"} width={300} height={300} />
            <p className="text-4xl font-bold text-center">Welcome to Discord Setup</p>
            <p className="text-2xl text-center">This will set up Discord communications with your EventStar account, allowing for instant event reminders, alerts, and more!</p>
            <p className="">Please select &#34;Next&#34; to proceed.</p>
        </div>
    );
}