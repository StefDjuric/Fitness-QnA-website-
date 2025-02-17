"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "@/components/Button/Button";
import Link from "next/link";
import axios from "axios";

function Dashboard() {
    interface Question {
        _id: string;
        title: string;
        content: string;
        upvotes: number;
        answers: Array<any>;
        owner: {
            _id: string;
            username?: string;
        };
        createdAt?: string;
        updatedAt?: string;
    }
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        async function getQuestionData() {
            try {
                const response = await axios.get("/api/users/dashboard");
                setQuestions(response.data.arr);
            } catch (error: any) {
                console.error(
                    "Error while trying to get question data. ",
                    error
                );
            }
        }

        getQuestionData();
    }, []);
    return (
        <div className="max-container padding-container w-full mt-5 mb-80 ">
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
                <div className="flex flex-col rounded-lg p-6 max-w-[500px]  gap-2 md:max-w-[1440px]  max-h-[600px]">
                    {questions.map((question) => (
                        <Link
                            href={`/questions/${question._id}`}
                            key={question._id}
                        >
                            <div className="border-2 border-green-90 rounded-lg p-6 hover:shadow-2xl transition-shadow">
                                <h2 className="bold-20 text-blue-500 mb-2 line-clamp-2">
                                    {question.title}
                                </h2>

                                <p className="text-gray-700 mb-4 line-clamp-2">
                                    {question.content}
                                </p>
                                <div className="flexBetween text-sm">
                                    <p className="text-gray-500">
                                        Posted by:{" "}
                                        {question.owner?.username ||
                                            "Anonymous"}
                                    </p>
                                    <div className="flex gap-4">
                                        <p>{question.upvotes} upvotes</p>
                                        <p>
                                            {question.answers?.length || 0}{" "}
                                            answers
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
