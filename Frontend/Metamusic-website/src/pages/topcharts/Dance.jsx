import Header from "../../components/Home/Header";
import { useEffect, useState } from "react";
import default_album_art from "../../assets/images/default_album_art.png"

export function TopDanceSongs() {
    const [queryResults, setQueryResults] = useState([]);

    async function fetchQueryResults() {
        try {
            const response = await fetch('http://localhost:3001/best-dance-songs');
            const data = await response.json();
            setQueryResults(data);
        } catch (error) {
            console.error('Error fetching query:', error);
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchQueryResults();
    }, []);

    return (
        <>
            <Header />
            <h1 className="text-3xl text-center font-bold m-4">Top 50 Dance Songs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-8">
                {queryResults?.map((song) => (
                    <a href={song.album_url ?? '#'} target="_blank" class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100">
                    <img class="object-cover w-full rounded-t-lg h-96 md:h-full md:w-48 md:rounded-none md:rounded-s-lg" src={song.album_art_url ?? default_album_art} alt="Album" />
                    <div class="flex flex-col justify-between p-4 leading-normal">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{song.title}</h5>
                        <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900">{song.artist_name}</h5>
                        <p class="mb-3 font-normal text-gray-700">{song.album}</p>
                    </div>
                </a>
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