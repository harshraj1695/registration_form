const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // Make sure bcrypt is imported
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection setup
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "@Harsh1695",
  port: 5432,
});

pool.connect(err => {
  if (err) {
    console.error('Error connecting to PostgreSQL', err);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

// Handle form submission
app.post('/submit-form', async (req, res) => {
    const { first_name, last_name, my_email, my_password, country_code, my_phone, my_gender, address, city, state } = req.body;

    console.log('Received data:', req.body); // Log the incoming data

    try {
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(my_password, 10);

      const query = `
        INSERT INTO registrations (first_name, last_name, email, password, country_code, phone, gender, address, city, state)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id;
      `;
      const values = [first_name, last_name, my_email, hashedPassword, country_code, my_phone, my_gender, address, city, state];
      const result = await pool.query(query, values);

      console.log('Insert result:', result.rows[0]); // Log the result of the insert

      res.status(200).json({ message: 'Form submitted successfully', id: result.rows[0].id });
    } catch (err) {
      console.error('Error inserting data into PostgreSQL', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
