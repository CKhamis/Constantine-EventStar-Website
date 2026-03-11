import {DiscordLogResponse} from "@/app/api/ESMT/providers/discord/logs/[page]/route";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {Card} from "@/components/ui/card";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";

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

    const canPrev = page > 0;
    const canNext = page + 1 < logs.pages;

    return (
        <div className="flex flex-col gap-5">
            <Card className="w-full top-left-gradient p-6 flex flex-col items-center justify-center gap-4 rounded-none">
                <div className="flex flex-row justify-start gap-5 items-center w-full">
                    <Image src="/icons/COW Logo.svg" alt="Discord Logo" height={40} width={40} />
                    <p className="font-bold text-3xl">Connected to EventStar Noisy</p>
                </div>
                <div className="flex flex-row items-center justify-between w-full text-sm">
                    <p>Internal URL: {url}</p>
                    <p>Total Logs: {logs.lines}</p>
                </div>
            </Card>

            <div className="flex items-center justify-between">
                <p className="font-bold text-xl">All Logs</p>
                <div className="flex flex-row items-center justify-end gap-3">
                    <div className="text-sm">
                        Page <span className="font-semibold">{page + 1}</span> /{" "}
                        <span className="font-semibold">{logs.pages}</span>
                    </div>

                    <Button variant="secondary" size="icon" disabled={!canPrev} onClick={() => setPage(page - 1)}>
                        <ChevronLeft />
                    </Button>
                    <Button variant="secondary" size="icon" disabled={!canNext} onClick={() => setPage(page + 1)}>
                        <ChevronRight />
                    </Button>
                </div>
            </div>

            <Card className="w-full p-0 overflow-hidden rounded-none">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-background">
                        <tr className="border-b">
                            <th className="text-left px-4 py-3 w-[220px]">Timestamp</th>
                            <th className="text-left px-4 py-3 w-[90px]">Level</th>
                            <th className="text-left px-4 py-3">Message</th>
                            <th className="text-left px-4 py-3 w-[220px]">Target</th>
                            <th className="text-left px-4 py-3 w-[280px]">Span</th>
                        </tr>
                        </thead>

                        <tbody>
                        {logs.logs.length === 0 ? (
                            <tr>
                                <td className="px-4 py-6 text-center text-muted-foreground" colSpan={5}>
                                    No logs on this page.
                                </td>
                            </tr>
                        ) : (
                            logs.logs.map((row, i) => {
                                const span = row.span
                                    ? {
                                        state: row.span.state ?? "",
                                        name: row.span.name ?? "",
                                        page: row.span.page ?? "",
                                        event: row.span.event ?? "",
                                    }
                                    : null;

                                const spanText = span
                                    ? Object.entries(span)
                                        .filter(([, v]) => v && v.trim().length > 0)
                                        .map(([k, v]) => `${k}=${v}`)
                                        .join(" • ")
                                    : "";

                                return (
                                    <tr key={`${row.timestamp}-${i}`} className="border-b last:border-b-0">
                                        <td className="px-4 py-3 whitespace-nowrap">{format(new Date(row.timestamp), "PPP hh:mm a")}</td>

                                        <td className="px-4 py-3">
                                            <Badge variant={getBadgeVariant(row.level)}>
                                                {row.level}
                                            </Badge>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="max-w-[900px] whitespace-pre-wrap break-words">
                                                {row.fields?.message ?? ""}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap">{row.target}</td>

                                        <td className="px-4 py-3">
                                            {spanText ? (
                                                <span className="text-muted-foreground">{spanText}</span>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex items-center justify-between">
                <p className="font-bold text-xl"></p>
                <div className="flex flex-row items-center justify-end gap-3">
                    <div className="text-sm">
                        Page <span className="font-semibold">{page + 1}</span> /{" "}
                        <span className="font-semibold">{logs.pages}</span>
                    </div>

                    <Button variant="secondary" size="icon" disabled={!canPrev} onClick={() => setPage(page - 1)}>
                        <ChevronLeft />
                    </Button>
                    <Button variant="secondary" size="icon" disabled={!canNext} onClick={() => setPage(page + 1)}>
                        <ChevronRight />
                    </Button>
                </div>
            </div>

        </div>
    );
}

function getBadgeVariant(level: string) {
    const normalized = level.toLowerCase();

    if (normalized.includes("error")) return "destructive";
    if (normalized.includes("warn")) return "secondary";
    if (normalized.includes("info")) return "outline";

    return "default";
}