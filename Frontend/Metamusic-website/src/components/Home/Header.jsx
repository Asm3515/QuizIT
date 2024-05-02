import React from "react";
import default_artist_image from "../../assets/images/default_artist_image.png"

export default function Header({ logOut }) {

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-2xl">MetaMusic</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img className="rounded-t-lg sm:w-60 md:w-96 h-auto" src={default_artist_image} alt="user_default_avatar" />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li><a>Favourites</a></li>
            <li><button onClick={logOut}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
