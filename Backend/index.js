const express = require('express')
const playlistRoutes = require('./Routes/PlaylistRoutes')
const songRoutes = require('./Routes/SongRoutes')
const cors = require('cors')
const bodyParser = require('body-parser')
const { Pool } = require('pg')
const PORT = 3001
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require("jsonwebtoken");
const localStorage = require('localStorage');

const secrets = require('./secrets');

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

app.use('/api/playlists', playlistRoutes);
app.use('/api/songs', songRoutes);

async function setAccessToken() {

  const requestBody = new URLSearchParams();
  requestBody.append('grant_type', 'client_credentials');
  requestBody.append('client_id', secrets.spotifyClientId);
  requestBody.append('client_secret', secrets.spotifyClientSecret);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      "Content-Type": 'application/x-www-form-urlencoded'
    },
    body: requestBody
  });

  const data = await response.json();

  localStorage.setItem('access_token', data['access_token']);
}

setAccessToken();

app.get('/', (req, res) => {
  res.send("Welcome to Metamusic")
})

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if the Email already exists
    const userExistsQuery = 'SELECT * FROM public.user u WHERE u.email = $1';
    const userExistsResult = await pool.query(userExistsQuery, [email]);
    if (userExistsResult.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists, try logging in' });
    }

    // Create Random UUID
    const userId = crypto.randomUUID();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertUserQuery = 'INSERT INTO public.user (id, name, email, password_hash) VALUES ($1, $2, $3, $4)';
    await pool.query(insertUserQuery, [userId, name, email, hashedPassword]);

    res.status(201).json({ userId: userId, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve user from the database
    const getUserQuery = 'SELECT * FROM public.user u WHERE u.email = $1';
    const getUserResult = await pool.query(getUserQuery, [email]);
    const user = getUserResult.rows[0];

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid Password' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: email }, 'your_secret_key');

    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.delete("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Delete the user from the database
    const deleteUserQuery = 'DELETE FROM public.user u WHERE u.email = $1';
    await pool.query(deleteUserQuery, [email]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/top-ten-popular-songs', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT t.title AS title,t.album AS album,t.release_date AS release_date,a.name AS artist
      FROM track t
      LEFT JOIN track_artist_connector tac ON t.id=tac.track_id
      LEFT JOIN artist a ON a.id=tac.artist_id
      ORDER BY t.popularity DESC
      LIMIT 10;
    `);
    let access_token = localStorage.getItem('access_token');
    // await Promise.all(rows.map(async (row,index) => {
    //   //Get Album Art of The Songs
    //   const searchParams = new URLSearchParams({ q: row.album, type: "album", limit:1,offset:0 });
    //   const search_url=new URL(`https://api.spotify.com/v1/search?${searchParams}`);

    //   const response = await fetch(search_url.href, {
    //     headers: {
    //       "Authorization": 'Bearer ' + access_token
    //     }
    //   });
    //   const data = await response.json();
    //   rows[index]['album_art_url']=data['albums']['items'][0]['images'][0]['url'];
    //   rows[index]['album_url']=data['albums']['items'][0]['external_urls']['spotify'];
    // }));
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
    let access_token = localStorage.getItem('access_token');
    // await Promise.all(rows.map(async (row,index) => {
    //   //Get Artist image of All the Artists
    //   const searchParams = new URLSearchParams({ q: row.artist_name, type: "artist", limit:2,offset:0 });
    //   const search_url=new URL(`https://api.spotify.com/v1/search?${searchParams}`);

    //   const response = await fetch(search_url.href, {
    //     headers: {
    //       "Authorization": 'Bearer ' + access_token
    //     }
    //   });
    //   const data = await response.json();
    //   rows[index]['artist_image_url']=data['artists']['items'][0]['images'][0]['url'];
    //   rows[index]['artist_url']=data['artists']['items'][0]['external_urls']['spotify'];
    // }));
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

app.post("/user/:userId/favourite-track/:trackId", async (req, res) => {
  try {
    const trackId = req.params.trackId;
    const userId = req.params.userId;
    // Check if user exists
    const userExistsQuery = 'SELECT * FROM public.user u WHERE u.id = $1';
    const userExistsResult = await pool.query(userExistsQuery, [userId]);
    if (userExistsResult.rows.length === 0) {
      return res.status(404).json({ error: 'User doesnot exist' });
    }

    // Check if track exists
    const trackExistsQuery = 'SELECT * FROM public.track t WHERE t.id = $1';
    const trackExistsResult = await pool.query(trackExistsQuery, [trackId]);
    if (trackExistsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Track doesnot exist' });
    }

    const insertQuery = 'INSERT INTO public.user_track_connector (user_id, track_id) VALUES ($1, $2)';
    await pool.query(insertQuery, [userId, trackId]);

    res.status(201).json({ userId: userId, message: 'User favourited the song successfully' });
  } catch (error) {
    console.error('Error favouriting the song:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get("/user/:userId/favourite-tracks", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if user exists
    const userExistsQuery = 'SELECT * FROM public.user u WHERE u.id = $1';
    const userExistsResult = await pool.query(userExistsQuery, [userId]);
    if (userExistsResult.rows.length === 0) {
      return res.status(404).json({ error: 'User doesnot exist' });
    }

    const { rows } = await pool.query(`
    select 
        t.id AS track_id,
        t.title,
        t.duration_in_ms,
        t.album,
        t.track_number,
        t.popularity,
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
    JOIN 
        user_track_connector utc ON utc.track_id = t.id
`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error favouriting the song:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.delete("/user/:userId/favourite-track/:trackId", async (req, res) => {
  try {
    const trackId = req.params.trackId;
    const userId = req.params.userId;
    // Check if user exists
    const userExistsQuery = 'SELECT * FROM public.user u WHERE u.id = $1';
    const userExistsResult = await pool.query(userExistsQuery, [userId]);
    if (userExistsResult.rows.length === 0) {
      return res.status(404).json({ error: 'User doesnot exist' });
    }

    // Check if track exists
    const trackExistsQuery = 'SELECT * FROM public.track t WHERE t.id = $1';
    const trackExistsResult = await pool.query(trackExistsQuery, [trackId]);
    if (trackExistsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Track doesnot exist' });
    }

    const deleteQuery = `DELETE FROM public.user_track_connector
    WHERE user_id = $1 AND track_id = $2`;
    await pool.query(deleteQuery, [userId, trackId]);

    res.status(200).json({ userId: userId, message: 'User unfavourited the song successfully' });
  } catch (error) {
    console.error('Error unfavouriting the song:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get("/track/search/:searchTerm", async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm.replace(/ /g, "%");
    const { rows } = await pool.query(`
    select 
        t.id AS track_id,
        t.title,
        t.duration_in_ms,
        t.album,
        t.track_number,
        t.popularity,
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
        t.title ilike '%${searchTerm}%'
    ORDER BY
        t.popularity DESC
`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
