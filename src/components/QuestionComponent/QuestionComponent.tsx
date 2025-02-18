"use client";

import Button from "../Button/Button";
import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Question {
    _id: string;
    title: string;
    content: string;
    upvotes: string;
    answers: Array<any>;
    owner: {
        _id: string;
        username?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

type AnswersProp = {
    questionID: string;
};

function QuestionComponent({ questionID }: AnswersProp) {
    const [question, setQuestion] = useState<Question>();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        textValue: "",
        questionID: questionID,
    });

    const router = useRouter();

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.textValue) {
            newErrors.textValue = "Answer text is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleAnswerSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await axios.post(
                "/api/users/answer/create",
                formData
            );

            router.push(`/questions/${questionID}`);
            setFormData({ ...formData, textValue: "" });
        } catch (error: any) {
            if (error.response?.data?.error === "textValue")
                setErrors({ textValue: error.response.data.message });
            else if (error.response?.data?.error === "user")
                setErrors({ user: error.response.data.message });
            else if (error.response?.data?.error === "question")
                setErrors({ question: error.response.data.message });
        }
    };

    return (
        <>
            <h1 className="bold-20">Title {questionID}</h1>
            <div className="flex gap-10">
                <div className="flex flex-col text-center gap-2">
                    <button className="border-2 border-green-90 rounded-full p-2">
                        <Image
                            src="/chevron-up.svg"
                            alt="chevron up"
                            width={40}
                            height={40}
                        ></Image>
                    </button>

                    <p className="regular-32">0</p>
                    <button className="border-2 border-green-90 rounded-full p-2">
                        <Image
                            src="/chevron-down.svg"
                            alt="chevron down"
                            width={40}
                            height={40}
                        ></Image>
                    </button>
                </div>

                <div className="flex flex-col justify-between">
                    <p className="regular-20">content</p>
                    <p className="regular-12 text-gray-30">
                        Posted by: username
                    </p>
                </div>
            </div>

            <div className="w-full h-0.5 bg-gray-200"></div>

            <h4 className="regular-18">number of answers:</h4>
            <div className="flex flex-col gap-3">
                <h5 className="regular-18">Your answer</h5>
                <form
                    onSubmit={handleAnswerSubmit}
                    noValidate
                    className="flex flex-col gap-3 items-center mb-5"
                >
                    <textarea
                        name="answer"
                        id="answer"
                        value={formData.textValue}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                textValue: event.target.value,
                            })
                        }
                        rows={7}
                        className="block p-2.5 w-full rounded-lg border border-green-90 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                    {errors.textValue && (
                        <span className="text-red-500 regular-12">
                            {errors.textValue}
                        </span>
                    )}
                    {errors.user && (
                        <span className="text-red-500 regular-12">
                            {errors.user}
                        </span>
                    )}
                    {errors.question && (
                        <span className="text-red-500 regular-12">
                            {errors.question}
                        </span>
                    )}
                    <Button
                        type="submit"
                        label="Post your answer"
                        styling="btn-dark-green w-[50%] "
                    />
                </form>

                <div className="w-full h-0.5 bg-gray-200"></div>
            </div>
        </>
    );
}

export default QuestionComponent;
