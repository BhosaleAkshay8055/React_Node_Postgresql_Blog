const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Create SQLite database instance
const db = new sqlite3.Database('blog.db');

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
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `);

    console.log('Table "users" has been created if not exists');
});

// Create "blogs" Table if Not Exists
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS blogs (
            id INTEGER PRIMARY KEY,
            title TEXT UNIQUE NOT NULL,
            content TEXT NOT NULL,
            image BLOB
        );
    `);

    console.log('Table "blogs" has been created if not exists');
});

// API routes

// Get all blogs
app.get('/api/blogs', (req, res) => {
    db.all('SELECT * FROM blogs', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json(rows);
        }
    });
});

// Create a new blog
app.post('/api/blogsadd', upload.single('image'), (req, res) => {
    const { title, content } = req.body;

    // Get the file buffer from multer
    const imageBuffer = req.file.buffer;

    db.run('INSERT INTO blogs (title, content, image) VALUES (?, ?, ?)', [title, content, imageBuffer], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        } else {
            const newBlogId = this.lastID;
            res.json({ id: newBlogId, title, content });
        }
    });
});

// Delete a blog by ID
app.delete('/api/blogs/:id', (req, res) => {
    const blogId = req.params.id;

    db.run('DELETE FROM blogs WHERE id = ?', [blogId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        } else {
            console.log(`Blog with ID ${blogId} deleted successfully`);
            res.json({ message: 'Blog deleted successfully' });
        }
    });
});

// Register user
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;

    // Validate email and password (add your validation logic here)

    // Check if the email is already registered
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        } else if (row) {
            res.status(400).json({ error: 'Email is already registered' });
        } else {
            db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Server error' });
                } else {
                    const newUser = { id: this.lastID, email };
                    res.status(201).json({ message: 'User registered successfully', user: newUser });
                }
            });
        }
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Validate email and password (add your validation logic here)

    // Check if the user exists in the database
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        } else if (!row) {
            res.status(401).json({ error: 'Invalid email or password' });
        } else {
            console.log('Login successful');
            res.json({ message: 'Login successful' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
