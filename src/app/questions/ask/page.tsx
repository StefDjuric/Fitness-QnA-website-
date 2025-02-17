"use client";

import Button from "@/components/Button/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function AskQuestion() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        title: "",
        description: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.title) {
            newErrors.title = "Title is required.";
        } else if (formData.title.length < 5) {
            newErrors.title = "Title must be at least five characters long.";
        } else if (!formData.description) {
            newErrors.description = "Problem description is required.";
        } else if (formData.description.length < 20) {
            newErrors.description =
                "Problem description should be minimum 20 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onQuestionSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await axios.post(
                "/api/users/questions/ask",
                formData
            );
            console.log(response);
            router.push("/questions");
        } catch (error: any) {
            console.error("Error submiting question.", error);
            if (error.response?.data?.error === "title")
                setErrors({ title: error.response.data.message });
            else if (error.response?.data?.error === "description")
                setErrors({ description: error.response.data.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-container padding-container w-full h-screen flex flex-col mb-40  md:mt-5 md:mb-0">
            <div className="flexCenter">
                <h1 className="regular-24 text-center">
                    Ask a question and get help from people on your topic
                </h1>
            </div>

            <form
                noValidate
                className="flex flex-col gap-5 mt-10"
                onSubmit={onQuestionSubmit}
            >
                <div className="flex flex-col">
                    <label htmlFor="title" className="bold-18">
                        Title
                    </label>
                    <p className="regular-12 text-gray-30">
                        Be specific and imagine you're asking a question to
                        another person.
                    </p>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className="rounded-lg border-2 border-green-90 px-2 py-1"
                        value={formData.title}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                title: event.target.value,
                            })
                        }
                    />
                    {errors.title && (
                        <span style={{ color: "red" }}>{errors.title}</span>
                    )}
                    {}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="description" className="bold-18">
                        Describe your problem
                    </label>
                    <p className="regular-12 text-gray-30">
                        Introduce the problem and expand on what you put in the
                        title. Minimum 20 characters.
                    </p>
                    <textarea
                        name="description"
                        id="description"
                        rows={10}
                        value={formData.description}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                description: event.target.value,
                            })
                        }
                        className="block p-2.5 w-full rounded-lg border border-green-90 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                    {errors.description && (
                        <span style={{ color: "red" }}>
                            {errors.description}
                        </span>
                    )}
                </div>
                <div className="flexCenter">
                    <Button
                        type={"submit"}
                        label={
                            isLoading
                                ? "Question being posted..."
                                : "Post the question"
                        }
                        styling={"btn-dark-green"}
                    />
                </div>
            </form>
        </div>
    );
}

export default AskQuestion;
