const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const localStorage = require('localStorage');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Metamusic',
  password: 'root',
  port: 5433,
});

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, phonenum, address } = req.body;

    // Check if the username or email already exists
    const userExistsQuery = 'SELECT * FROM Users WHERE Username = $1 OR Email = $2';
    const userExistsResult = await pool.query(userExistsQuery, [username, email]);
    if (userExistsResult.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertUserQuery = 'INSERT INTO Users (Username, Email, Password,Phonenumber ,Address) VALUES ($1, $2, $3, $4, $5)';
    await pool.query(insertUserQuery, [username, email, hashedPassword, phonenum, address]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Retrieve user from the database
    const getUserQuery = 'SELECT * FROM Users WHERE Username = $1';
    const getUserResult = await pool.query(getUserQuery, [username]);
    const user = getUserResult.rows[0];

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }


    // Generate JWT token
    const token = jwt.sign({ username: user.Username, email: user.Email }, 'your_secret_key');

    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { username } = req.params;

    // Delete the user from the database
    const deleteUserQuery = 'DELETE FROM Users WHERE Username = $1';
    await pool.query(deleteUserQuery, [username]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
