"use client";
import { FormEvent, useState } from "react";
import axios from "axios";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers/AuthContextProvider";

function EditProfile() {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const { isLoggedIn, setIsLoggedIn } = useAuth();

    const router = useRouter();

    const validateForm = (formDataType: string) => {
        const newErrors: { [key: string]: string } = {};

        if (formDataType === "USERNAME") {
            if (!formData.username) {
                newErrors.username =
                    "You have to fill in the field to change the username.";
            } else if (formData.username.length < 3) {
                newErrors.username =
                    "The username has to be at least 3 characters long.";
            }
        } else if (formDataType === "EMAIL") {
            if (!formData.email) {
                newErrors.email =
                    "Email field is required to change the email.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)) {
                newErrors.email = "Invalid email adress.";
            }
        } else if (formDataType === "PASSWORD") {
            if (!formData.password) {
                newErrors.password =
                    "Password field is required to change the password.";
            } else if (formData.password.length < 6) {
                newErrors.password =
                    "Password should be at least 6 characters long.";
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords have to match.";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateUsername = async (event: FormEvent) => {
        event.preventDefault();

        if (!validateForm("USERNAME")) return;

        try {
            const response = await axios.post(
                "/api/users/edit/edit-username",
                formData
            );
            if (response.data?.success) {
                setSuccess({ username: "Successfully updated username." });
            }
        } catch (error: any) {
            setErrors({ username: error?.response?.data?.message });
            setSuccess({});
        }
    };

    const handleUpdatePassword = async (event: FormEvent) => {
        event.preventDefault();

        if (!validateForm("PASSWORD")) return;

        try {
            const response = await axios.post(
                "/api/users/edit/edit-password",
                formData
            );

            if (response.data?.success) {
                setSuccess({ password: "Password updated successfully." });
            }
        } catch (error: any) {
            setErrors({ password: error.response?.data?.message });
            setSuccess({});
        }
    };

    const handleUpdateEmail = async (event: FormEvent) => {
        event.preventDefault();

        if (!validateForm("EMAIL")) return;

        try {
            const response = await axios.post(
                "/api/users/edit/edit-email",
                formData
            );

            if (response.data?.success) {
                setSuccess({ email: "Email updated successfully." });
                setIsLoggedIn(false);
                router.push("/");
            }
        } catch (error: any) {
            setErrors({ email: error.response?.data?.message });
            setSuccess({});
        }
    };

    const handleDeleteProfile = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.delete(
                "/api/users/edit/delete-profile"
            );

            if (response.data?.success) {
                setSuccess({ delete: "Successfully deleted your profile." });
                setIsLoggedIn(false);
                router.push("/");
            }
        } catch (error: any) {
            setErrors({ delete: error.response?.data?.message });
            setSuccess({});
        }
    };

    return (
        <div className="max-container padding-container w-full min-h-screen flex flex-col mt-10 gap-5">
            <h1 className="bold-32">Edit your profile</h1>

            <form noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="regular-18">
                        Change username
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                username: event.target.value,
                            })
                        }
                        className="rounded-lg border-2 border-green-90 px-2 py-1"
                    />
                    {success.username && (
                        <span className="text-green-500">
                            {success.username}
                        </span>
                    )}
                    {errors.username && (
                        <span className="text-red-500 regular-12">
                            {errors.username}
                        </span>
                    )}
                </div>
                <Button
                    type="submit"
                    label="Update username"
                    styling="btn-dark-green"
                    onClick={handleUpdateUsername}
                />
            </form>
            <div className="h-0.5 bg-gray-30"></div>
            <form noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="regular-18">
                        Change password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                password: event.target.value,
                            })
                        }
                        className="rounded-lg border-2 border-green-90 px-2 py-1"
                    />
                    {errors.password && (
                        <span className="text-red-500 regular-12">
                            {errors.password}
                        </span>
                    )}
                    <label htmlFor="confirmPassword" className="regular-18">
                        Confirm password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                confirmPassword: event.target.value,
                            })
                        }
                        className="rounded-lg border-2 border-green-90 px-2 py-1"
                    />
                    {errors.confirmPassword && (
                        <span className="text-red-500 regular-12">
                            {errors.confirmPassword}
                        </span>
                    )}
                    {success.password && (
                        <span className="text-green-500">
                            {success.password}
                        </span>
                    )}
                </div>
                <Button
                    type="submit"
                    label="Update password"
                    styling="btn-dark-green"
                    onClick={handleUpdatePassword}
                />
            </form>
            <div className="h-0.5 bg-gray-30"></div>

            <form noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="regular-18">
                            Change your Email
                        </label>
                        <p className="regular-12 text-gray-30">
                            We will send you an email to verify your email
                            address and you will be logged out.
                        </p>
                    </div>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                email: event.target.value,
                            })
                        }
                        className="rounded-lg border-2 border-green-90 px-2 py-1"
                    />
                    {errors.email && (
                        <span className="text-red-500 regular-12">
                            {errors.email}
                        </span>
                    )}
                </div>
                <Button
                    type="submit"
                    label="Update email"
                    styling="btn-dark-green"
                    onClick={handleUpdateEmail}
                />
                {success.email && (
                    <span className="text-green-500">{success.email}</span>
                )}
            </form>
            <div className="h-0.5 bg-gray-30"></div>
            <div className="flex flex-col gap-4">
                <h4 className="regular-18">Delete profile</h4>
                <p className="regular-12 text-gray-30">
                    Before confirming that you would like your profile deleted,
                    we'd like to take a moment to explain the implications of
                    deletion:
                </p>
                <ul>
                    <li className="regular-12 text-gray-30">
                        Deletion is irreversible, and you will have no way to
                        regain any of your original content, should this
                        deletion be carried out and you change your mind later
                        on.
                    </li>
                    <li className="regular-12 text-gray-30">
                        Your questions and answers will be deleted from the
                        site.
                    </li>
                </ul>
                <Button
                    type="button"
                    label="Delete profile"
                    styling="rounded-lg bg-red-500 px-8 py-3 text-white hover:bg-red-600"
                    onClick={handleDeleteProfile}
                />
            </div>
            {errors.username && (
                <span className="text-red-500 regular-12">
                    {errors.username}
                </span>
            )}
            {success.delete && (
                <span className="text-red-500 regular-12">
                    {success.delete}
                </span>
            )}
        </div>
    );
}

export default EditProfile;
