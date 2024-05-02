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
  database: 'Metamusic',
  password: 'King@1397',
  port: 5432,
});

module.exports = pool;

//Including Routes
app.use('/api/users', userRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/songs', songRoutes);

app.get('/', (req, res) => {
  res.send("Welcome to Metamusic")
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
    const genre = req.params.genre;
    const { rows } = await pool.query(`
      SELECT t.*,
      a.name AS artist_name,
      g.name AS genre_name
      FROM track t
      JOIN track_artist_connector tac ON t.id = tac.track_id
      JOIN artist a ON tac.artist_id = a.id
      JOIN track_genre_connector tgc ON tgc.track_id = t.id
      JOIN genre g ON g.id = tgc.genre_id
      WHERE g.name like '%${genre}%'
      ORDER BY t.popularity DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/top-ten-popular-songs/artist/:artistId', async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const { rows } = await pool.query(`
      SELECT t.*,     
      a.name AS artist_name,
      g.name AS genre_name
      FROM track t
      JOIN track_genre_connector tgc ON tgc.track_id = t.id
      JOIN genre g ON g.id = tgc.genre_id
      JOIN track_artist_connector tac ON tac.track_id = t.id
      JOIN artist a ON a.id = tac.artist_id
      WHERE a.id = '${artistId}'
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
    select
    t.id as track_id,
    t.title,
    t.duration_in_ms,
    t.album,
    t.track_number,
    t.popularity,
    a.name as artist_name,
    ((0.35 * t.energy) + (0.25 * t.tempo) + (0.2 * t.danceability) + (0.15 * t.valence) + (0.05 * t.loudness) + t.popularity) as combined_score
  from
    track t
  join
        track_artist_connector tac on
    t.id = tac.track_id
  join
        artist a on
    tac.artist_id = a.id
  order by
    combined_score desc
  limit
        50;
  
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/best-melancholic-songs', async (req, res) => {
  try {
    const { rows } = await pool.query(`
    SELECT
    t.id AS track_id,
    t.title,
    t.duration_in_ms,
    t.album,
    t.track_number,
    t.popularity,
    a.name AS artist_name,
    ((0.3 * (1 - t.tempo)) + (0.5 * t.valence) + (0.2 * (1 - energy))) AS combined_score
FROM
    track t
JOIN
    track_artist_connector tac ON t.id = tac.track_id
JOIN
    artist a ON tac.artist_id = a.id
ORDER BY
    combined_score asc,
    t.popularity desc
LIMIT
    50;
  
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/top-charts/year/:year', async (req, res) => {
  try {
    const year = req.params.year;
    const { rows } = await pool.query(`
    SELECT
    t.id AS track_id,
    t.title,
    t.album,
    t.duration_in_ms,
    t.track_number,
    t.popularity,
    t.release_date,
    g.name AS genre_name,
    a.name AS artist_name
FROM
    track t
JOIN
    track_artist_connector tac ON t.id = tac.track_id
JOIN
    artist a ON tac.artist_id = a.id
JOIN 
    track_genre_connector tgc ON tgc.track_id = t.id
JOIN 
    genre g ON g.id = tgc.genre_id
WHERE
    t.release_date >= '${year}-01-01'
    AND t.release_date < '${year + 1}-01-01'
ORDER BY
    t.popularity desc
limit 50;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/best-dance-songs', async (req, res) => {
  try {
    const { rows } = await pool.query(`
    SELECT
    t.id AS track_id,
    t.title,
    t.duration_in_ms,
    t.album,
    t.track_number,
    t.popularity,
    a.name AS artist_name,
    (0.3 * t.danceability) + (0.2 * t.energy) + (0.25 * t.tempo) + (0.25 * t.valence) AS combined_score
FROM
    track t
JOIN
    track_artist_connector tac ON t.id = tac.track_id
JOIN
    artist a ON tac.artist_id = a.id
JOIN 
    track_genre_connector tgc ON tgc.track_id = t.id
JOIN 
    genre g ON g.id = tgc.genre_id
WHERE
    g.name like '%dance%'
ORDER BY
    combined_score desc,
    t.popularity desc
LIMIT
    50;
  
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/best-romantic-songs', async (req, res) => {
  try {
    const { rows } = await pool.query(`
    SELECT
    t.id AS track_id,
    t.title,
    t.duration_in_ms,
    t.album,
    t.track_number,
    t.popularity,
    a.name AS artist_name,
    (0.2 * (1 - t.energy)) + (0.2 * (1 - t.tempo)) + (0.6 * t.valence) AS combined_score
FROM
    track t
JOIN
    track_artist_connector tac ON t.id = tac.track_id
JOIN
    artist a ON tac.artist_id = a.id
JOIN 
    track_genre_connector tgc ON tgc.track_id = t.id
JOIN 
    genre g ON g.id = tgc.genre_id
ORDER BY
    combined_score desc,
    t.popularity desc
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
