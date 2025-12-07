import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import postgres from 'postgres';
import { v4 as uuidv4 } from 'uuid';

// Load env vars from server/.env if running from root, or .env if running from server/
dotenv.config({ path: '../.env' });
dotenv.config(); // Also try default .env as fallback

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database connection
const connectionString = process.env.DATABASE_URL;
console.log("connection string", connectionString)
const sql = postgres(connectionString);

// Create tables if not exist
const initDb = async () => {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS celebrations (
        id TEXT PRIMARY KEY,
        recipient_name TEXT NOT NULL,
        message TEXT NOT NULL,
        flavor TEXT NOT NULL,
        created_at BIGINT NOT NULL
      )
    `;
        await sql`
      CREATE TABLE IF NOT EXISTS wishes (
        id TEXT PRIMARY KEY,
        celebration_id TEXT NOT NULL,
        name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        FOREIGN KEY (celebration_id) REFERENCES celebrations(id)
      )
    `;
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
        await sql`
      INSERT INTO celebrations (id, recipient_name, message, flavor, created_at)
      VALUES (${id}, ${recipientName}, ${message}, ${flavor}, ${createdAt})
    `;
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
        const result = await sql`SELECT * FROM celebrations WHERE id = ${id}`;
        if (result.length === 0) {
            return res.status(404).json({ error: 'Celebration not found' });
        }
        const row = result[0];
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
        await sql`
      INSERT INTO wishes (id, celebration_id, name, message, created_at)
      VALUES (${id}, ${celebrationId}, ${name}, ${message}, ${createdAt})
    `;
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
        const wishes = await sql`
      SELECT * FROM wishes WHERE celebration_id = ${celebrationId} ORDER BY created_at DESC
    `;
        const formattedWishes = wishes.map(row => ({
            id: row.id,
            celebrationId: row.celebration_id,
            name: row.name,
            message: row.message,
            createdAt: parseInt(row.created_at)
        }));
        res.json(formattedWishes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
