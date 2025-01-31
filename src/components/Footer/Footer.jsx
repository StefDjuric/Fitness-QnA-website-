import Link from "next/link";
import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from "@/constants";
import FooterColumn from "../FooterColumn/FooterColumn";
import React from "react";
import Image from "next/image";

function Footer() {
    return (
        <footer className="flexCenter mb-24 mt-10">
            <div className="padding-container max-container flex w-full flex-col gap-14">
                <div className="flex flex-col items-start justify-center gap-[10%] md:flex-row">
                    <Link
                        href="/"
                        className="mb-10 font-bold text-2xl lg:text-4xl "
                    >
                        <span className="text-green-900">Be</span>Lean.
                    </Link>
                    <div className="flex flex-wrap gap-10 sm:justify-between md:flex-1">
                        {FOOTER_LINKS.map((column) => (
                            <React.Fragment key={column.key}>
                                <FooterColumn title={column.title}>
                                    <ul className="flex flex-col regular-16 gap-4 text-gray-30">
                                        {column.links.map((link) => (
                                            <Link href="/" key={link.key}>
                                                {link.title}
                                            </Link>
                                        ))}
                                    </ul>
                                </FooterColumn>
                            </React.Fragment>
                        ))}

                        <div className="flex flex-col gap-5">
                            <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                                {FOOTER_CONTACT_INFO.links.map((link) => (
                                    <Link
                                        href={"/"}
                                        key={link.key}
                                        className="flex gap-4 md:flex-col lg:flex-row "
                                    >
                                        <p className="whitespace-nowrap regular-16 text-gray-30">
                                            {link.label}:
                                        </p>
                                        <p className="medium-16 text-blue-70">
                                            {link.value}{" "}
                                        </p>
                                    </Link>
                                ))}
                            </FooterColumn>
                        </div>
                        <div className="flex flex-col gap-5">
                            <FooterColumn title={SOCIALS.title}>
                                <ul className="regular-14 flex gap-4 text-gray-30">
                                    {SOCIALS.links.map((link) => (
                                        <Link href="/" key={link.key}>
                                            <Image
                                                alt="logo"
                                                src={link.src}
                                                width={24}
                                                height={24}
                                            />
                                        </Link>
                                    ))}
                                </ul>
                            </FooterColumn>
                        </div>
                    </div>
                </div>
                <div className="border bg-gray-30" />
                <p className="regular-14 w-full text-gray-30 text-center">
                    2024 BeLean | All rights reserved
                </p>
            </div>
        </footer>
    );
}

export default Footer;
