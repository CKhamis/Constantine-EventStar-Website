import {auth} from "@/auth";
import {redirect} from "next/navigation";
import MainNav from "@/components/MainNav";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Angry, CalendarCheck, ChartSpline, IdCard, Info, Landmark, Sparkle, Star} from "lucide-react";
import Footer from "@/components/Footer";
import DynamicContent from "@/app/DynamicContent";

export default async function home(){
    const session = await auth();

    if(session){
        if(session.user && session.user.tutorial){
            redirect("/tutorial");
        }
        return (<MainNav><DynamicContent /></MainNav>);
    }else{
        return (
            <MainNav>
                <div className="container mt-4">
                    <Carousel className="mb-4">
                        <CarouselContent>
                            <CarouselItem>
                                <div className="p-1">
                                    <Card style={{
                                        backgroundImage: `url('/tiles/logoTiles.svg')`,
                                        backgroundSize: '120px'
                                    }}>
                                        <CardContent className="flex items-center flex-col justify-center p-6 my-10">
                                            <div className="flex flex-row justify-start gap-5 items-center">
                                                <Image src={"/icons/Logo.svg"} alt={"EventStar logo"} width={100} height={100}/>
                                                <div>
                                                    <span className="text-4xl md:text-6xl font-semibold">EventStar</span>
                                                    <p className="text-muted-foreground ml-1">A Costi Online Service</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                    </Carousel>
                    <p className="text-muted-foreground text-xs">Version {process.env.version}</p>
                    <br className="my-10"/>
                    <Card className="p-5 top-left-gradient">
                        <div className="flex flex-col md:flex-row justify-start items-center mb:items-start gap-10">
                            <Image src="/agent/loading.gif" alt="loading" width={300} height={300} className="mb-5 md:mb-0" unoptimized={true}/>
                            <div>
                                <CardTitle className="text-4xl mb-4">Welcome to EventStar!</CardTitle>
                                <p className="mb-2">EventStar is a brand new Costi Online service that allows event organizers to distribute event information efficiently and in a more centralized way.</p>
                                <p className="mb-2">This service is currently an invite-only service. You are unable to sign into your account unless your account has been set up by a moderator. Please contact one for more information.</p>
                                <p className="mb-6">For more information about this project, please use the link below!</p>
                                <Link href="https://costionline.com/Projects/Constantine-EventStar-Website"><Button>Project Info</Button></Link>
                            </div>
                        </div>
                    </Card>
                    <br className="my-10"/>
                    <p className="mt-5 mb-3 font-bold text-3xl">Why use EventStar?</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                        <Card>
                            <CardHeader>
                                <CalendarCheck className="w-10 h-10"/>
                                <CardTitle className="text-2xl">Organized Invites</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Keep track of upcoming events, RSVP to event invitations, and view who else is going.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <ChartSpline className="w-10 h-10"/>
                                <CardTitle className="text-2xl">Gamify Hangouts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Earn points for answering RSVPs on time and redeem them on fun prizes! (coming soon)</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <IdCard className="w-10 h-10"/>
                                <CardTitle className="text-2xl">Interactive Cards</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Get your own membership card to check into events. (coming soon)</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Star className="w-10 h-10"/>
                                <CardTitle className="text-2xl">Rate Places of Interest</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Rate restauraunts, malls, theme parks, and more on EventStar. Veto places you refuse to go to. (coming soon)</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Info className="w-10 h-10"/>
                                <CardTitle className="text-2xl">Get Notified</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>With the Costifications feature, stay informed and reminded of upcoming events and notices. (coming soon)</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Landmark className="w-10 h-10"/>
                                <CardTitle className="text-2xl">Community Decisions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>View ratings of spots amongst your hangout group and decide where to go. (coming soon)</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Sparkle className="w-10 h-10"/>
                                <CardTitle className="text-2xl">More to Come</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Leaderboards, inter - Costi Online functionality, exclusive events, customization, and more!</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Angry className="w-10 h-10"/>
                                <CardTitle className="text-2xl">Be Evil</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>I don&#39;t have anything to say here. I didn&#39;t think you&#39;d get this far. Kudos to you :)</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Footer/>
            </MainNav>
        );
    }
}