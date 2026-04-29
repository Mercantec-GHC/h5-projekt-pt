"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn } from "@fortawesome/free-solid-svg-icons/faSignIn";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons/faRightFromBracket";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import Link from "next/link";
import React from "react";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/faShoppingCart";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "./cart-context";

// Gets username from token
const getSessionUsername = (token: string | undefined) => {
    if (!token) {
        return null;
    }

    try {
        const payload = token.split(".")[1];
        if (!payload) {
            return null;
        }

        const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(atob(normalizedPayload));
        return "Velkommen " + (decoded?.data?.user ?? null) + "!" as string;
    } catch {
        return null;
    }
};

const Navbar: React.FunctionComponent = () => {
    const cookies = new Cookies();
    const router = useRouter();
    const { toggleCart } = useCart();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const sessionToken = cookies.get("session");
        setIsLoggedIn(Boolean(sessionToken));
        setUsername(getSessionUsername(sessionToken));
        setIsMounted(true);
    }, []);

    const handleLogout = () => {
        cookies.remove("session", { path: "/" });
        setIsLoggedIn(false);
        setUsername(null);
        router.refresh();
    };

    return (
        <nav className="navbar bg-base-100 shadow-2xl sticky top-0 z-10 h-25" style={{ backgroundColor: "#5372F0" }}>
            <div className="flex w-full items-center gap-4 px-5 py-4">
                <div className="flex shrink-0 items-center">
                    <Link href="/" className="text-lg md:text-3xl font-bold gap-4">
                        PT Market
                    </Link>
                </div>
                <div className="relative flex flex-1 items-center justify-center px-4">
                    <div className="relative h-10 w-full max-w-[520px]">
                        <FontAwesomeIcon icon={faSearch} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/80" />
                        <input type="text" placeholder="Search..." className="absolute left-1/2 h-10 w-full max-w-[400px] -translate-x-1/2 rounded-lg border border-transparent pl-10 shadow-lg focus:outline-none focus:border-[#8FA7FF]" style={{ backgroundColor: "#4965D4" }} />

                        {isMounted && isLoggedIn && username ? (
                            <div className="absolute left-[calc(50%+220px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap px-4 py-2 text-lg font-semibold text-white lg:block">
                                {username}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <div id="cart-button" className="flex rounded-xl bg-[#4965D4] p-2 shadow-lg">
                        <button type="button" onClick={toggleCart} className="btn btn-ghost text-2xl cursor-pointer" aria-label="Open cart">
                            <FontAwesomeIcon icon={faShoppingCart} />
                        </button>
                    </div>

                    <div id="login-button" className="flex rounded-xl bg-[#4965D4] p-2 shadow-lg">
                        {isLoggedIn ? (
                            <button type="button" onClick={handleLogout} className="btn btn-ghost text-2xl cursor-pointer" aria-label="Log out">
                                <FontAwesomeIcon id="signInIcon" icon={faRightFromBracket} />
                            </button>
                        ) : (
                            <Link href="/login" className="btn btn-ghost text-2xl" aria-label="Log in">
                                <FontAwesomeIcon id="signInIcon" icon={faSignIn} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
