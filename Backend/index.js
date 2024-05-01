const express = require('express')
const userRoutes = require('./Routes/UserRoutes')
const playlistRoutes = require('./Routes/PlaylistRoutes')
const songRoutes = require('./Routes/SongRoutes')
const cors = require('cors')
const bodyParser = require('body-parser')
const { Pool } = require('pg')
const PORT = 3001

const app = express()

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'metamusic',
  password: 'password',
  port: 5432,
});

module.exports = pool;

//Including Routes
app.use('/api/users', userRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/songs', songRoutes);

app.get('/', (req, res) => {
  res.send("Hello")
})

app.get('/top-ten-popular-songs', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM track
      ORDER BY popularity DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/top-ten-popular-songs/genre/:genre', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT t.*
      FROM track t
      JOIN track_genre_connector tgc ON tgc.track_id = t.id
      JOIN genre g ON g.id = tgc.genre_id
      WHERE g.name = ${genre}
      ORDER BY t.popularity DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/top-ten-popular-songs/artist/:artist', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT t.*
      FROM track t
      JOIN track_artist_connector tac ON tac.track_id = t.id
      JOIN artist a ON a.id = tac.artist_id
      WHERE a.name = ${artist}
      ORDER BY t.popularity DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/top-ten-artists', async (req, res) => {
  try {
    const { rows } = await pool.query(`
    WITH ranked_tracks AS (
      SELECT
          ta.artist_id,
          tt.id AS track_id,
          tt.popularity,
          ROW_NUMBER() OVER (PARTITION BY ta.artist_id ORDER BY tt.popularity DESC) AS track_rank
      FROM
          track_artist_connector ta
      JOIN
          track tt ON ta.track_id = tt.id
  )
    SELECT
      a.id AS artist_id,
      a.name AS artist_name,
      SUM(rt.popularity) AS total_popularity
    FROM
      artist a
    JOIN
      ranked_tracks rt ON a.id = rt.artist_id
    WHERE
      rt.track_rank <= 10
    GROUP BY
      a.id, a.name
    ORDER BY
      total_popularity DESC
    LIMIT
      10;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/best-workout-songs', async (req, res) => {
  try {
    const { rows } = await pool.query(`
    SELECT
      t.id AS track_id,
      t.title,
      t.energy,
      t.tempo,
      t.danceability,
      a.name AS artist_name,
      (t.energy + t.tempo + t.danceability) AS combined_score
    FROM
      track t
    JOIN
      track_artist_connector tac ON t.id = tac.track_id
    JOIN
      artist a ON tac.artist_id = a.id
    ORDER BY
      combined_score DESC
    LIMIT
      50;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
