import { useParams } from "react-router-dom";
import Header from "../components/Home/Header";
import { useEffect, useState } from "react";
import default_album_art from "../assets/images/default_album_art.png"

export function SearchResultsPage() {
    const { searchTerm } = useParams();
    const [searchResults, setSearchResults] = useState([]);

    async function fetchSearchResults(){
        try {
            const response = await fetch(`http://localhost:3001/track/search/${searchTerm}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching top artists:', error);
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchSearchResults();
    }, []);

    return (
        <>
            <Header initialSearchTerm={searchTerm} />
            <h1 className="text-3xl font-bold m-4">Search Results</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 m-8">
                {searchResults?.map((song) => (
                    <div key={song.track_id} className="card bg-base-100 shadow-md">
                        <a href={song.album_url ?? '#'} target="_blank">
                            <img className="rounded-t-lg sm:w-60 md:w-96 h-auto" src={song.album_art_url ?? default_album_art} alt="album art" />
                            <div className="p-4">
                                <p className="text-lg font-bold mb-2">{song.title}</p>
                                <p className="text-base font-semibold mb-2">{song.artist_name}</p>
                                <p className="text-sm font-normal text-gray-700">{song.album}</p>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
            <footer className="footer footer-center p-4 bg-neutral text-neutral-content">
                <aside>
                    <p>MetaMusic © 2024 - Made With ❤️ by Aditya, Sumedh and Ajinkya</p>
                </aside>
            </footer>
        </>
    );
}