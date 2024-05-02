const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const localStorage = require('localStorage');
const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Metamusic',
  password: 'King@1397',
  port: 5432,
});

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the Email already exists
    const userExistsQuery = 'SELECT * FROM Users WHERE email = $1';
    const userExistsResult = await pool.query(userExistsQuery, [email]);
    if (userExistsResult.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists, try logging in' });
    }

    // Create Random UUID
    const userId = crypto.randomUUID();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertUserQuery = 'INSERT INTO Users (id, name, email, password) VALUES ($1, $2, $3, $4)';
    await pool.query(insertUserQuery, [userId, name, email, hashedPassword]);

    res.status(201).json({ userId: userId, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve user from the database
    const getUserQuery = 'SELECT * FROM Users WHERE email = $1';
    const getUserResult = await pool.query(getUserQuery, [email]);
    const user = getUserResult.rows[0];

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid Password' });
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
    const { email } = req.params;

    // Delete the user from the database
    const deleteUserQuery = 'DELETE FROM Users WHERE email = $1';
    await pool.query(deleteUserQuery, [email]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
