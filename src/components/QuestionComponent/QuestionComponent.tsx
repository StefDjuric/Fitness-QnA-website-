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
    questionAnswerOn?: {
        _id: string;
    };
    userVoteType: number;
    createdAt?: string;
    updatedAt?: string;
}

type AnswersProp = {
    questionID: string;
};

function QuestionComponent({ questionID }: AnswersProp) {
    const [question, setQuestion] = useState<Question>();
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        textValue: "",
        questionID: questionID,
    });
    const [success, setSuccess] = useState<boolean>(false);
    const [userVote, setUserVote] = useState<number>(0);
    const [userAnswerVotes, setUserAnswerVotes] = useState<{
        [key: string]: number;
    }>({});

    useEffect(() => {
        async function getAnswers() {
            try {
                const response = await axios.get(
                    `/api/users/answer/get-answers?questionID=${questionID}`
                );
                setAnswers(response.data.answers);

                const voteMap: { [key: string]: number } =
                    response.data.answers.forEach((answer: Answer) => {
                        voteMap[answer._id] = answer.userVoteType || 0;
                    });

                setUserAnswerVotes(voteMap);
            } catch (error: any) {
                setErrors({
                    server: "Unable to get the answers for this question!",
                });
            }
        }

        getAnswers();
    }, [questionID]);

    useEffect(() => {
        async function getQuestionById() {
            try {
                const response = await axios.get(
                    `/api/users/questions/get-question?questionID=${questionID}`
                );

                setQuestion(response.data.question);
                if (response.data.userVoteType !== undefined)
                    setUserVote(response.data.userVoteType);
            } catch (error: any) {
                setErrors({ question: error.response?.data?.message });
            }
        }

        getQuestionById();
    }, []);

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

            location.reload();

            setSuccess(true);

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

    const handleQuestionUpvote = async () => {
        try {
            const response = await axios.post("/api/users/upvote", {
                questionID: questionID,
            });

            setQuestion((prevQuestion) => {
                if (!prevQuestion) return prevQuestion;
                return {
                    ...prevQuestion,
                    upvotes: response.data?.updatedUpvotes,
                };
            });

            setUserVote(response.data.userVoteType);
        } catch (error: any) {
            setErrors({
                upvote:
                    error.response?.data?.message ||
                    "Failed to upvote the question.",
            });
        }
    };

    const handleQuestionDownvote = async () => {
        try {
            const response = await axios.post("/api/users/downvote", {
                questionID: questionID,
            });

            setQuestion((prevQuestion) => {
                if (!prevQuestion) return;
                return {
                    ...prevQuestion,
                    upvotes: response.data?.updatedUpvotes,
                };
            });

            setUserVote(response.data?.userVoteType);
        } catch (error: any) {
            setErrors({
                downvote:
                    error.response?.data?.message ||
                    "Failed to downvote the question.",
            });
        }
    };

    const handleAnswerUpvote = async (answerID: string) => {
        try {
            const response = await axios.post(
                "/api/users/upvote/upvote-answer",
                {
                    answerID: answerID,
                }
            );

            setAnswers((prevAnswers) =>
                prevAnswers.map((answer) =>
                    answer._id === answerID
                        ? { ...answer, upvotes: response.data?.updatedUpvotes }
                        : answer
                )
            );

            setUserAnswerVotes((prev) => ({
                ...prev,
                [answerID]: response.data?.userAnswerVoteType,
            }));
        } catch (error: any) {
            setErrors({ question: error.response?.data?.message });
        }
    };

    const handleAnswerDownvote = async (answerID: string) => {
        try {
            const response = await axios.post(
                "/api/users/downvote/downvote-answer",
                {
                    answerID: answerID,
                }
            );

            setAnswers((prevAnswers) =>
                prevAnswers.map((answer) =>
                    answer._id === answerID
                        ? { ...answer, upvotes: response.data?.updatedUpvotes }
                        : answer
                )
            );

            setUserAnswerVotes((prev) => ({
                ...prev,
                [answerID]: response.data?.userAnswerVoteType,
            }));
        } catch (error: any) {
            setErrors({ question: error?.response?.data?.message });
        }
    };
    return (
        <>
            <h1 className="bold-20">{question?.title}</h1>
            <div className="flex gap-10">
                <div className="flex flex-col text-center gap-2">
                    <button
                        onClick={handleQuestionUpvote}
                        className={`border-2 ${
                            userVote === 1 ? "bg-green-90" : ""
                        } border-green-90 rounded-full p-2 min-w-[35px] min-h-[35px]`}
                    >
                        <Image
                            src="/chevron-up.svg"
                            alt="chevron up"
                            width={30}
                            height={30}
                        ></Image>
                    </button>

                    <p className="regular-20 md:regular-32">
                        {question?.upvotes}
                    </p>
                    <button
                        onClick={handleQuestionDownvote}
                        className={`border-2 ${
                            userVote === -1 ? "bg-green-90" : ""
                        } border-green-90 rounded-full p-2 min-w-[35px] min-h-[35px]`}
                    >
                        <Image
                            src="/chevron-down.svg"
                            alt="chevron down"
                            width={30}
                            height={30}
                        ></Image>
                    </button>
                </div>

                <div className="flex flex-col justify-between">
                    <p className="regular-12 md:regular-18">
                        {question?.content}
                    </p>
                    <p className="regular-12 text-gray-30">
                        {question?.owner.username}
                    </p>
                </div>
            </div>

            <div className="w-full h-0.5 bg-gray-200"></div>

            <h4 className="regular-18">
                number of answers: {question?.answers.length}
            </h4>
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
                    {errors.question ||
                        (errors.server && (
                            <span className="text-red-500 regular-12">
                                {errors.question}
                            </span>
                        ))}
                    <Button
                        type="submit"
                        label="Post your answer"
                        styling="btn-dark-green w-[50%] "
                    />
                    {success && (
                        <span className="text-green-500">
                            Successfully posted a question
                        </span>
                    )}
                </form>

                <div className="w-full h-0.5 bg-gray-200"></div>

                {/* User answers */}
                {answers.length > 0 ? (
                    answers.map((answer) => (
                        <div key={answer._id} className="flex flex-col gap-2">
                            <div className="flex gap-10">
                                <div className="flex flex-col text-center ">
                                    <button
                                        onClick={() =>
                                            handleAnswerUpvote(answer._id)
                                        }
                                        className={`border-2 border-green-90 ${
                                            userAnswerVotes[answer._id] === 1
                                                ? "bg-green-90"
                                                : ""
                                        } rounded-full p-2 min -w-[35px] min-h-[35px]`}
                                    >
                                        <Image
                                            src="/chevron-up.svg"
                                            alt="chevron up"
                                            width={30}
                                            height={30}
                                        ></Image>
                                    </button>

                                    <p className="regular-20 md:regular-32">
                                        {answer?.upvotes}
                                    </p>
                                    <button
                                        onClick={() =>
                                            handleAnswerDownvote(answer._id)
                                        }
                                        className={`border-2 border-green-90 ${
                                            userAnswerVotes[answer._id] === -1
                                                ? "bg-green-90"
                                                : ""
                                        } rounded-full p-2 min -w-[35px] min-h-[35px]`}
                                    >
                                        <Image
                                            src="/chevron-down.svg"
                                            alt="chevron down"
                                            width={30}
                                            height={30}
                                        ></Image>
                                    </button>
                                </div>

                                <div className="flex flex-col justify-between">
                                    <p className="regular-12 md:regular-18">
                                        {answer?.content}
                                    </p>
                                    <p className="regular-12 text-gray-30">
                                        {answer?.owner.username}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-0.5 bg-gray-200"></div>
                        </div>
                    ))
                ) : (
                    <div className="bg-gray-200 flexCenter">
                        <p className="regular-18">No answers found!</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default QuestionComponent;
