require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

// API Routes
// Create a new project
app.post('/projects', (req, res) => {
    const { name, description, status } = req.body;
    const query = 'INSERT INTO projects (name, description, status) VALUES (?, ?, ?)';
    db.query(query, [name, description, status || 'pending'], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Project created', projectId: results.insertId });
    });
});

// Get all projects
app.get('/projects', (req, res) => {
    const query = 'SELECT * FROM projects';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a project by ID
app.get('/projects/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM projects WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Project not found' });
        res.json(results[0]);
    });
});

// Update a project
app.put('/projects/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const query = 'UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?';
    db.query(query, [name, description, status, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Project updated' });
    });
});

// Delete a project
app.delete('/projects/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM projects WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Project deleted' });
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});











//  npm run dev