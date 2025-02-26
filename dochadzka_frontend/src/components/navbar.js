import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {API_URL} from "../api";

const NavBar = () => {
    const [categories, setCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/categories/`)
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Chyba pri načítaní kategórií:", error));
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleBurgerMenu = () => {
        setIsBurgerMenuOpen(!isBurgerMenuOpen);
    };

    return (
        <nav className="bg-gray-800 p-4 border rounded-lg shadow-sm relative">
            <div className="container mx-auto flex"> {/* Odstránené justify-between */}
                <div className="flex-1 flex items-center"> {/* Názov v samostatnom flex kontajneri */}
                    <Link to="/" className="text-white font-bold text-xl">Názov Aplikácie</Link>
                </div>

                {/* Desktopové menu */}
                <div className="hidden md:flex space-x-4">
                    <Link to="/" className="text-gray-300 hover:text-white">Domov</Link>
                    <Link to="/players" className="text-gray-300 hover:text-white">Hráči</Link>
                    <Link to="/trainings" className="text-gray-300 hover:text-white">Tréningy</Link>
                    <Link to="/addplayer" className="text-gray-300 hover:text-white">Pridať hráča</Link>

                    {/* Dropdown pre kategórie */}
                    <div className="relative">
                        <button
                            className="text-gray-300 hover:text-white focus:outline-none"
                            onClick={toggleDropdown}
                        >
                            Kategórie
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                                {categories.map((category) => (
                                    <Link
                                        key={category.name}
                                        to={`/category_info/${category.name}`}
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Hamburger menu pre mobilné zariadenia */}
                <div className="md:hidden flex items-center"> {/* Pridané flex a items-center */}
                    <button
                        className="text-white focus:outline-none"
                        onClick={toggleBurgerMenu}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* Mobilné menu */}
                {isBurgerMenuOpen && (
                    <div className="absolute top-16 left-0 w-full bg-gray-800 rounded-md shadow-lg z-10"> {/* w-full je kľúčové */}
                        <Link to="/" className="block px-4 py-2 text-gray-300 hover:text-white" onClick={toggleBurgerMenu}>Domov</Link>
                        <Link to="/players" className="block px-4 py-2 text-gray-300 hover:text-white" onClick={toggleBurgerMenu}>Hráči</Link>
                        <Link to="/trainings" className="block px-4 py-2 text-gray-300 hover:text-white" onClick={toggleBurgerMenu}>Tréningy</Link>
                        <Link to="/addplayer" className="block px-4 py-2 text-gray-300 hover:text-white" onClick={toggleBurgerMenu}>Pridať hráča</Link>

                        {/* Dropdown pre kategórie v mobilnom menu */}
                        <div className="relative">
                            <button
                                className="block px-4 py-2 text-gray-300 hover:text-white w-full text-left focus:outline-none"
                                onClick={toggleDropdown}
                            >
                                Kategórie
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.name}
                                            to={`/category_info/${category.name}`}
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                toggleBurgerMenu();
                                            }}
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;