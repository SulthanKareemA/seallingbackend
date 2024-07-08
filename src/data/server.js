// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Untuk menangani request body dalam format JSON

// Koneksi ke database pertama (untuk mengambil data)
const db1 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sensor_db'
});

db1.connect((err) => {
    if (err) {
        console.error('Error connecting to sensor_db:', err);
        return;
    }
    console.log('Connected to sensor_db');
});

// Koneksi ke database kedua (untuk mengirim data)
const db2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'email_user'
});

db2.connect((err) => {
    if (err) {
        console.error('Error connecting to email_user:', err);
        return;
    }
    console.log('Connected to email_user');
});

// Endpoint untuk mengambil data dari database pertama
app.get('/api/data', (req, res) => {
    db1.query('SELECT * FROM ulrasonic', (error, results) => {
        if (error) {
            console.error('Error fetching data from sensor_db:', error);
            res.status(500).send('Error fetching data from sensor_db');
            return;
        }
        res.json(results);
    });
});

// Endpoint untuk mengirim data ke database kedua
app.post('/api/data', (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).send('Email is required');
        return;
    }
    db2.query('INSERT INTO data_user (email) VALUES (?)', [email], (error, results) => {
        if (error) {
            res.status(500).send('Error inserting data into email_user');
            return;
        }
        res.status(200).send('Data inserted successfully');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
