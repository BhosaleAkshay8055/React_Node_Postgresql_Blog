const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Create SQLite database instance
const db = new sqlite3.Database('blog.db');
// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to create database tables if they don't exist
const createTablesIfNotExists = () => {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY,
                title TEXT UNIQUE NOT NULL,
                content TEXT NOT NULL
            );
        `);

        console.log('Database tables created if not exists');
    });
};

// Call the middleware to create tables
createTablesIfNotExists();

app.use(bodyParser.json());
app.use(cors());

// JWT secret key
const JWT_SECRET = 'Akshay@123#bhosale.';

// Logged in users storage
let loggedInUsers = {};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Token is required' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = decoded;

        // Check if token is still valid
        if (!loggedInUsers[token]) {
            return res.status(401).json({ error: 'Token expired or user logged out' });
        }

        next();
    });
};

app.post('/api/register', (req, res) => {
    const { email, password } = req.body;

    // Check if the email already exists in the database
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.log('Server error')
            return res.status(500).json({ error: 'Server error' });
        }

        if (row) {
            // If the email already exists, return a response indicating the user is already registered
            console.log('User is already registered')
            return res.status(409).json({ error: 'User is already registered' });
        }

        // If the email does not exist, proceed with user registration
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.log('Server error')
                return res.status(500).json({ error: 'Server error' });
            }

            db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], function (err) {
                if (err) {
                    console.log('Server error-2')
                    return res.status(500).json({ error: 'Server error' });
                }

                const userId = this.lastID;
                console.log('User registered successfully')
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    });
});


// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log('logIn request: ', req.body)

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.log('Server error')
            return res.status(500).json({ error: 'Server error' });
        }

        if (!row) {
            console.log('Invalid email or password-1')
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        bcrypt.compare(password, row.password, (err, result) => {
            if (result) {
                const token = jwt.sign({ userId: row.id }, JWT_SECRET, { expiresIn: '1h' });
                loggedInUsers[token] = true; // Store token in loggedInUsers
                // Logout user after 1 minute
                setTimeout(() => {
                    delete loggedInUsers[token];
                }, 60000);
                console.log('Login successful')
                return res.json({ message: 'Login successful', token });
            } else {
                console.log('Invalid email or password-2')
                return res.status(401).json({ error: 'Invalid email or password' });
            }
        });
    });
});

// Protected route to get all blogs
app.get('/api/blogs', verifyToken, (req, res) => {
    db.all('SELECT * FROM blogs', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(rows);
    });
});

// Open route to get all blogs
app.get('/api/allblogs', (req, res) => {
    db.all('SELECT * FROM blogs', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(rows);
    });
});

// // Create a new blog (protected route)
// app.post('/api/blogs', verifyToken, (req, res) => {
//     // Your code to create a new blog
// });

// Create a new blog
app.post('/api/blogsadd', verifyToken, upload.single('image'), (req, res) => {
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
app.delete('/api/blogs/:id', verifyToken, (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
