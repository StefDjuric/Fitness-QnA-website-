"use client";

import Button from "@/components/Button/Button";
import Link from "next/link";

function Questions() {
    return (
        <div className="max-container padding-container w-full h-screen mt-5 flex flex-col gap-5">
            <div className="flex flex-col gap-5">
                <div className="flexBetween">
                    <h1 className="bold-20">Newest Questions</h1>
                    <Link href={"/questions/ask"}>
                        <Button
                            label="Ask a question"
                            type="button"
                            styling="px-2 py-1 lg:px-4 lg:py-2 border-2 border-green-90 text-green-90 rounded-xl hover:text-white hover:bg-green-90"
                        />
                    </Link>
                </div>
                <div className="flex flex-col">
                    <h4>Number of questions:</h4>
                    <div className="border-2 border-green-90 flex flex-col lg:flex-row lg:flexBetween rounded-lg">
                        <Button
                            type="button"
                            label="Newest"
                            styling="btn-white-text hover:bg-gray-10 text-nowrap"
                        />
                        <Button
                            type="button"
                            label="Most upvoted"
                            styling="btn-white-text hover:bg-gray-10 text-nowrap"
                        />
                        <Button
                            type="button"
                            label="Most activity"
                            styling="btn-white-text hover:bg-gray-10 text-nowrap"
                        />
                    </div>
                </div>
                // TODO: QUESTIONS LIST
            </div>
        </div>
    );
}

export default Questions;
