"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "@/components/Button/Button";
import Link from "next/link";

function page() {
    return (
        <div className="max-container padding-container w-full h-screen mt-5">
            <div className="flexBetween ">
                <div className="flex flex-col gap-2">
                    <h1 className="bold-32">Welcome to BeLean.</h1>
                    <p className="regular-16 text-gray-30">
                        Find answers to your fitness and sports questions and
                        help others answer theirs.
                    </p>
                </div>
                <Link href={"/questions/ask"}>
                    <Button
                        label={"Ask a question"}
                        type={"button"}
                        styling={
                            "px-2 py-1 lg:px-4 lg:py-2 border-2 border-green-90 text-green-90 rounded-xl hover:text-white hover:bg-green-90"
                        }
                    />
                </Link>
            </div>
            <div className="flex flex-col gap-2 mt-20">
                <h1 className="bold-20">Check out some recent posts</h1>
                //TODO: QUESTIONS COMPONENT
            </div>
        </div>
    );
}

export default page;
