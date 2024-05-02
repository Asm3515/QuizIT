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
![metamusic - public](https://github.com/adeeteya/MetaMusic/assets/46561338/84e000af-8e38-46ab-b829-9c9a3eb3077c)

## Setup
1. Create the database by running the <b>./Database/create_db.sql</b>
2. Run the Python script <b>./Database/populate_db.py</b> to populate the database with the data present in the <b>./Database/datos_merged_1986_2023.csv</b>
3. If there are any import errors in the Python script, use PIP to install the necessary dependency libraries (psycopg2, csv, uuid).
4. Run the backend application by running <b>node ./Backend/index.js</b>
5. The server-side rendering is enabled and the homepage can be access at http://127.0.0.1:3001

## Authors
<b>Aditya Ramesh<br>
Ajinkya Shekhar More<br>
Sumedh Kumar Manoor Surendranth<br></b>
 
