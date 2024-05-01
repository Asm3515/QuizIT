-- Create the URL table
CREATE TABLE URL (
  Track VARCHAR(255) PRIMARY KEY,
  Spotify_url VARCHAR(255),
  Youtube_url VARCHAR(255)
);

-- Create the Statistic table
CREATE TABLE Statistic (
  Track VARCHAR(255) PRIMARY KEY,
  Danceability FLOAT,
  Energy FLOAT,
  Key INT,
  Loudness FLOAT,
  Speechiness FLOAT,
  Acousticness FLOAT,
  Instrumentalness FLOAT,
  Liveness FLOAT,
  Valence FLOAT,
  Tempo FLOAT,
  Duration_ms INT
);

-- Create the Song table
CREATE TABLE Song (
  Track VARCHAR(255) PRIMARY KEY,
  Artist VARCHAR(255),
  Title VARCHAR(255),
  Likes INT,
  Comments INT,
  Description TEXT,
  Licensed BOOLEAN,
  official_video BOOLEAN,
  Stream VARCHAR(255),
  FOREIGN KEY (Track) REFERENCES URL(Track)
);

-- Create the User table
CREATE TABLE Users (
  Username VARCHAR(255) PRIMARY KEY,
  Email VARCHAR(255) UNIQUE,
  Password VARCHAR(255),
  Phonenumber VARCHAR(255),
  Address TEXT,
  Last_10_songs_played TEXT[]  -- This can be an array of track IDs
);

-- Create the Playlist table
CREATE TABLE Playlist (
  Username VARCHAR(255),
  Playlist_Number INT,
  Song_name VARCHAR(255),
  FOREIGN KEY (Username) REFERENCES Users(Username),
  PRIMARY KEY (Username, Playlist_Number)  -- Composite primary key for Username and Playlist_Number
);
