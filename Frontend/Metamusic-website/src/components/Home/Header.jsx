import { useState } from "react";
import default_artist_image from "../../assets/images/default_artist_image.png";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

export default function Header( {initialSearchTerm} ) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm??"");
  const [user, setUser] = useOutletContext();

  async function logOut(e) {
    localStorage.removeItem("user");
    setUser(null);
    console.log("Logged out");
    window.location.reload();
  }

  function handleSubmit(e) {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
  }

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl">MetaMusic</Link>
      </div>
      <div className="flex-none gap-2">
        <form onSubmit={handleSubmit} className="form-control">
          <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input input-bordered w-24 md:w-auto" />
        </form>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img className="rounded-t-lg sm:w-60 md:w-96 h-auto" src={default_artist_image} alt="user_default_avatar" />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li key='favourites-link'><Link to="#">Favourites</Link></li>
            <li key='logout-button'><Link to="#" onClick={logOut}>Logout</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
