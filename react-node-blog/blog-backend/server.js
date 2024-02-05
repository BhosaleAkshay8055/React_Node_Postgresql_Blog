const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const multer = require('multer');  


const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
    // user: 'postgres',
    host: 'localhost',
    database: 'blog',
    // password: 'Akshay@123',
    port: 5432,
});

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url, req.body);
    next();
});



// Create "users" Table if Not Exists
(async () => {
    try {
        const result = await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
        `);
        console.log('Table "users" has been created if not exists');
    } catch (error) {
        console.error('Error creating "users" table:', error);
    }
})();

// Create "blogs" Table if Not Exists
(async () => {
    try {
        const result = await pool.query(`
            CREATE TABLE IF NOT EXISTS blogs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) UNIQUE NOT NULL,
                content TEXT NOT NULL,
                image BYTEA
            );
        `);
        console.log('Table "blogs" has been created if not exists');
    } catch (error) {
        console.error('Error creating "blogs" table:', error);
    }
})();


// API routes

// Get all blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blogs');
        const blogs = result.rows;
        // console.log('Proccessing request')
        res.json(blogs);
        // console.log('Success: ', blogs)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new blog
app.post('/api/blogsadd', upload.single('image'), async (req, res) => {
    const { title, content } = req.body;

    try {
        // Get the file buffer from multer
        const imageBuffer = req.file.buffer;

        const result = await pool.query('INSERT INTO blogs (title, content, image) VALUES ($1, $2, $3) RETURNING *', [title, content, imageBuffer]);
        const newBlog = result.rows[0];
        res.json(newBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Delete a blog by ID
app.delete('/api/blogs/:id', async (req, res) => {
    const blogId = req.params.id;

    try {
        // Check if the blog with the given ID exists
        const existingBlog = await pool.query('SELECT * FROM blogs WHERE id = $1', [blogId]);

        if (existingBlog.rows.length === 0) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Delete the blog from the database
        await pool.query('DELETE FROM blogs WHERE id = $1', [blogId]);

        console.log('Blog deleted successfully')
        
        res.json({ message: 'Blog deleted successfully' });
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
       
        // console.log('Executing query:', 'SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        const user = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        // console.log('User query result:', user.rows);
        
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
