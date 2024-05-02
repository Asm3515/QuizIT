import React from "react";
import { MdHomeFilled, MdSearch } from "react-icons/md";
import { IoLibrary } from "react-icons/io5";

export default function Sidebar() {
  return (
    <div className="bg-black text-gray-300 flex flex-col h-screen w-64">
      <div className="top__links">
        <div className="logo text-center my-4">
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
            alt="spotify"
            className="max-w-80%"
          />
        </div>
        <ul className="flex flex-col gap-4 px-4">
          <SidebarItem icon={<MdHomeFilled />} text="Home" />
          <SidebarItem icon={<MdSearch />} text="Search" />
          <SidebarItem icon={<IoLibrary />} text="Your Library" />
        </ul>
      </div>
      {/* Static content for Playlists */}
    </div>
  );
}

function SidebarItem({ icon, text }) {
  return (
    <li className="flex items-center gap-4 cursor-pointer transition duration-300 hover:text-white">
      {icon}
      <span>{text}</span>
    </li>
  );
}
