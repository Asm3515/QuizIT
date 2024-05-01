

exports.createPlaylist = async (req, res) => {
    try {
      const { username, playlistName, songName } = req.body;
  
      // Check if the playlist already exists for the user with the same name
      const playlistExistsQuery = 'SELECT * FROM Playlist WHERE Username = $1 AND Playlist_Name = $2';
      const playlistExistsResult = await pool.query(playlistExistsQuery, [username, playlistName]);
      if (playlistExistsResult.rows.length > 0) {
        return res.status(400).json({ error: 'Playlist with the same name already exists for the user' });
      }
  
      // Insert the new playlist into the database
      const insertPlaylistQuery = 'INSERT INTO Playlist (Username, Playlist_Name, Song_name) VALUES ($1, $2, $3)';
      await pool.query(insertPlaylistQuery, [username, playlistName, songName]);
  
      res.status(201).json({ message: 'Playlist created successfully' });
    } catch (error) {
      console.error('Error creating playlist:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Controller function for deleting a playlist
  exports.deletePlaylist = async (req, res) => {
    try {
      const { username, playlistNumber } = req.params;
  
      // Delete the playlist from the database
      const deletePlaylistQuery = 'DELETE FROM Playlist WHERE Username = $1 AND Playlist_Number = $2';
      await pool.query(deletePlaylistQuery, [username, playlistNumber]);
  
      res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
      console.error('Error deleting playlist:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.getPlaylistsByUser = async (req, res) => {
    try {
      const { username } = req.params;
  
      // Retrieve playlists for the user from the database
      const getPlaylistsQuery = 'SELECT * FROM Playlist WHERE Username = $1';
      const { rows } = await pool.query(getPlaylistsQuery, [username]);
  
      res.json(rows);
    } catch (error) {
      console.error('Error retrieving playlists:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
