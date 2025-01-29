"use client";

import Button from "@/components/Button/Button";
import poseImage from "../../public/pose.jpg";
import helpImage from "../../public/help.jpg";
import Image from "next/image";

export default function Home() {
    return (
        <>
            <section className="max-container padding-container p-4 h-fit lg:h-screen">
                <Image
                    src={poseImage}
                    alt="Girl doing a handstand with the horizon behind her"
                    className="absolute inset-0 object-center z-0"
                ></Image>

                <h1 className="relative bold-20 md:bold-32 lg:bold-52 xl:bold-64 text-white top-[2%] text-center">
                    Join others in pursuing your{" "}
                    <span className="text-green-90 bold-32 md:bold-40 lg:bold-64 ">
                        dream body
                    </span>
                </h1>

                <div className="relative h-[200px] flexCenter w-[50%] flex-col gap-4 right-[-50%] md:top-[12%] md:right-[-55%] lg:top-[30%]">
                    <Button
                        type={"button"}
                        styling={
                            "btn-dark-green lg:hidden lg:w-[30%] lg:h-[40%]"
                        }
                        label={"Log in"}
                    />
                    <Button
                        type={"button"}
                        styling={
                            "btn-white-text hover:bg-green-90 hover:text-white lg:w-[30%] lg:h-[40%]"
                        }
                        label={"Sign up"}
                    />
                </div>
            </section>

            <section className="max-container lg:p-2 padding-container flexCenter mt-40 md:mt-[40%] lg:mt-[10%] xl:mt-[20%]">
                <div className="flexCenter text-center flex-col mb-10 w-[70%] lg:gap-10 gap-6 lg:flex-row regular-20 2xl:regular-32">
                    <p className="">
                        The platform where people come to{" "}
                        <span className="bold-20 2xl:bold-40">
                            learn, share advice and ask questions{" "}
                        </span>{" "}
                        about fitness related activities.
                    </p>
                    <Image
                        src={helpImage}
                        width={300}
                        height={200}
                        alt="Girl helping a guy wrap his ankle"
                    ></Image>
                    <p>
                        Made with the aim of providing{" "}
                        <span className="bold-20 2xl:bold-40">
                            help and support for everyone
                        </span>{" "}
                        starting from newbie to advanced level.
                    </p>
                </div>
            </section>
        </>
    );
}
