"use client";

import { navLinks } from "@/constants";
import Link from "next/link";
import Button from "../Button/Button";
import Image from "next/image";
import { useState } from "react";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = (): void => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="flexBetween max-container padding-container relative z-30 py-5 ">
            <Link href="/" className="font-bold text-2xl text-gray-90 ">
                <span className="text-green-900">Be</span>Lean.
            </Link>
            <ul className="hidden h-full gap-12 lg:flex">
                {navLinks.map((link) => (
                    <Link
                        className="flexCenter regular-18 text-gray-50 cursor-pointer hover:font-bold pb-1.5 transition-all"
                        href={link.href}
                        key={link.key}
                    >
                        {link.label}
                    </Link>
                ))}
            </ul>

            <div className="hidden lg:flexCenter">
                <input
                    type="search"
                    name=""
                    id=""
                    placeholder="Search..."
                    className="border-2 border-gray-50 focus-visible:outline-none rounded-lg p-1"
                />
            </div>
            <div className="hidden lg:flexBetween">
                <Button
                    type={"button"}
                    label={"Log in"}
                    styling={"btn-dark-green"}
                />
                <Button
                    type={"button"}
                    label={"Sign up"}
                    styling={"btn-white-text hover:font-bold "}
                />
            </div>
            <div className="lg:hidden relative inline-block text-left">
                <Image
                    onClick={toggleDropdown}
                    src={isOpen ? "xmark-solid.svg" : "menu.svg"}
                    width={24}
                    height={24}
                    alt=""
                    className=" inline-block cursor-pointer "
                ></Image>
                <ul
                    className={`${
                        isOpen ? "translate-x-0" : "translate-x-full"
                    } flex fixed top-15 right-0  h-screen gap-8 w-[250px] z-50 bg-white shadow-lg flex-col items-start  regular-18 text-gray-50 cursor-pointer hover:font-bold pb-1.5 transition-all ease-in-out duration-300`}
                >
                    {navLinks.map((link) => (
                        <Link
                            className="ml-4 mt-2  regular-18 text-gray-50 cursor-pointer hover:font-bold pb-1.5 transition-all"
                            href={link.href}
                            key={link.key}
                        >
                            {link.label}
                        </Link>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
