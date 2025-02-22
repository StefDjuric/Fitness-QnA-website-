"use client";

import Button from "@/components/Button/Button";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

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
    userVoteType: number;
    createdAt?: string;
    updatedAt?: string;
}

interface Answer {
    _id: string;
    content: string;
    upvotes: number;
    owner: {
        _id: string;
        username?: string;
    };
    questionAnsweredOn: {
        _id: string;
        title: string;
    };
    userVoteType: number;
    createdAt?: string;
    updatedAt?: string;
}

function MyProfile() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [username, setUsername] = useState<string>("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        async function getUserAnswers() {
            try {
                setErrors({});
                const response = await axios.get(
                    "/api/users/profile/get-answers"
                );

                if (response.data.success) {
                    setAnswers(response.data.userAnswers);
                    setUsername(response.data.username);
                }
            } catch (error: any) {
                setErrors({ user: error.response?.data?.message });
            }
        }

        getUserAnswers();
    }, []);

    useEffect(() => {
        async function getUserQuestions() {
            try {
                setErrors({});
                const response = await axios.get(
                    "/api/users/profile/get-questions"
                );
                if (response.data.success) {
                    setQuestions(response.data.userQuestions);
                }
            } catch (error: any) {
                setErrors({ user: error.response?.data?.message });
            }
        }

        getUserQuestions();
    }, []);

    return (
        <div className="padding-container flex flex-col max-container gap-10 mt-10 min-w-full min-h-screen">
            <div className="flexBetween">
                <h1 className="bold-32">Hello {username}</h1>
                <Link href={"/my-profile/edit-profile"}>
                    <Button
                        type="button"
                        label="Edit profile"
                        styling="btn-dark-green"
                    />
                </Link>
            </div>
            <div className="flex flex-col w-full gap-6">
                <div className="flex flex-col gap-2">
                    <h4 className="regular-20">Your questions</h4>
                    <div className="border-2 border-green-90 rounded-lg shadow-2xl p-4 flexCenter">
                        <ul>
                            {questions.length > 0 ? (
                                questions.map((question) => (
                                    <li key={question._id} className="mb-2">
                                        <Link
                                            href={`/questions/${question._id}`}
                                        >
                                            <p className="regular-12 text-blue-500">
                                                Question title: {question.title}
                                            </p>
                                        </Link>
                                        <div className="w-full h-0.5 bg-gray-20"></div>
                                    </li>
                                ))
                            ) : (
                                <p className="regular-12 text-gray-30">
                                    You have not asked any questions.
                                </p>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h4 className="regular-20">Your answers</h4>
                    <div className="border-2 border-green-90 rounded-lg shadow-2xl w-full p-4 flexCenter">
                        <ul>
                            {answers.length > 0 ? (
                                answers.map((answer) => (
                                    <li key={answer._id} className="mb-2">
                                        <Link
                                            href={`/questions/${answer.questionAnsweredOn._id}`}
                                        >
                                            <p className="regular-12 text-blue-500">
                                                Question title:{" "}
                                                {
                                                    answer.questionAnsweredOn
                                                        .title
                                                }
                                                {"."} {"\nYour answer:"}{" "}
                                                {answer.content}
                                            </p>
                                        </Link>
                                        <div className="w-full h-0.5 bg-gray-20"></div>
                                    </li>
                                ))
                            ) : (
                                <p className="regular-12 text-gray-30">
                                    You have not answered any questions yet.
                                </p>
                            )}
                        </ul>
                    </div>
                </div>
                {errors.user && (
                    <span className="text-red-500 regular-12">
                        {errors.user}
                    </span>
                )}
            </div>
        </div>
    );
}

export default MyProfile;
