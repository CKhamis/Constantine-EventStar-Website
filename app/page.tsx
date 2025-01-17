import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import {auth} from "@/auth";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default async function Home() {
    const session = await auth();
    if (session){
        return (
            <>
                <TopBar/>
                <div className="container mt-4">
                    Logged in
                </div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <TopBar/>
            <div className="container mt-4">
                <Carousel className="w-full mb-4">
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex items-center justify-center p-6">
                                            <span className="text-4xl font-semibold">{index + 1}</span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <Card className="p-5 top-left-gradient">
                    <div className="flex flex-col md:flex-row justify-start items-center mb:items-start gap-10">
                        <Image src="/agent/loading.gif" alt="loading" width={300} height={300} className="mb-5 md:mb-0"/>
                        <div>
                            <CardTitle className="text-4xl mb-4">Welcome to EventStar!</CardTitle>
                            <p className="mb-2">EventStar is a brand new Costi Online service that allows event organizers to distribute event information efficiently and in a more centralized way.</p>
                            <p className="mb-2">This service is currently an invite-only service. You are unable to sign into your account unless your account has been set up by a moderator. Please contact one for more information.</p>
                            <p className="mb-6">For more information about this project, please use the link below!</p>
                            <Link href="https://costionline.com/Projects/Constantine-EventStar-Website"><Button>Project Info</Button></Link>
                        </div>
                    </div>
                </Card>
            </div>
            <Footer/>
        </>
    );
}
