const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 5000; // You can use any port you prefer

app.use(express.json());

// Set up PostgreSQL connection parameters
const dbConfig = {
  host: 'localhost',
  database: 'blog',
  // password: 'your_password',
  port: 5432, // default PostgreSQL port
};

// SQL query to create a table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100),
    password VARCHAR(100)
  );
`;

// Function to create the 'users' table
const createTable = async () => {
  const client = new Client(dbConfig);

  try {
    // Connect to the PostgreSQL server
    await client.connect();

    // Execute the query to create the table
    const result = await client.query(createTableQuery);
    console.log('Table created successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    // Close the connection
    await client.end();
  }
};

// Create the 'users' table when the server starts
createTable();

// API endpoint to add data to the 'users' table
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  console.log('Get user register request!');

  // Validate the request data
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const client = new Client(dbConfig);

  try {
    // Connect to the PostgreSQL server
    await client.connect();

    // SQL query to insert data into the 'users' table
    const insertUserQuery = `
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING *;
    `;

    // Execute the query to insert data
    const result = await client.query(insertUserQuery, [email, password]);
    console.log('Data inserted successfully!');
    res.status(200).json({ message: 'User created successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the connection
    await client.end();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
