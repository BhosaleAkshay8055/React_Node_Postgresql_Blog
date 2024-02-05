const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');  

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'blogdb',
    password: 'Akshay@123',
    port: 5433,
});

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url, req.body);
    next();
});


// API routes

// Get all blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blogs');
        const blogs = result.rows;
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new blog
app.post('/api/blogs', async (req, res) => {
    const { title, content } = req.body;

    try {
        const result = await pool.query('INSERT INTO blogs (title, content) VALUES ($1, $2) RETURNING *', [title, content]);
        const newBlog = result.rows[0];
        res.json(newBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Register user
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password (add your validation logic here)

        // Check if the email is already registered
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Save user data to the database
        const newUser = await pool.query(
            'INSERT INTO users(email, password) VALUES($1, $2) RETURNING email',
            [email, password]
        );

        // Send a verification email to the user (implement this separately)

        // Respond with a success message or appropriate status code
        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Server login request:', req.body);

        // Validate email and password (add your validation logic here)

        // Check if the user exists in the database
        // const user = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
       
        console.log('Executing query:', 'SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        const user = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        console.log('User query result:', user.rows);
        
        if (user.rows.length === 0) {
            console.log('Server 401 request:', user.rows);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Uncomment the following lines if you want to use JWT for authentication
        // const token = jwt.sign({ email: user.rows[0].email }, 'your_secret_key', { expiresIn: '1h' });
        // res.json({ message: 'Login successful', token }); 

        console.log('Login successful');
        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
