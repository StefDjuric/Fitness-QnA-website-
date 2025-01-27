"use client";

import { navLinks } from "@/constants";
import Link from "next/link";
import Button from "../Button/Button";
import Image from "next/image";
import { useState, useRef } from "react";

function Navbar(): React.ReactElement {
    const [isHamburgerOpen, setisHamburgerOpen] = useState(false);
    const [isSearchCliked, setIsSearchClicked] = useState(false);
    const menuRef: any = useRef(null);

    const closeOpenMenus = (event: Event): void => {
        if (isHamburgerOpen && !menuRef.current?.contains(event.target)) {
            setisHamburgerOpen(false);
        }
        if (isSearchCliked && !menuRef.current?.contains(event.target)) {
            setIsSearchClicked(false);
        }
    };

    document.addEventListener("mousedown", closeOpenMenus);

    const toggleHamburgerDropdown = (): void =>
        setisHamburgerOpen(!isHamburgerOpen);

    const toggleSearchDropdown = (): void =>
        setIsSearchClicked(!isSearchCliked);

    return (
        <>
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
                        placeholder="Search questions ..."
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
                {/* Hamburger menu and search div */}
                <div className="flexCenter gap-12 lg:hidden ">
                    <div className=" relative inline-block text-left ">
                        <Image
                            ref={menuRef}
                            onClick={toggleSearchDropdown}
                            className="hover:cursor-pointer inline-block bruh"
                            src="magnifying-glass.svg"
                            alt="magnifying glass icon"
                            width={24}
                            height={24}
                        ></Image>
                    </div>
                    <div
                        className=" relative inline-block text-left"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <Image
                            ref={menuRef}
                            onClick={toggleHamburgerDropdown}
                            src={
                                isHamburgerOpen ? "xmark-solid.svg" : "menu.svg"
                            }
                            width={24}
                            height={24}
                            alt=""
                            className=" inline-block cursor-pointer bruh"
                        ></Image>

                        <ul
                            className={`${
                                isHamburgerOpen
                                    ? "translate-x-0"
                                    : "translate-x-full"
                            } flex fixed top-12 right-0  h-screen gap-8 w-[250px] z-50 bg-white shadow-lg flex-col items-start  regular-18 text-gray-50 hover:font-bold pb-1.5 transition-all ease-in-out duration-300`}
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
                    </div>{" "}
                    {/* End of  hamburger menu */}
                </div>{" "}
                {/* End of mobile menu */}
            </nav>
            {/* Mobile search menu */}
            {isSearchCliked && (
                <div
                    ref={menuRef}
                    onMouseDown={(event) => event.stopPropagation()}
                    className={`fixed w-screen flex  gap-4 flex-col h-[50px] top-16 z-50  lg:hidden ${
                        isSearchCliked ? "inline-block" : "hidden"
                    }`}
                >
                    <input
                        type="search"
                        name=""
                        id=""
                        placeholder="Search questions..."
                        className="mx-4 p-2 w-[95%] focus-visible:outline-none border-2 border-gray-50 rounded-lg"
                    />
                    <Button
                        type={"button"}
                        label={"Ask a question"}
                        styling={"btn-dark-green"}
                    />
                </div>
            )}
        </>
    );
}

export default Navbar;
