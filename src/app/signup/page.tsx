"use client";

import React, { FormEvent, ReactElement, useState } from "react";
import Link from "next/link";
import GoogleImage from "../../../public/google.svg";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useAuth } from "@/components/Providers/AuthContextProvider";

function Signup(): ReactElement {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const { setIsLoggedIn } = useAuth();

    const [user, setUser] = useState<{ [key: string]: string }>({
        email: "",
        password: "",
        username: "",
    });

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const result = await signIn("google", {
                callbackUrl: "/dashboard",
                redirect: true,
            });

            setIsLoggedIn(true);
        } catch (error) {
            console.error("Failed to sign in with google.");
            setErrors({ google: "Failed to sign in with google" });
        } finally {
            setIsLoading(false);
        }
    };

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const onSignup = async (event: FormEvent): Promise<void> => {
        event.preventDefault();

        // Stops if validation fails
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);

        try {
            const response = await axios.post("/api/users/signup", user);

            console.log("Signed up successfully! ", response.data);

            router.push("/verify-email");
        } catch (error: any) {
            if (error.response?.data?.error === "email")
                setErrors({ email: error.response.data.message });
            else if (error.response?.data?.error === "username")
                setErrors({ username: error.response.data.message });
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!user.email) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(user.email)) {
            newErrors.email = "Invalid email adress.";
        }

        if (!user.username) {
            newErrors.username = "Username is required.";
        } else if (user.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters long.";
        }

        if (!user.password) {
            newErrors.password = "Password is required.";
        } else if (user.password.length < 6)
            newErrors.password =
                "Password should be at least 6 characters long.";

        setErrors(newErrors);

        // Returns true if no errors
        return Object.keys(newErrors).length === 0;
    };

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
                        label={
                            isLoading ? "Signing in..." : "Sign in with Google"
                        }
                        type={"button"}
                        icon={GoogleImage}
                        styling={
                            "w-full border-solid border-2 py-4 px-8 border-green-90 bg-white gap-4 hover:text-white hover:bg-green-90"
                        }
                        onClick={handleGoogleSignIn}
                    />
                    {errors.google && (
                        <span style={{ color: "red" }}>{errors.google}</span>
                    )}
                </div>
                <div className="flexCenter gap-2">
                    <div className="w-[45%] h-0.5 bg-gray-200"></div>
                    <p className="text-gray-400">OR</p>
                    <div className="w-[45%] h-0.5 bg-gray-200"></div>
                </div>
                <form onSubmit={onSignup} className="flex flex-col" noValidate>
                    <div className="flex flex-col gap-4 mb-5">
                        <label className="regular-18" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={user.email}
                            onChange={(event) =>
                                setUser({ ...user, email: event.target.value })
                            }
                            className="rounded-lg border-2 border-green-90 px-2 py-1"
                        />
                        {errors.email && (
                            <span style={{ color: "red" }}>{errors.email}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-4 mb-5">
                        <label className="regular-18" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={user.username}
                            onChange={(event) =>
                                setUser({
                                    ...user,
                                    username: event.target.value,
                                })
                            }
                            className="rounded-lg border-2 border-green-90 px-2 py-1"
                        />
                        {errors.username && (
                            <span style={{ color: "red" }}>
                                {errors.username}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-4 mb-10">
                        <label className="regular-18" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={user.password}
                            onChange={(event) =>
                                setUser({
                                    ...user,
                                    password: event.target.value,
                                })
                            }
                            className="rounded-lg border-2 border-green-90 px-2 py-1"
                        />
                        {errors.password && (
                            <span style={{ color: "red" }}>
                                {errors.password}
                            </span>
                        )}
                    </div>
                    <Button
                        label={isLoading ? "Signing up..." : "Sign up"}
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
