import Image from "next/image";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";

export function LoadingIcon() {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center p-10 fixed left-0 top-0 z-[100]">
            <Card>
                <CardHeader>

                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                    <Image src="/agent/loading.gif" alt="loading" width={400} height={400} unoptimized={true} />
                    <p className="text-4xl font-bold text-center">Now Loading</p>
                </CardContent>
                <CardFooter>

                </CardFooter>
            </Card>

        </div>
    )
}
