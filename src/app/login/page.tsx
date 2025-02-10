"use client";

import Link from "next/link";
import GoogleImage from "../../../public/google.svg";
import Button from "@/components/Button/Button";
import { FormEvent, ReactElement, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Span } from "next/dist/trace";

function LoginPage(): ReactElement {
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        emailOrUsername: "",
        password: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.emailOrUsername)
            newErrors.emailOrUsername = "Email or username is required.";

        if (!formData.password) newErrors.password = "Password is required.";

        setErrors(newErrors);

        // Returns true if no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const result = await signIn("google", {
                callbackUrl: "/",
                redirect: true,
            });
        } catch (error) {
            console.error("Error signing in with Google:", error);
            setErrors({
                google: "Failed to sign in with Google. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onLogin = async (event: FormEvent): Promise<void> => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await axios.post("/api/users/login", formData);
            console.log("Signed up successfully!");

            router.push("/");
        } catch (error: any) {
            if (error.response?.data?.error === "emailOrUsername")
                setErrors({ emailOrUsername: error.response.data.message });
            else if (error.response?.data?.error === "password")
                setErrors({ password: error.response.data.message });
        } finally {
            setIsLoading(false);
        }
    };

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
                        label={
                            isLoading ? "Loging in..." : "Log in with Google"
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
                <form onSubmit={onLogin} className="flex flex-col" noValidate>
                    <div className="flex flex-col gap-4 mb-5">
                        <label htmlFor="email" className="regular-18">
                            Email or Username
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.emailOrUsername}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    emailOrUsername: event.target.value,
                                })
                            }
                            className="rounded-lg px-2 py-1 border-green-90 border-2"
                        />
                        {errors.emailOrUsername && (
                            <span style={{ color: "red" }}>
                                {errors.emailOrUsername}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-4 mb-10">
                        <div className="flexBetween">
                            <label htmlFor="password" className="regular-18">
                                Password
                            </label>
                            <p className="regular-14 text-blue-600">
                                <Link href="/forgot-password">
                                    Forgot password?
                                </Link>
                            </p>
                        </div>

                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    password: event.target.value,
                                })
                            }
                            className="rounded-lg px-2 py-1 border-green-90 border-2"
                        />
                        {errors.password && (
                            <span style={{ color: "red" }}>
                                {errors.password}
                            </span>
                        )}
                    </div>
                    <Button
                        type="submit"
                        label={isLoading ? "Logging in..." : "Log in"}
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

export default LoginPage;
