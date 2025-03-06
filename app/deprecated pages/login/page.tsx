// import TopBar from "@/components/TopBar";
import {Card, CardContent, CardTitle, CardDescription} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage(){
    return (
        <>
            <TopBar />
            <div className="mt-10 flex justify-center items-center">
                <Card className="w-full max-w-sm rounded-none top-left-gradient">
                    <CardContent className="grid gap-4">
                        <div className="flex flex-row gap-3 justify-start items-center pt-6 mb-4">
                            <Image
                                src={`/icons/COW Logo.svg`}
                                alt={`Costi Online Logo`}
                                width={45}
                                height={45}
                                className="hover-minimize"
                            />
                            <div className="m-0">
                                <CardTitle className="text-2xl">Sign In</CardTitle>
                                <CardDescription>Enter your Costi Online Credentials.</CardDescription>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="ml-auto inline-block text-sm underline">
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input id="password" type="password" required/>
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            <Button variant="outline" className="w-full">
                                Login with Google
                            </Button>
                            <Button variant="outline" className="w-full">
                                Login with GitHub
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="#" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}