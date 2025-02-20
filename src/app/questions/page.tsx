"use client";

import Button from "@/components/Button/Button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

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

interface PaginationData {
    totalPages: number;
    total: number;
    page: number;
    skip: number;
}

function Questions() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>("Newest");

    const searchParams = useSearchParams();
    const router = useRouter();

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    useEffect(() => {
        async function fetchQuestions() {
            try {
                setLoading(true);
                const response = await axios.get(
                    `/api/users/questions?page=${page}&limit=${limit}&sortBy=${sortBy}`
                );
                setQuestions(response.data.questions);
                setPagination(response.data.pagination);
                setError("");
            } catch (error: any) {
                setError(
                    "Failed to load questions...\n" +
                        error.response?.data?.error || error.message
                );
            } finally {
                setLoading(false);
            }
        }

        fetchQuestions();
    }, [page, limit, sortBy]);

    const changePage = (newPage: number) => {
        if (newPage < 1 || (pagination && newPage > pagination.totalPages))
            return;

        router.push(
            `/questions?page=${newPage}&limit=${limit}&sortBy=${sortBy}`
        );
    };

    const handleSortChange = (newSort: string) => {
        setSortBy(newSort);

        router.push(`/questions?page=${page}&limit=${limit}&sortBy=${newSort}`);
    };

    return (
        <div className="max-container padding-container w-full mt-5 flex flex-col gap-5 mb-40">
            <div className="flex flex-col gap-5">
                <div className="flexBetween">
                    <h1 className="bold-20">
                        {sortBy === "Newest" ? sortBy : `Most ${sortBy}`}{" "}
                        questions
                    </h1>
                    <Link href={"/questions/ask"}>
                        <Button
                            label="Ask a question"
                            type="button"
                            styling="px-2 py-1 lg:px-4 lg:py-2 border-2 border-green-90 text-green-90 rounded-xl hover:text-white hover:bg-green-90"
                        />
                    </Link>
                </div>
                <div className="flex flex-col">
                    <h4>
                        {loading
                            ? "Loading questions..."
                            : `Number of questions: ${pagination?.total || 0}`}
                    </h4>
                    <div className="border-2 border-green-90 flex flex-col lg:flex-row lg:flexBetween rounded-lg">
                        <Button
                            type="button"
                            label="Newest"
                            styling={`btn-white-text hover:bg-gray-10 text-nowrap ${
                                sortBy === "Newest" ? "bg-gray-10" : ""
                            }`}
                            onClick={() => handleSortChange("Newest")}
                        />
                        <Button
                            type="button"
                            label="Most upvoted"
                            styling={`btn-white-text hover:bg-gray-10 text-nowrap ${
                                sortBy === "upvotes" ? "bg-gray-10" : ""
                            } `}
                            onClick={() => handleSortChange("upvotes")}
                        />
                        <Button
                            type="button"
                            label="Most activity"
                            styling={`btn-white-text hover:bg-gray-10 text-nowrap ${
                                sortBy === "activity" ? "bg-gray-10" : ""
                            } `}
                            onClick={() => handleSortChange("activity")}
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="flexCenter h-64">
                        <p className="text-gray-30 regular-12">
                            Loading questions...
                        </p>
                    </div>
                ) : error ? (
                    <div className="flexCenter h-64">
                        <p className="regular-12 text-red-500">{error}</p>
                    </div>
                ) : questions.length === 0 ? (
                    <p className="text-center py-12 regular-12 text-gray-30">
                        No questions found. Be the first to ask a question!
                    </p>
                ) : (
                    <div className="flex flex-col gap-4 mb-8">
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
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flexCenter gap-2 mb-8">
                        <button
                            onClick={() => changePage(page - 1)}
                            disabled={page === 1}
                            className={`px-3 py-1 rounded-lg ${
                                page === 1
                                    ? "bg-gray-200 cursor-not-allowed"
                                    : "bg-green-90 text-white"
                            }`}
                        >
                            Previous
                        </button>
                        <div className="flex gap-1">
                            {[...Array(pagination.totalPages)].map(
                                (_, index) => {
                                    const pageNumber = index + 1;

                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === pagination.totalPages ||
                                        (pageNumber >= page - 2 &&
                                            pageNumber <= page + 2)
                                    ) {
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() =>
                                                    changePage(pageNumber)
                                                }
                                                className={`w-8 h-8 rounded-lg flexCenter ${
                                                    pageNumber === page
                                                        ? "bg-green-90 text-white"
                                                        : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    }

                                    if (
                                        (pageNumber === 2 && page > 4) ||
                                        (pageNumber ===
                                            pagination.totalPages - 1 &&
                                            page < pagination.totalPages - 3)
                                    ) {
                                        return (
                                            <span
                                                key={pageNumber}
                                                className="w-8 h-8 flex items-center justify-center"
                                            >
                                                ...
                                            </span>
                                        );
                                    }

                                    return null;
                                }
                            )}
                        </div>

                        <button
                            onClick={() => changePage(page + 1)}
                            disabled={page === pagination.totalPages}
                            className={`px-3 py-1 rounded ${
                                page === pagination.totalPages
                                    ? "bg-gray-200 cursor-not-allowed"
                                    : "bg-green-90 text-white"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Questions;
