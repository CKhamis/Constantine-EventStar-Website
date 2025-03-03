'use client'

import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {UserPlus} from "lucide-react";
import Intro from "@/app/tutorial/slides/Intro";
import About from "@/app/tutorial/slides/About";
import Instructions from "@/app/tutorial/slides/Instructions";
import {useState} from "react";
import Image from "next/image";
import EmailForm from "@/app/tutorial/slides/EmailForm";
import FollowPrompt from "@/app/tutorial/slides/FollowPrompt";
import Final from "@/app/tutorial/slides/Final";

export type Slide = {
    backAllowed: boolean,
    forwardAllowed: boolean,
    content: React.ReactNode,
}

export default function DynamicContent() {
    const slideDeck:Slide[] = [
        {backAllowed: true, forwardAllowed: true, content: <Intro />, },
        {backAllowed: true, forwardAllowed: true, content: <About />, },
        {backAllowed: true, forwardAllowed: true, content: <Instructions />, },
        {backAllowed: true, forwardAllowed: false, content: <EmailForm enableNextAction={enableNextCallback} />, },
        {backAllowed: false, forwardAllowed: true, content: <FollowPrompt />, },
        {backAllowed: false, forwardAllowed: true, content: <Final />, },
    ];

    const [slideIndex, setSlideIndex] = useState(0);
    const [enableNext, setEnableNext] = useState<boolean>(true);
    const [enablePrev, setEnablePrev] = useState<boolean>(false);


    function nextPressed(){
        setSlideIndex((prevIndex) => {
            const newIndex = prevIndex + 1;

            //set nav buttons
            setEnableNext(slideDeck[newIndex].forwardAllowed);
            setEnablePrev(slideDeck[newIndex].backAllowed);

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
            setEnableNext(slideDeck[newIndex].forwardAllowed);
            setEnablePrev(slideDeck[newIndex].backAllowed);

            if(newIndex <= 0){
                setEnablePrev(false);
            }

            return newIndex;
        });
    }

    function enableNextCallback(){
        setEnableNext(true);
    }

    return (
        <div className="w-100" style={{
            backgroundImage: `url('/tiles/logoTiles.svg')`,
            backgroundSize: '120px',
        }}>
            <div className="container flex flex-col h-screen bg-neutral-900 p-0 border">
                <div className="top-left-gradient p-4 flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-3">
                        <Image src="/icons/Logo.svg" alt="logo" height={40} width={40} />
                        <p className="font-bold text-3xl">EventStar Setup</p>
                    </div>
                    <UserPlus style={{width: '40px', height: '40px'}}/>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <ScrollArea className="p-4">
                        {slideDeck[slideIndex].content}
                        <ScrollBar orientation="vertical"/>
                    </ScrollArea>
                </div>
                <div className="bg-neutral-900 flex flex-row items-center justify-between gap-4 px-4 pt-4 pb-20 md:pb-4">
                    <Progress value={(slideIndex / (slideDeck.length - 1)) * 100}/>
                    <div className="flex flex-row gap-2 justify-end items-center">
                        <Button variant="secondary" onClick={prevPressed} disabled={!enablePrev}>Previous</Button>
                        <Button onClick={nextPressed} disabled={!enableNext}>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}