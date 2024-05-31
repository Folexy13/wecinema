// import React from "react";

import { MdMenu } from "react-icons/md"
import React, { useState } from 'react';
import logo from "../../assets/wecinema.png";
import {Link, useNavigate } from "react-router-dom";

import '../header/drowpdown.css';
import { categories } from "../../App";
interface HeaderProps {
	darkMode: boolean;
	toggler: any;
	expand: boolean;
	isMobile: boolean;
}
const Header: React.FC<HeaderProps> = ({
	darkMode,
	toggler,
	expand,
	isMobile,
}) => {
	const nav = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

	return (
		<header
		
			className={`text-blue z-50 border-b fixed w-screen border-gray-200 ${
				darkMode ? "bg-dark" : "bg-light"
			}  ${darkMode ? "text-dark" : "text-light"} `}
		>
			<nav
				className={`mx-auto flex gap-4 items-center justify-between p-4 sm:pr-12 ${
					expand && !isMobile ? " px-4" : "sm:px-12 "
				} `}
			>
				<ul className="flex gap-4 items-center">
					<MdMenu size={30} className="cursor-pointer mt-2 " onClick={toggler} />
					<li
						className="cursor-pointer flex-col sm:flex-row flex gap-2 items-center"
						onClick={() => nav("/")}
					>
						<img src={logo} alt="logo" width={60} title="wecinema" />
						{!isMobile && (
							<p className=" text-md sm:text-2xl mt-3 font-mono">
								WeCinema
							</p>
						)}
					</li>
				</ul>
				
				<form className="w-full md:w-2/3">
					<input
						type="search"
						placeholder="Search anything..."
						className="w-full md:w-2/3 flex mx-auto border rounded-xl cursor-pointer p-2 outline-none"
					/>
				</form>
		{!isMobile && (
			<div className="dropdown">
			<button className="hover:bg-yellow-400 whitespace-nowrap hover:text-white hover:border-white-100 border border-black-700 rounded-xl px-4 py-1 cursor-pointer" onClick={toggleDropdown}>
                Genre
                <span className={`arrow ${isOpen ? 'open' : ''}`}></span>
            </button>
            {isOpen && (
                <ul className="dropdown-menu">
				{categories.map((val: string, index: number) => (
						<li
							key={index}
							className={`duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
								expand ? "" : "flex-col justify-center text-xs gap-1 specific"
							} `}
						>
							<div
								onClick={() => nav("/category/" + val)}
								className="relative rounded-full w-32px h-32px box-border flex-shrink-0 block"
							>
								<div
									className="items-center rounded-full flex-shrink-0 justify-center bg-center bg-no-repeat bg-cover flex"
									style={{
										width: 12,
										height: 12,
									}}
									title="Fresh and Fit"
								></div>
							</div>
							<Link to="#" className="text-sm">
								{val}
							</Link>
						</li>
						
					))}
                </ul>
				
            )}
        </div>
		)}
		{!isMobile && (
	
		<div className="dropdown">
    {/* <label className="block mb-2" htmlFor="rating">Rating:</label> */}
    <select
      id="rating"
     
     className="hover:bg-yellow-400 whitespace-nowrap hover:text-white hover:border-white-700 border border-white-700 rounded-xl px-4 py-1 cursor-pointer"
	 
    >
	 <span className={`arrow ${isOpen ? 'open' : ''}`}></span>
      <option value="" disabled>Select</option>
      <option value="1">Rating</option>
      <option value="2">G</option>
      <option value="3">PG </option>
      <option value="4">PG-13</option>
      <option value="5">RS</option>
      <option value="5">X</option>

    </select>
	</div>
		)}

			</nav>
		
		</header>
		
	);
};

export default Header;
