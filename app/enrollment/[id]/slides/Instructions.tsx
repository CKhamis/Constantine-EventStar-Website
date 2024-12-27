export default function Instructions(){
    return (
        <>
            <p className="text-4xl font-bold mb-2">How to Enroll</p>
            <p>You have been sent a personalized link that will soon associate yourself with a sign in provider like Google, GitHub, and others.</p>
            <div className="flex flex-col gap-5 mt-5">
                <div className="flex flex-row justify-start gap-5">
                    <p className="text-3xl font-bold">1.</p>
                    <div>
                        <p className="font-bold text-xl">Verify your user account</p>
                        <p>On the next screen, check to see if the person listed is you. If it isn&#39;t contact the host. Otherwise, select next</p>
                    </div>
                </div>
                <div className="flex flex-row justify-start gap-5">
                    <p className="text-3xl font-bold">2.</p>
                    <div>
                        <p className="font-bold text-xl">Enter your email</p>
                        <p>The only information required afterwards is your email. If the email you enter matches the email of the sign in provider, your login will be linked and you finished setting up your account!</p>
                    </div>
                </div>
                <div className="flex flex-row justify-start gap-5">
                    <p className="text-3xl font-bold">3.</p>
                    <div>
                        <p className="font-bold text-xl">Start!</p>
                        <p>Once you have finished with the initial log in, you will no longer see this tutorial ;(</p>
                    </div>
                </div>
            </div>
        </>
    );
}