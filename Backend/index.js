const express=require('express')
const userRoutes = require('./Routes/UserRoutes')
const playlistRoutes = require('./Routes/PlaylistRoutes')
const songRoutes = require('./Routes/SongRoutes')
const cors=require('cors')
const bodyParser = require('body-parser')
const { Pool } = require('pg')
const PORT=3001

const app=express()

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

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.get('/top-liked-songs', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT Track, Title, Likes
      FROM Song
      ORDER BY Likes DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching top liked songs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/top-streamed-songs', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT Track, Title, Stream
      FROM Song
      ORDER BY Stream DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching top streamed songs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/top-artists', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT Artist, 
             SUM(Likes) AS Total_Likes, 
             SUM(CAST(Stream AS BIGINT)) AS Total_Streams,
             SUM(Likes) + SUM(CAST(Stream AS BIGINT)) AS Combined_Score
      FROM Song
      GROUP BY Artist
      ORDER BY Combined_Score DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
