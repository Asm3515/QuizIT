import psycopg2
from psycopg2 import sql
import csv
import uuid

# Database connection parameters
dbname = "metamusic"
user = "postgres"
password = "password"
host = "localhost"
port = "5432"

# CSV file name
csv_file_name = "datos_merged_1986_2023.csv"

try:
    # Connect to the database
    conn = psycopg2.connect(
        dbname=dbname,
        user=user,
        password=password,
        host=host,
        port=port
    )

    # Create a cursor
    cur = conn.cursor()

    # Open the CSV file and read its contents
    with open(csv_file_name, 'r', newline='', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            # Skip the row if any value in the row is empty
            if not all(row.values()):
                continue

            # Check if artists exist if not then add them to Artists Table
            artists=row['artists_names'].split(';')
            artist_id=None
            for artist in artists:
                cur.execute("SELECT id FROM artist WHERE name = %s",(artist,))
                artist_id=cur.fetchone()
                if artist_id is None:
                    artist_id=str(uuid.uuid4())
                    cur.execute("INSERT INTO artist (id,name) VALUES (%s,%s)",(artist_id,artist))
                    print(f"Inserted {artist} into the Artist Table")
                else:
                    artist_id=artist_id[0]

            # Check if genres exist if not then add them to Genre Table
            genres = row['artist_genres'].split(';')
            genre_id=None
            for genre in genres:
                cur.execute("SELECT id FROM genre WHERE name = %s", (genre,))
                genre_id = cur.fetchone()
                if genre_id is None:
                    genre_id = str(uuid.uuid4())
                    cur.execute(
                        "INSERT INTO genre (id,name) VALUES (%s,%s)", (genre_id, genre))
                    print(f"Inserted {genre} into the Genre Table")
                else:
                    genre_id = genre_id[0]

            # Add Track to the Track Table
            track_id=str(uuid.uuid4())
            cur.execute("INSERT INTO TRACK (id,title,duration_in_ms,album,track_number,popularity,explicit,release_date,acousticness,danceability,energy,speechiness,instrumentalness,loudness,tempo,liveness,valence) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);",(track_id,row['title'],int(row['duration_in_ms']),row['album'],int(row['track_number']),int(row['popularity']),row['explicit'],row['release_date'],float(row['acousticness']),float(row['danceability']),float(row['energy']),float(row['speechiness']),float(row['instrumentalness']),float(row['loudness']),float(row['tempo']),float(row['liveness']),float(row['valence'])))

            # Connect artist to track using track_artist_connector
            cur.execute("INSERT INTO track_artist_connector (artist_id,track_id) VALUES (%s,%s)",(artist_id,track_id))
            # Connect genre to track using track_genre_connector
            cur.execute("INSERT INTO track_genre_connector (track_id,genre_id) VALUES (%s,%s)",(track_id,genre_id))

    # Commit the transaction
    conn.commit()
    print("Data loaded successfully!")

except psycopg2.Error as e:
    print("Error:", e)

finally:
    # Close the cursor and connection
    if cur:
        cur.close()
    if conn:
        conn.close()
