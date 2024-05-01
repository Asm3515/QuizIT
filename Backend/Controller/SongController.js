

exports.addSongsToPlaylist = async (req, res) => {
    try {
      const { username, playlistName, songs } = req.body;
  
      // Check if the playlist exists for the user
      const playlistExistsQuery = 'SELECT * FROM Playlist WHERE Username = $1 AND Playlist_Name = $2';
      const playlistExistsResult = await pool.query(playlistExistsQuery, [username, playlistName]);
      if (playlistExistsResult.rows.length === 0) {
        return res.status(404).json({ error: 'Playlist not found for the user' });
      }
  
      // Fetch the existing tracks for the playlist
      const getTracksQuery = 'SELECT Tracks FROM Playlist WHERE Username = $1 AND Playlist_Name = $2';
      const { rows } = await pool.query(getTracksQuery, [username, playlistName]);
      const existingTracks = rows.length > 0 ? rows[0].tracks : [];
  
      // Concatenate the existing tracks with the new songs and remove duplicates
      const updatedTracks = [...new Set([...existingTracks, ...songs])];
  
      // Update the playlist with the new tracks
      const updatePlaylistQuery = 'UPDATE Playlist SET Tracks = $1 WHERE Username = $2 AND Playlist_Name = $3';
      await pool.query(updatePlaylistQuery, [updatedTracks, username, playlistName]);
  
      res.status(201).json({ message: 'Songs added to playlist successfully' });
    } catch (error) {
      console.error('Error adding songs to playlist:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Controller function for deleting songs from a playlist
  exports.deleteSongsFromPlaylist = async (req, res) => {
    try {
      const { username, playlistName, songsToDelete } = req.body;
  
      // Check if the playlist exists for the user
      const playlistExistsQuery = 'SELECT * FROM Playlist WHERE Username = $1 AND Playlist_Name = $2';
      const playlistExistsResult = await pool.query(playlistExistsQuery, [username, playlistName]);
      if (playlistExistsResult.rows.length === 0) {
        return res.status(404).json({ error: 'Playlist not found for the user' });
      }
  
      // Fetch the existing tracks for the playlist
      const getTracksQuery = 'SELECT Tracks FROM Playlist WHERE Username = $1 AND Playlist_Name = $2';
      const { rows } = await pool.query(getTracksQuery, [username, playlistName]);
      const existingTracks = rows.length > 0 ? rows[0].tracks : [];
  
      // Filter out the songs to delete from the existing tracks
      const updatedTracks = existingTracks.filter(track => !songsToDelete.includes(track));
  
      // Update the playlist with the updated tracks
      const updatePlaylistQuery = 'UPDATE Playlist SET Tracks = $1 WHERE Username = $2 AND Playlist_Name = $3';
      await pool.query(updatePlaylistQuery, [updatedTracks, username, playlistName]);
  
      res.status(200).json({ message: 'Songs deleted from playlist successfully' });
    } catch (error) {
      console.error('Error deleting songs from playlist:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };