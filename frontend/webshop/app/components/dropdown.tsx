"use client";
import { SetStateAction, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

export default function Dropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Select filter");

    const filters = ["Price: High to Low", "Price: Low to High", "Newest", "Oldest"];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (filter: SetStateAction<string>) => {
        setSelectedFilter(filter);
        setIsOpen(false);
    };

    return (
        <div className="flex justify-center min-h-screen">
            <div className="relative inline-block text-left">
                <button
                    type="button"
                    className="inline-flex justify-center w-full
                               rounded-md border border-gray-300
                               shadow-sm px-4 py-2 bg-white text-sm
                               font-medium text-black hover:bg-gray-50"
                    onClick={toggleDropdown}
                >
                    {selectedFilter}
                    <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                    <div
                        className="origin-top-right absolute
                                    left-0 mt-2 w-56 rounded-md
                                    shadow-lg bg-white ring-1 ring-black
                                    ring-opacity-5 focus:outline-none"
                    >
                        <div className="py-1">
                            {filters.map((filter, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="block px-4 py-2
                                               text-sm text-black
                                               hover:bg-gray-100"
                                    onClick={() => handleSelect(filter)}
                                >
                                    {filter}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
