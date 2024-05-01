-- public.artist definition

-- Drop table

-- DROP TABLE public.artist;

CREATE TABLE public.artist (
	id varchar NOT NULL,
	"name" varchar NOT NULL,
	image bytea NULL,
	details varchar NULL,
	CONSTRAINT artist_pk PRIMARY KEY (id)
);


-- public.emotion definition

-- Drop table

-- DROP TABLE public.emotion;

CREATE TABLE public.emotion (
	id varchar NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT emotion_pk PRIMARY KEY (id),
	CONSTRAINT emotion_unique UNIQUE (name)
);


-- public.genre definition

-- Drop table

-- DROP TABLE public.genre;

CREATE TABLE public.genre (
	id varchar NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT genre_pk PRIMARY KEY (id),
	CONSTRAINT genre_unique UNIQUE (name)
);


-- public.track definition

-- Drop table

-- DROP TABLE public.track;

CREATE TABLE public.track (
	id varchar NOT NULL,
	title varchar NOT NULL,
	duration_in_ms int8 NULL,
	album varchar NULL,
	track_number int4 NULL,
	popularity int4 NULL,
	explicit bool NULL,
	release_date date NULL,
	acousticness numeric NULL,
	danceability numeric NULL,
	energy numeric NULL,
	speechiness numeric NULL,
	instrumentalness numeric NULL,
	loundness numeric NULL,
	tempo numeric NULL,
	liveness numeric NULL,
	valence numeric NULL,
	url varchar NULL,
	album_art bytea NULL,
	audio bytea NULL,
	lyrics varchar NULL,
	info varchar NULL,
	CONSTRAINT track_pk PRIMARY KEY (id)
);


-- public."user" definition

-- Drop table

-- DROP TABLE public."user";

CREATE TABLE public."user" (
	id varchar NOT NULL,
	"name" varchar NOT NULL,
	email varchar NOT NULL,
	image bytea NULL,
	password_hash varchar NULL,
	verified bool NULL,
	CONSTRAINT user_pk PRIMARY KEY (id),
	CONSTRAINT user_unique UNIQUE (email)
);


-- public.playlist definition

-- Drop table

-- DROP TABLE public.playlist;

CREATE TABLE public.playlist (
	id varchar NOT NULL,
	"name" varchar NOT NULL,
	user_id varchar NOT NULL,
	CONSTRAINT playlist_pk PRIMARY KEY (id),
	CONSTRAINT fk_playlist_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id)
);


-- public.playlist_track_connector definition

-- Drop table

-- DROP TABLE public.playlist_track_connector;

CREATE TABLE public.playlist_track_connector (
	playlist_id varchar NOT NULL,
	track_id varchar NOT NULL,
	CONSTRAINT fk_playlist_track_connector_playlist_id FOREIGN KEY (playlist_id) REFERENCES public.playlist(id),
	CONSTRAINT fk_playlist_track_connector_track_id FOREIGN KEY (track_id) REFERENCES public.track(id)
);


-- public.track_artist_connector definition

-- Drop table

-- DROP TABLE public.track_artist_connector;

CREATE TABLE public.track_artist_connector (
	artist_id varchar NOT NULL,
	track_id varchar NOT NULL,
	CONSTRAINT fk_track_artist_connector_artist_id FOREIGN KEY (artist_id) REFERENCES public.artist(id),
	CONSTRAINT fk_track_artist_connector_track_id FOREIGN KEY (track_id) REFERENCES public.track(id)
);


-- public.track_emotion_connector definition

-- Drop table

-- DROP TABLE public.track_emotion_connector;

CREATE TABLE public.track_emotion_connector (
	track_id varchar NOT NULL,
	emotion_id varchar NOT NULL,
	CONSTRAINT fk_track_emotion_connector_emotion_id FOREIGN KEY (emotion_id) REFERENCES public.emotion(id),
	CONSTRAINT fk_track_emotion_connector_track_id FOREIGN KEY (track_id) REFERENCES public.track(id)
);


-- public.track_genre_connector definition

-- Drop table

-- DROP TABLE public.track_genre_connector;

CREATE TABLE public.track_genre_connector (
	track_id varchar NOT NULL,
	genre_id varchar NOT NULL,
	CONSTRAINT fk_track_genre_connector_genre_id FOREIGN KEY (genre_id) REFERENCES public.genre(id),
	CONSTRAINT fk_track_genre_connector_track_id FOREIGN KEY (track_id) REFERENCES public.track(id)
);


-- public.user_artist_connector definition

-- Drop table

-- DROP TABLE public.user_artist_connector;

CREATE TABLE public.user_artist_connector (
	user_id varchar NOT NULL,
	artist_id varchar NOT NULL,
	CONSTRAINT fk_user_artist_connector_artist_id FOREIGN KEY (artist_id) REFERENCES public.artist(id),
	CONSTRAINT fk_user_artist_connector_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id)
);


-- public.user_track_connector definition

-- Drop table

-- DROP TABLE public.user_track_connector;

CREATE TABLE public.user_track_connector (
	user_id varchar NOT NULL,
	track_id varchar NOT NULL,
	CONSTRAINT fk_user_track_connector_track_id FOREIGN KEY (track_id) REFERENCES public.track(id),
	CONSTRAINT fk_user_track_connector_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id)
);