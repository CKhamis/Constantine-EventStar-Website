import {DiscordLogResponse} from "@/app/api/ESMT/providers/discord/logs/[page]/route";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {Card} from "@/components/ui/card";

interface Props {
    page: number,
    setPage: (page: number) => void;
    logs: DiscordLogResponse | null
    url: string | undefined
}

export default function DiscordDashboard({page, setPage, logs, url}:Props) {
    if(logs === undefined || logs === null || url === undefined) {
        return (
            <div className="flex flex-col w-100 items-center justify-center h-full">
                <Image src="/agent/empty.png" alt="No Logs" width={200} height={200} />
                <p className="font-bold">OOPS!</p>
            </div>);
    }

    return (
        <>
            <Card className="w-full top-left-gradient p-6 flex flex-col items-center justify-center gap-4 ">
                <div className="flex flex-row justify-start gap-5 items-center w-full">
                    <Image src="/icons/COW Logo.svg" alt="Discord Logo" height={40} width={40} />
                    <p className="font-bold text-3xl">Connected to EventStar Noisy</p>
                </div>
                <div className="flex flex-row items-center justify-between w-full">
                    <p>Internal URL: {url}</p>
                    <p>Total Logs: {logs.lines}</p>
                </div>
            </Card>
            <Button onClick={()=>setPage(page+1)}>{page}</Button>
        </>
    );
}
