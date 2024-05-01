import psycopg2
from psycopg2 import sql
import csv

# Database connection parameters
dbname = "Metamusic"
user = "postgres"
password = "King@1397"
host = "localhost"
port = "5432"

# CSV file name
csv_file_name = "Spotify_Youtube.csv"

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

            # Insert each non-empty row into their respective database tables

            # insert_query = f"INSERT INTO URL VALUES (\'{row['Track']}\',\'{row['Url_spotify']}\',\'{row['Url_youtube']}\')"
            # cur.execute(insert_query)
            cur.execute("INSERT INTO URL VALUES (%s,%s,%s) ON CONFLICT (Track) DO NOTHING;",(row['Track'],row['Url_spotify'],row['Url_youtube']))

            # insert_query = f"INSERT INTO Statistic VALUES (\'{row['Track']}\',{row['Danceability']},{row['Energy']},{row['Key']},{row['Loudness']},{row['Speechiness']},{row['Acousticness']},{row['Instrumentalness']},{row['Liveness']},{row['Valence']},{row['Tempo']},{row['Duration_ms']})"
            # cur.execute(insert_query)
            cur.execute("INSERT INTO Statistic VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT (Track) DO NOTHING;",(row['Track'],float(row['Danceability']),float(row['Energy']),int(float(row['Key'])),float(row['Loudness']),float(row['Speechiness']),float(row['Acousticness']),float(row['Instrumentalness']),float(row['Liveness']),float(row['Valence']),float(row['Tempo']),int(float(row['Duration_ms']))))

            # insert_query = f"INSERT INTO Song VALUES (\'{row['Track']}\',\'{row['Artist']}\',\'{row['Title']}\',{row['Likes']},{row['Comments']},\'{row['Description']}\',\'{row['Licensed']}\',\'{row['official_video']}\',\'{row['Stream']}\')"
            # cur.execute(insert_query)
            cur.execute("INSERT INTO Song VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT (Track) DO NOTHING;",(row['Track'],row['Artist'],row['Title'],int(float(row['Likes'])),int(float(row['Comments'])),row['Description'],row['Licensed'],row['official_video'],row['Stream']))

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
