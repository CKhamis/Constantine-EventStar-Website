'use client'
import {Button} from "@/components/ui/button";
import axios from "axios";
import {useState} from "react";

export default function UserEnrollment(){
    const [url, setUrl] = useState("");

    async function onSubmit() {
        try{
            const response = await axios.post('/api/esmt/users/enrollment/new', {id: 'cm4thvnjg0002bu3oiku55gx4'});
            console.log(response);
            setUrl(response.data)
        }catch(e){
            setUrl("one has been created already")
            console.log(e)
        }
    }

    async function getDetails() {
        try{
            const response = await axios.post('/api/users/enrollment/view', {id: 'cm5672hde000hbu0o2bs6aha5'});
            console.log(response);
            setUrl(response.data)
        }catch(e){
            setUrl("one has been created already")
            console.log(e)
        }
    }

    return(
        <>
            <Button onClick={onSubmit}>test</Button>
            <Button onClick={getDetails}>test 2</Button>
            <p>{url}</p>
        </>
    );
}