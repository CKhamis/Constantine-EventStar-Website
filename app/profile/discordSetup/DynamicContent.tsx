'use client'
import {useState} from "react";
import Intro from "@/app/profile/discordSetup/slides/Intro";
import Image from "next/image";
import {MessageSquareShare} from "lucide-react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import Information from "@/app/profile/discordSetup/slides/Information";
import Step1 from "@/app/profile/discordSetup/slides/Step1";
import Step2 from "@/app/profile/discordSetup/slides/Step2";

interface Props {
    id: string;
}

type Slide = {
    backAllowed: boolean,
    forwardAllowed: boolean,
    content: React.ReactNode,
}

export default function DynamicContent({id}: Props) {
    const [selectedDiscordId, setSelectedDiscordId] = useState<string | null>(null);

    const slideDeck:Slide[] = [
        {backAllowed: false, forwardAllowed: true, content:<Intro />},
        {backAllowed: true, forwardAllowed: true, content:<Information />},
        {backAllowed: false, forwardAllowed: false, content:<Step1 selectedDiscordId={selectedDiscordId} setSelectedDiscordId={setSelectedDiscordId} enableNextAction={enableNextCallback} />},
        {backAllowed: false, forwardAllowed: false, content:<Step2 selectedDiscordId={selectedDiscordId} enableNextAction={enableNextCallback} />},
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
                        <p className="font-bold text-3xl">Discord Connection Setup</p>
                    </div>
                    <MessageSquareShare style={{width: '40px', height: '40px'}}/>
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