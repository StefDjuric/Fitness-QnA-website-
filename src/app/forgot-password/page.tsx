"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import Button from "@/components/Button/Button";

function page() {
    const [mailSent, setMailSent] = useState<boolean>(false);
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        email: "",
    });
    const [error, setError] = useState<{ [key: string]: string }>({});

    const validateForm = (): boolean => {
        if (!formData.email) {
            setError({ email: "Email is required." });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)) {
            setError({ email: "Invalid Email address." });
        }

        return Object.keys(error).length === 0;
    };

    const onSendRecoveryMail = async (event: FormEvent): Promise<void> => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post(
                "/api/users/forgot-password",
                formData
            );

            console.log("Mail sent successfully.", response.data);

            setMailSent(true);
        } catch (error: any) {
            if (error.response?.data?.error === "email")
                setError({ email: error.response.data.message });
        }
    };

    return (
        <div className="max-container padding-container flexCenter w-full h-screen">
            <div className="flex flex-col w-[400px] lg:w-[500px] items-center justify-center shadow-2xl rounded-lg p-12">
                {mailSent ? (
                    <div className="flex flex-col justify-center items-center mb-5 gap-5">
                        <h2 className="regular-24">
                            Account recovery mail sent to {formData.email}
                        </h2>
                        <p className="regular-18">
                            If you don't see this email in your inbox within 15
                            minutes, look for it in your junk mail folder. If
                            you find it there, please mark it as “Not Junk”
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col justify-center items-center mb-5">
                            <p className="regular-18">
                                Forgot your accounts password? Enter your email
                                address and we'll send you a recovery code.
                            </p>
                        </div>
                        <form
                            onSubmit={onSendRecoveryMail}
                            className="flex flex-col bold-18 gap-2 items-start justify-start w-full"
                            noValidate
                        >
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="rounded-lg px-2 py-1 border-2 border-green-90 regular-18 w-full mb-5"
                                value={formData.email}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        email: event.target.value,
                                    })
                                }
                            />
                            {error.email && (
                                <span style={{ color: "red" }}>
                                    {error.email}
                                </span>
                            )}
                            <Button
                                type={"submit"}
                                label={"Send recovery email"}
                                styling="btn-dark-green w-full"
                            />
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default page;
