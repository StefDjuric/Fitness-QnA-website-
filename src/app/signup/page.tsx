import React from "react";
import Link from "next/link";
import GoogleImage from "../../../public/google.svg";
import Button from "@/components/Button/Button";

function Signup() {
    return (
        <div className="max-container w-full padding-container flexCenter h-screen my-40 lg:my-24">
            <div className="flex flex-col min-w-[300px] lg:min-w-[400px] gap-8 shadow-2xl rounded-lg p-12">
                <div className="flex flex-col lg:justify-center gap-4 bold-32 mb-4">
                    <Link href="/">
                        <span className=" text-green-900">Be</span>Lean.
                    </Link>
                    <h1 className="bold-32 text-nowrap">Join us right now</h1>
                </div>
                <div className="flexCenter">
                    <Button
                        label={"Sign up with Google"}
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
                <form action="" className="flex flex-col">
                    <div className="flex flex-col gap-4 mb-5">
                        <label className="regular-18" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id=""
                            className="rounded-lg border-2 border-green-90 px-2 py-1"
                        />
                    </div>
                    <div className="flex flex-col gap-4 mb-5">
                        <label className="regular-18" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id=""
                            className="rounded-lg border-2 border-green-90 px-2 py-1"
                        />
                    </div>
                    <div className="flex flex-col gap-4 mb-10">
                        <label className="regular-18" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id=""
                            className="rounded-lg border-2 border-green-90 px-2 py-1"
                        />
                    </div>
                    <Button
                        label={"Sign up"}
                        type={"submit"}
                        styling="btn-dark-green mb-8"
                    />
                </form>
                <p className="regular-16">
                    Already have an account?{" "}
                    <span className="text-blue-600">
                        <Link href={"/login"}>Log in.</Link>
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Signup;
