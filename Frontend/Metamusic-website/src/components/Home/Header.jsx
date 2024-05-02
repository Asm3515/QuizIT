import React from "react";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

export default function Navbar({ navBackground }) {
  return (
    <div className={`flex justify-between items-center px-8 h-20vh sticky top-0 transition duration-300 ${navBackground ? 'bg-black bg-opacity-70' : 'bg-transparent'}`}>
      <div className="search__bar bg-white w-1/3 px-6 py-2 rounded-full flex items-center gap-4">
        <FaSearch className="text-gray-500 text-3xl" />
        <input type="text" placeholder="Artists, songs, or podcasts" className="border-none h-12 w-full focus:outline-none text-lg" />
      </div>
      <div className="avatar bg-black py-2 px-4 rounded-full flex justify-center items-center">
        <a href="#" className="flex items-center gap-4 text-white font-bold text-lg">
          <CgProfile className="bg-gray-800 rounded-full p-2 text-gray-300 text-xl" />
          <span>User Name</span>
        </a>
      </div>
    </div>
  );
}
