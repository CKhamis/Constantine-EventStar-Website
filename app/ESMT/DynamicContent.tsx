'use client'

import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import axios from "axios";
import {EVResponse} from "@/app/api/events/view/[id]/route";

export default function DynamicContent() {
    const [loading, setLoading] = useState(true);

    async function refresh(){
        setLoading(true);
        // await axios.get("/api/events/view/" + eventId)
        //     .then((response) => {
        //         // Event exists, but need to know if user was invited
        //         setEventInfo(response.data);
        //         document.querySelector("#background")!.style.background = response.data.backgroundStyle;
        //
        //         const invitedUser = response.data.RSVP.find((r: rsvp) => r.user.id === userId);
        //
        //         if(invitedUser){
        //             // user is invited
        //             setRSVP(invitedUser);
        //             form.setValue("response", invitedUser.response)
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error.status); // event not found, access denied, or need login
        //         document.querySelector("#background")!.style.background = "black";
        //     });
        setLoading(false);
    }

    useEffect(() => {
        refresh()
    }, []);

    return (
        <>
            {loading && <LoadingIcon/>}

        </>
    );
}