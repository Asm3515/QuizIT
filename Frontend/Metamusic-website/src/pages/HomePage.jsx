import { Link, useOutletContext } from "react-router-dom";
import { useState, useEffect } from 'react';
import Header from "../components/Home/Header"
import Sidebar from "../components/Home/Sidebar"

export function HomePage({ logOut }) {
    const [user, setUser] = useOutletContext();
    const [isUserEditPage, setIsUserEditPage] = useState(false);

    // State variables to store the fetched data
    const [topSongs, setTopSongs] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [topArtistsByGenre, setTopArtistsByGenre] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null); // State to track selected song

    // Function to fetch top songs
    const fetchTopSongs = async () => {
        try {
            const response = await fetch('http://localhost:3001/top-ten-popular-songs');
            const data = await response.json();
            setTopSongs(data);
        } catch (error) {
            console.error('Error fetching top songs:', error);
        }
    };

    // Function to fetch top artists
    const fetchTopArtists = async () => {
        try {
            const response = await fetch('http://localhost:3001/top-ten-artists');
            const data = await response.json();
            setTopArtists(data);
        } catch (error) {
            console.error('Error fetching top artists:', error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchTopSongs();
        fetchTopArtists();
        // Remove fetchTopFromGenre as it's not being used
    }, []);

    // Function to handle selection of a song
    const handleSongClick = (song) => {
        if (selectedSong && selectedSong.id === song.id) {
            // If the same song is clicked again, deselect it
            setSelectedSong(null);
        } else {
            // Otherwise, set the selected song
            setSelectedSong(song);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <Header/>,
            <h1 className="text-3xl font-semibold mb-4">Top Songs</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {topSongs.map((song) => (
                    <div key={song.id} className="p-4 border rounded cursor-pointer" onClick={() => handleSongClick(song)}>
                        <h2 className="text-lg font-semibold mb-2">{song.title}</h2>
                        <h2 className="text-lg font-semibold mb-2">{song.artist}</h2>
                        <p className="text-lg  mb-2">Album : {song.album}</p>
                        <p className="text-lg  mb-2">Release Date : {song.release_date}</p>
                        {/* Display other song information as needed */}
                        {selectedSong && selectedSong.id === song.id && (
                            <div>
                                {/* Render additional song information here */}
                                <p>Artist: {song.popularity}</p>
                                <p>Genre: {song.album}</p>
                                {/* Add more details as needed */}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <h1 className="text-3xl font-semibold my-8">Top Artists</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {topArtists.map((artist) => (
                    <div key={artist.artist_id} className="p-4 border rounded">
                        <h2 className="text-lg font-semibold mb-2">{artist.artist_name}</h2>
                        {/* Display other artist information as needed */}
                    </div>
                ))}
            </div>


            <h1 className="text-3xl font-semibold my-8">Top Artists By Genre</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {topArtistsByGenre.map((artist) => (
                    <div key={artist.artist_id} className="p-4 border rounded">
                        <h2 className="text-lg font-semibold mb-2">{artist.artist_name}</h2>
                        {/* Display other artist information as needed */}
                    </div>
                ))}
            </div>
            
        </div>
    );
}
