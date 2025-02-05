"use client";

import Link from "next/link";
import GoogleImage from "../../../public/google.svg";
import Button from "@/components/Button/Button";

function page() {
    return (
        <div className="max-container padding-container flexCenter h-screen w-full my-32 lg:my-24">
            <div className="flex flex-col min-w-[300px] lg:min-w-[400px] gap-8 shadow-2xl rounded-lg p-12">
                <div className="flexCenter">
                    <Link href="/">
                        <h1 className="bold-32 text-nowrap mb-8">
                            <span className=" text-green-900">Be</span>Lean.
                        </h1>
                    </Link>
                </div>
                <div className="flexCenter">
                    <Button
                        label={"Log in with Google"}
                        type={"button"}
                        icon={GoogleImage}
                        styling={
                            "w-full border-solid border-2 py-4 px-8 border-green-90 bg-white gap-4 hover:text-white hover:bg-green-90"
                        }
                    />
                </div>
                <div className="flexCenter gap-2">
                    <div className="w-[45%] h-0.5 bg-gray-200"></div>
                    <p className="text-gray-400">OR</p>
                    <div className="w-[45%] h-0.5 bg-gray-200"></div>
                </div>
                <form className="flex flex-col" noValidate>
                    <div className="flex flex-col gap-4 mb-5">
                        <label htmlFor="email" className="regular-18">
                            Email or Username
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="rounded-lg px-2 py-1 border-green-90 border-2"
                        />
                    </div>
                    <div className="flex flex-col gap-4 mb-10">
                        <div className="flexBetween">
                            <label htmlFor="password" className="regular-18">
                                Password
                            </label>
                            <p className="regular-14 text-blue-600">
                                <Link href="#">Forgot password?</Link>
                            </p>
                        </div>

                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="rounded-lg px-2 py-1 border-green-90 border-2"
                        />
                    </div>
                    <Button
                        type="submit"
                        label="Log in"
                        styling="btn-dark-green mb-8"
                    />
                </form>
                <p className="regular-16">
                    Don't have an account?{" "}
                    <span className="text-blue-600">
                        <Link href="/signup">Sign up.</Link>
                    </span>
                </p>
            </div>
        </div>
    );
}

export default page;
