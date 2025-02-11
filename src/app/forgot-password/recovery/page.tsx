"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";

function page() {
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        password: "",
        repeatPassword: "",
        token: window.location.href.split("?token=")[1],
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.password) newErrors.password = "Password is required.";
        else if (formData.password.length < 6)
            newErrors.password = "Password should be 6 characters or longer.";
        else if (formData.password !== formData.repeatPassword)
            newErrors.repeatPassword = "Passwords must match.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent): Promise<void> => {
        event.preventDefault();

        setErrors({});

        if (!validateForm()) return;

        try {
            const response = await axios.post(
                "/api/users/forgot-password/recovery",
                formData
            );

            console.log("Password changed successfully. ", response.data);

            router.push("/login");
        } catch (error: any) {
            const newErrors: { [key: string]: string } = {};
            if (error.response?.data?.error === "password")
                newErrors.password = error.response.data.message;
            else if (error.response?.data?.error === "user")
                newErrors.user = error.response.data.message;

            setErrors(newErrors);
        }
    };

    return (
        <div className="max-container padding-container flexCenter w-full h-screen">
            <div className="flex flex-col w-[400px] lg:w-[500px] justify-center  items-center shadow-xl p-12">
                <form
                    noValidate
                    className="flex flex-col gap-6"
                    onSubmit={handleSubmit}
                >
                    <h1 className="regular-24 mb-6">Account recovery</h1>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="bold-18">
                            New password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="rounded-lg border-2 border-green-90 px-2 py-1"
                            value={formData.password}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    password: event.target.value,
                                })
                            }
                        />
                        {errors.password && (
                            <span style={{ color: "red" }}>
                                {errors.password}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="bold-18">
                            Repeat the password
                        </label>
                        <input
                            type="password"
                            name="repeatPassword"
                            id="repeatPassword"
                            className="rounded-lg border-2 border-green-90 px-2 py-1"
                            value={formData.repeatPassword}
                            onChange={(event) => {
                                setFormData({
                                    ...formData,
                                    repeatPassword: event.target.value,
                                });
                            }}
                        />
                    </div>
                    {errors.repeatPassword && (
                        <span style={{ color: "red" }}>
                            {errors.repeatPassword}
                        </span>
                    )}

                    <Button
                        type={"submit"}
                        label={"Recover account"}
                        styling={"btn-dark-green"}
                    />
                    {errors.user && (
                        <span style={{ color: "red" }}>{errors.user}</span>
                    )}
                </form>
            </div>
        </div>
    );
}

export default page;
