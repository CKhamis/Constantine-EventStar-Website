'use client'

import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import Intro from "@/app/enrollment/[id]/slides/Intro";
import EmailForm from "@/app/enrollment/[id]/slides/EmailForm";
import Link from "next/link"
import {UserPlus} from "lucide-react";
import About from "@/app/enrollment/[id]/slides/About";
import HostNote from "@/app/enrollment/[id]/slides/HostNote";
import Instructions from "@/app/enrollment/[id]/slides/Instructions";

export type Props = {
    ticketId: string;
}

export type Slide = {
    backAllowed: boolean,
    forwardAllowed: boolean,
    content: React.ReactNode,
}

export default function DynamicContent({ticketId}: Props){
    const slideDeck:Slide[] = [
        {backAllowed: true, forwardAllowed: true, content: <Intro />, },
        {backAllowed: true, forwardAllowed: true, content: <About />, },
        {backAllowed: true, forwardAllowed: true, content: <HostNote />, },
        {backAllowed: true, forwardAllowed: true, content: <Instructions />, },
        {backAllowed: true, forwardAllowed: true, content: <EmailForm ticketId={ticketId} />, },
        {backAllowed: true, forwardAllowed: true, content: <p>test2</p>, },
    ];

    const [slideIndex, setSlideIndex] = useState(0);
    const [enableNext, setEnableNext] = useState(true);
    const [enablePrev, setEnablePrev] = useState(false);


    function nextPressed(){
        setSlideIndex((prevIndex) => {
            const newIndex = prevIndex + 1;

            //set nav buttons
            setEnableNext(slideDeck[newIndex].backAllowed);
            setEnablePrev(slideDeck[newIndex].forwardAllowed);

            if(newIndex >= slideDeck.length -1){
                setEnableNext(false);
            }

            return newIndex;
        });
    }

    function prevPressed(){
        setSlideIndex((prevIndex) => {
            const newIndex = prevIndex - 1;

            //set nav buttons
            setEnableNext(slideDeck[newIndex].backAllowed);
            setEnablePrev(slideDeck[newIndex].forwardAllowed);

            if(newIndex <= 0){
                setEnablePrev(false);
            }

            return newIndex;
        });
    }

    return (
        <div className="container flex flex-col h-screen bg-neutral-900 p-0 border">
            <div className="top-left-gradient p-4 flex flex-row justify-between items-center">
                <div>
                    <Link href="https://costionline.com" className="text-muted-foreground">Exit to Costi Online</Link>
                    <p className="font-bold text-3xl">EventStar Enrollment</p>
                </div>
                <UserPlus style={{ width: '40px', height: '40px' }}/>
            </div>
            <div className="flex-grow overflow-y-auto">
                <ScrollArea className="p-4">
                    {slideDeck[slideIndex].content}
                    <ScrollBar orientation="vertical"/>
                </ScrollArea>
            </div>
            <div className="bg-neutral-900 flex flex-row items-center justify-between gap-4 px-4 pt-4 pb-20 md:pb-4">
                <Progress value={(slideIndex/(slideDeck.length - 1)) * 100}/>
                <div className="flex flex-row gap-2 justify-end items-center">
                    <Button variant="secondary" onClick={prevPressed} disabled={!enablePrev}>Previous</Button>
                    <Button onClick={nextPressed} disabled={!enableNext}>Next</Button>
                </div>
            </div>
        </div>
    );
}