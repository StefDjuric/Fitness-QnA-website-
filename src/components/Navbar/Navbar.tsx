"use client";

import { LOGGED_IN_NAVLINKS, NAV_LINKS } from "@/constants";
import Link from "next/link";
import Button from "../Button/Button";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../Providers/AuthContextProvider";

function Navbar(): React.ReactElement {
    const [isHamburgerOpen, setisHamburgerOpen] = useState(false);
    const [isSearchCliked, setIsSearchClicked] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [searchValue, setSearchValue] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await axios.get("/api/auth/check-auth");

                setIsLoggedIn(response.data?.isLoggedIn);
            } catch (error: any) {
                setIsLoggedIn(false);
            }
        }

        checkAuth();
    }, [setIsLoggedIn]);

    useEffect(() => {
        const closeOpenMenus = (event: MouseEvent): void => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setisHamburgerOpen(false);
                setIsSearchClicked(false);
            }
        };

        document.addEventListener("mousedown", closeOpenMenus);
        return () => document.removeEventListener("mousedown", closeOpenMenus);
    }, []);

    const toggleHamburgerDropdown = (): void =>
        setisHamburgerOpen(!isHamburgerOpen);

    const toggleSearchDropdown = (): void =>
        setIsSearchClicked(!isSearchCliked);

    const handleLogOut = async () => {
        try {
            const response = await axios.get("/api/users/logout");

            console.log(response);

            setIsLoggedIn(false);

            router.push("/");
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleSearch = () => {
        if (searchValue) return router.push(`/questions?query=${searchValue}`);
        else return router.push("/");
    };

    const handleKeyPress = (event: { key: any }) => {
        if (event.key === "Enter") {
            return handleSearch();
        }
    };

    return (
        <>
            <nav className="flexBetween max-container padding-container relative z-30 py-5 ">
                <Link
                    href="/"
                    className="font-bold text-2xl lg:text-3xl text-gray-90 "
                >
                    <span className="text-green-900">Be</span>Lean.
                </Link>
                <ul className="hidden h-full gap-12 lg:flex">
                    {isLoggedIn
                        ? LOGGED_IN_NAVLINKS.map((link) => (
                              <Link
                                  className="ml-4 mt-2  regular-18 text-gray-50 cursor-pointer hover:font-bold pb-1.5 transition-all"
                                  href={link.href}
                                  key={link.key}
                              >
                                  {link.label}
                              </Link>
                          ))
                        : NAV_LINKS.map((link) => (
                              <Link
                                  className="ml-4 mt-2  regular-18 text-gray-50 cursor-pointer hover:font-bold pb-1.5 transition-all"
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
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Search questions ..."
                        className="border-2 border-gray-50 focus-visible:outline-none rounded-lg p-1"
                        onKeyDown={handleKeyPress}
                    />
                </div>
                <div className="hidden lg:flexBetween">
                    {isLoggedIn ? (
                        <Button
                            type={"button"}
                            label={"Log out"}
                            styling={"btn-dark-green"}
                            onClick={handleLogOut}
                        />
                    ) : (
                        <>
                            <Link href="/login">
                                <Button
                                    type={"button"}
                                    label={"Log in"}
                                    styling={"btn-dark-green"}
                                />
                            </Link>

                            <Link href="/signup">
                                <Button
                                    type={"button"}
                                    label={"Sign up"}
                                    styling={"btn-white-text hover:font-bold "}
                                />
                            </Link>
                        </>
                    )}
                </div>
                {/* Hamburger menu and search div */}
                <div className="flexCenter gap-12 lg:hidden " ref={menuRef}>
                    <div className=" relative inline-block text-left ">
                        <Image
                            onClick={toggleSearchDropdown}
                            className="hover:cursor-pointer inline-block bruh"
                            src="/magnifying-glass.svg"
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
                            onClick={toggleHamburgerDropdown}
                            src={
                                isHamburgerOpen
                                    ? "/xmark-solid.svg"
                                    : "/menu.svg"
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
                            {isLoggedIn
                                ? LOGGED_IN_NAVLINKS.map((link) => (
                                      <Link
                                          className="ml-4 mt-2  regular-18 text-gray-50 cursor-pointer hover:font-bold pb-1.5 transition-all"
                                          href={link.href}
                                          key={link.key}
                                      >
                                          {link.label}
                                      </Link>
                                  ))
                                : NAV_LINKS.map((link) => (
                                      <Link
                                          className="ml-4 mt-2  regular-18 text-gray-50 cursor-pointer hover:font-bold pb-1.5 transition-all"
                                          href={link.href}
                                          key={link.key}
                                      >
                                          {link.label}
                                      </Link>
                                  ))}
                            {isLoggedIn ? (
                                <Button
                                    label="log out"
                                    styling="btn-dark-green w-full mt-6"
                                    type="button"
                                    onClick={handleLogOut}
                                />
                            ) : (
                                <></>
                            )}
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
                    className={`fixed w-screen flex  gap-4 flex-col h-[50px] top-16 z-50  lg:hidden ${
                        isSearchCliked ? "inline-block" : "hidden"
                    }`}
                >
                    <input
                        type="search"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Search questions..."
                        className="mx-4 p-2 w-[95%] focus-visible:outline-none border-2 border-gray-50 rounded-lg"
                    />
                    <Link href={`/questions?query=${searchValue}`}>
                        <Button
                            type={"button"}
                            label={"Search"}
                            styling={"btn-dark-green w-[100%]"}
                            onClick={handleSearch}
                        />
                    </Link>
                </div>
            )}
        </>
    );
}

export default Navbar;
