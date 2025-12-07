require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'birthday_app',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Create tables if not exist
const initDb = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS celebrations (
        id TEXT PRIMARY KEY,
        recipient_name TEXT NOT NULL,
        message TEXT NOT NULL,
        flavor TEXT NOT NULL,
        created_at BIGINT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS wishes (
        id TEXT PRIMARY KEY,
        celebration_id TEXT NOT NULL,
        name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        FOREIGN KEY (celebration_id) REFERENCES celebrations(id)
      );
    `);
        console.log('Database initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initDb();

// Routes

// Create Celebration
app.post('/api/celebrations', async (req, res) => {
    const { recipientName, message, flavor } = req.body;
    const id = uuidv4();
    const createdAt = Date.now();

    try {
        await pool.query(
            'INSERT INTO celebrations (id, recipient_name, message, flavor, created_at) VALUES ($1, $2, $3, $4, $5)',
            [id, recipientName, message, flavor, createdAt]
        );
        res.json({ id, recipientName, message, flavor, createdAt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get Celebration
app.get('/api/celebrations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM celebrations WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Celebration not found' });
        }
        const row = result.rows[0];
        res.json({
            id: row.id,
            recipientName: row.recipient_name,
            message: row.message,
            flavor: row.flavor,
            createdAt: parseInt(row.created_at)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Add Wish
app.post('/api/wishes', async (req, res) => {
    const { celebrationId, name, message } = req.body;
    const id = uuidv4();
    const createdAt = Date.now();

    try {
        await pool.query(
            'INSERT INTO wishes (id, celebration_id, name, message, created_at) VALUES ($1, $2, $3, $4, $5)',
            [id, celebrationId, name, message, createdAt]
        );
        res.json({ id, celebrationId, name, message, createdAt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get Wishes
app.get('/api/wishes/:celebrationId', async (req, res) => {
    const { celebrationId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM wishes WHERE celebration_id = $1 ORDER BY created_at DESC',
            [celebrationId]
        );
        const wishes = result.rows.map(row => ({
            id: row.id,
            celebrationId: row.celebration_id,
            name: row.name,
            message: row.message,
            createdAt: parseInt(row.created_at)
        }));
        res.json(wishes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
