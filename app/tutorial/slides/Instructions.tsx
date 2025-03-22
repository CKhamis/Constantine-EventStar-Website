export default function Instructions(){
    return (
        <div className="p-5">
            <p className="text-4xl font-bold mb-2">How to Get Invites</p>
            <p>If you are creating an account to see an event, you are almost there! Please see the steps below to learn more about how invites work.</p>
            <div className="flex flex-col gap-8 mt-5">
                <div className="flex flex-row justify-start gap-5">
                    <p className="text-3xl font-bold">1.</p>
                    <div>
                        <p className="font-bold text-xl">Create Account</p>
                        <p>You will be asked to fill in various account details on the next screen.</p>
                    </div>
                </div>
                <div className="flex flex-row justify-start gap-5">
                    <p className="text-3xl font-bold">2.</p>
                    <div>
                        <p className="font-bold text-xl">Follow Event Planner</p>
                        <p>You will be asked to enter the email of the person who is inviting you. Once verified, you will see all events they invite you to. After account setup, you are still able to follow users in the profile page.</p>
                    </div>
                </div>
                <div className="flex flex-row justify-start gap-5">
                    <p className="text-3xl font-bold">3.</p>
                    <div>
                        <p className="font-bold text-xl">Start!</p>
                        <p>Once you have finished with setup, you can start using EventStar!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}