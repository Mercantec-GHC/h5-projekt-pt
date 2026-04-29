"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightToBracket";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import Link from "next/link";
import React from "react";

const Navbar: React.FunctionComponent = () => {
    return (
        <nav className="navbar bg-base-100 shadow-2xl sticky top-0 z-10 h-25" style={{ backgroundColor: "#5372F0" }}>
            <div className="grid w-full grid-cols-3 items-center p-5">
                <div className="flex justify-self-start">
                    <Link href="/" className="text-lg md:text-3xl font-bold gap-4">
                        PT Market
                    </Link>
                </div>
                <div className="relative flex items-center justify-self-center">
                    <FontAwesomeIcon icon={faSearch} className="pointer-events-none absolute left-3 text-white/80" />
                    <input type="text" placeholder="Search..." className="rounded-lg h-10 w-100 border border-transparent pl-10 shadow-lg focus:outline-none focus:border-[#8FA7FF]" style={{ backgroundColor: "#4965D4" }} />
                </div>

                <div id="login-button" className="flex justify-self-end p-2 rounded-xl shadow-lg" style={{ backgroundColor: "#4965D4" }}>
                    <Link href="/login" className="btn btn-ghost text-2xl">
                        <FontAwesomeIcon icon={faArrowRightToBracket} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
