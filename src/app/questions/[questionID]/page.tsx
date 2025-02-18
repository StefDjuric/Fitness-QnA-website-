import QuestionComponent from "@/components/QuestionComponent/QuestionComponent";

export default async function QuestionPage({ params }: any) {
    const awaitedParams = await params;

    return (
        <div className="padding-container max-container min-h-screen w-full mt-5 flex flex-col gap-8">
            <QuestionComponent questionID={awaitedParams.questionID} />
        </div>
    );
}
