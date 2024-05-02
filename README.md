# MetaMusic

MetaMusic is a comprehensive open-source music database project aimed at creating a centralized platform for storing, organizing, and accessing music-related information. The project encompasses features such as artist profiles, album and track listings, genre classification, and lyrics integration. Leveraging modern technologies, MetaMusic aims to provide an intuitive user interface for users to upload, discover music, and also view analytics related to music and artists.

## Tech Stack
Database: <b>PostgreSQL</b> <br>
Scripting: <b> Python </b> <br>
Backend: <b> Express.js </b> <br>
Frontend: <b> HTML + CSS + React.js </b> <br>
API Testing: <b> Postman </b> <br>
Data Source: <b> Kaggle (https://www.kaggle.com/datasets/nicolasfierro/spotify-1986-2023) </b><br>

## Database Schema


## Setup
1. Create the database by running the <b>./Database/create_db.sql</b>
2. Run the Python script <b>./Database/populate_db.py</b> to populate the database with the data present in the <b>./Database/datos_merged_1986_2023.csv</b>
3. If there are any import errors in the Python script, use PIP to install the necessary dependency libraries (psycopg2, csv, uuid).
4. Run the backend application by running <b>node ./Backend/index.js</b>
5. 



## Authors
<b>Aditya Ramesh<br>
Ajinkya Shekhar More<br>
Sumedh Kumar Manoor Surendranth<br></b>
 
