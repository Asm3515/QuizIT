import Header from "../../components/Home/Header";
import { useEffect, useState } from "react";
import default_album_art from "../../assets/images/default_album_art.png"
import '../../styles/Romantic.css';
import anime from "animejs";

export function TopRomanticSongs() {
    const [queryResults, setQueryResults] = useState([]);

    async function fetchQueryResults() {
        try {
            const response = await fetch('http://localhost:3001/best-romantic-songs');
            const data = await response.json();
            setQueryResults(data);
        } catch (error) {
            console.error('Error fetching query', error);
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchQueryResults();
        animateHearts();
    }, []);

    function animateHearts() {
        anime({
            targets: '.heart',
            translateX: function () {
                return anime.random(-700, 700);
            },
            translateY: function () {
                return anime.random(-500, 500);
            },
            rotate: 45,
            scale: function () {
                return anime.random(1, 5);
            },
            easing: 'easeInOutBack',
            duration: 3000,
            delay: anime.stagger(100),
            direction: 'alternate',
            loop: true,
        });
    }

    function heartContainer() {
        const heartsList = []
        for (let i = 0; i < 50; i++) {
            heartsList.push(<div key={i} className="heart"></div>);
        }
        return heartsList;
    }

    return (
        <div>
            <Header className="z-1" />
            <div className="romantic-container">
                {heartContainer()}
            </div>
            <h1 className="relative text-3xl text-center text-white font-bold m-4">Top 50 Romantic Songs</h1>
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 m-8">
                {queryResults?.map((song) => (
                    <a key={song.id} href={song.album_url ?? '#'} target="_blank" className="z-2 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100">
                        <img className="object-cover w-full rounded-t-lg h-96 md:h-full md:w-48 md:rounded-none md:rounded-s-lg" src={song.album_art_url ?? default_album_art} alt="Album" />
                        <div className="flex flex-col justify-between p-4 leading-normal">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{song.title}</h5>
                            <h5 className="mb-2 text-xl font-semibold tracking-tight text-gray-900">{song.artist_name}</h5>
                            <p className="mb-3 font-normal text-gray-700">{song.album}</p>
                        </div>
                    </a>
                ))}
            </div>
            <footer className="footer footer-center p-4 bg-neutral text-neutral-content">
                <aside>
                    <p>MetaMusic © 2024 - Made With ❤️ by Aditya, Sumedh and Ajinkya</p>
                </aside>
            </footer>
        </div>
    );
}