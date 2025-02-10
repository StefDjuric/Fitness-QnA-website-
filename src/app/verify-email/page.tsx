"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

function VerifyEmail() {
    const [token, setToken] = useState<string>("");
    const [error, setError] = useState<{ [key: string]: string }>({});
    const [verified, setVerified] = useState<Boolean>(false);

    const verifyUserEmail = async () => {
        try {
            await axios.post("/api/users/verify-email", { token });
            setVerified(true);
        } catch (error: any) {
            setError({
                message: "User verification failed.",
            });
        }
    };

    useEffect(() => {
        const urlToken = window.location.href.split("?token=")[1];
        setToken(urlToken || "");
    });

    useEffect(() => {
        if (token.length > 0) verifyUserEmail();
    }, [token]);

    return (
        <div className="max-container padding-container flexCenter h-screen w-full">
            <div className="min-w-[400px] lg:min-w-[500px] shadow-2xl flexCenter rounded-lg flex flex-col p-12">
                <Link href="/" className="bold-32  mb-10">
                    <span className=" text-green-900">Be</span>Lean.
                </Link>
                <div className="flex flex-col justify-center items-center regular-20">
                    {verified ? (
                        <>
                            <h2>Your account has been verified.</h2>
                            <p>Thank you for your patience.</p>
                            <Link href={"/login"}>
                                Go to
                                <span className="text-blue-600"> log in</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <h2>
                                We have sent you an email to verify your
                                account.
                            </h2>
                            <p>
                                Please click the link that you will find in the
                                mail we sent you.
                            </p>
                        </>
                    )}
                    {error.message && (
                        <span style={{ color: "red" }}>{error.message}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
