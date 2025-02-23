import React from "react";
import Image from "next/image";

function About() {
    return (
        <div className="padding-container max-container w-full min-h-screen flex flex-col mb-10">
            <h1 className="bold-32 text-center mb-5">About me</h1>
            <div className="flexCenter gap-10">
                <div className="flex flex-col gap-5 p-8 shadow-2xl">
                    <Image
                        src={"/stefo.jpg"}
                        alt="Stefan Djuric"
                        width={300}
                        height={600}
                    ></Image>
                    <div className="flex flex-col gap-3">
                        <p className="bold-32">Stefan Đurić</p>
                        <p className="regular-18 text-gray-30">Student</p>
                        <p className="regular-18">Creator</p>
                        <p className="regular-18">
                            Contact me at:{" "}
                            <a href="mailto:stephdjury@gmail.com">
                                stephdjury@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <div className="flexCenter ">
                <div className="flex flex-col max-w-[300px] text-center gap-2">
                    <h2 className="bold-20 my-4">How did this come about?</h2>
                    <p className="regular-12">
                        This website was made because i am a student on a path
                        of improving my skills, so i decided to build a project
                        that would test myself, which this definitely did.
                        <br />
                    </p>

                    <p className="regular-12">
                        I ended up making a Q&A site for fitness related
                        questions that worked on upvote and downvote system.
                        This site was built using
                        Typescript/NextJS/MongoDB/TailwindCSS
                        <br />
                    </p>
                    <p className="regular-12 my-2">
                        On this website you can ask a question, answer other
                        people questions and upvote or downvote people's answers
                        and questions.
                        <br />
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;
