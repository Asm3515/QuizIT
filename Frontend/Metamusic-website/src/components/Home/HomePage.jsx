import { useEffect, useState } from 'react';

function HomePage() {
  const [isUserEditPage, setIsUserEditPage] = useState(false);
  const [topSongs, setTopSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  const fetchTopSongs = async () => {
    try {
      const response = await fetch('http://localhost:3001/top-ten-popular-songs');
      const data = await response.json();
      setTopSongs(data);
    } catch (error) {
      console.error('Error fetching top songs:', error);
    }
  };

  const fetchTopArtists = async () => {
    try {
      const response = await fetch('http://localhost:3001/top-ten-artists');
      const data = await response.json();
      setTopArtists(data);
    } catch (error) {
      console.error('Error fetching top artists:', error);
    }
  };

  useEffect(() => {
    fetchTopSongs();
    fetchTopArtists();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4">Top Songs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topSongs.map((song) => (
          <div key={song.id} className="p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">{song.title}</h2>
            {/* Display other song information as needed */}
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
    </div>
  );
}

export default HomePage;
