#!/usr/bin/env node
/**
 * The Buzzer - Live Sports Commentary API
 * WARNING: This code has performance issues under load!
 */

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware setup
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic logging
const logger = {
    info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
    error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`)
};

// Database configuration
const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'buzzer',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 3306
};

/**
 * Get database connection - NO CONNECTION POOLING!
 * This creates a new connection for every request - terrible for performance!
 */
async function getDbConnection() {
    try {
        const connection = await mysql.createConnection(DB_CONFIG);
        return connection;
    } catch (error) {
        logger.error(`Database connection failed: ${error.message}`);
        return null;
    }
}

/**
 * Initialize database tables
 */
async function createTables() {
    const connection = await getDbConnection();
    if (!connection) {
        return false;
    }

    try {
        // Games table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS games (
                id INT AUTO_INCREMENT PRIMARY KEY,
                home_team VARCHAR(100) NOT NULL,
                away_team VARCHAR(100) NOT NULL,
                game_date DATETIME NOT NULL,
                status VARCHAR(20) DEFAULT 'upcoming',
                home_score INT DEFAULT 0,
                away_score INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Commentary table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS commentary (
                id INT AUTO_INCREMENT PRIMARY KEY,
                game_id INT NOT NULL,
                message TEXT NOT NULL,
                timestamp DATETIME NOT NULL,
                event_type VARCHAR(50) DEFAULT 'play',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (game_id) REFERENCES games(id)
            )
        `);

        logger.info("Database tables created successfully");
        return true;
    } catch (error) {
        logger.error(`Failed to create tables: ${error.message}`);
        return false;
    } finally {
        await connection.end();
    }
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'buzzer-api'
    });
});

/**
 * Get all games - INEFFICIENT QUERY!
 */
app.get('/api/games', async (req, res) => {
    // Simulate some processing delay - this adds up under load!
    await new Promise(resolve => setTimeout(resolve, 100));

    const connection = await getDbConnection();
    if (!connection) {
        return res.status(500).json({ error: 'Database connection failed' });
    }

    try {
        // NO INDEXING OR OPTIMIZATION!
        const [games] = await connection.execute(`
            SELECT g.*, COUNT(c.id) as commentary_count 
            FROM games g 
            LEFT JOIN commentary c ON g.id = c.game_id 
            GROUP BY g.id 
            ORDER BY g.game_date DESC
        `);

        // Convert datetime objects to ISO strings
        const formattedGames = games.map(game => ({
            ...game,
            game_date: game.game_date ? game.game_date.toISOString() : null,
            created_at: game.created_at ? game.created_at.toISOString() : null
        }));

        res.json({ games: formattedGames });
    } catch (error) {
        logger.error(`Failed to fetch games: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch games' });
    } finally {
        await connection.end();
    }
});

/**
 * Get commentary for a game - ANOTHER INEFFICIENT QUERY!
 */
app.get('/api/games/:gameId/commentary', async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    
    // More processing delay
    await new Promise(resolve => setTimeout(resolve, 50));

    const connection = await getDbConnection();
    if (!connection) {
        return res.status(500).json({ error: 'Database connection failed' });
    }

    try {
        // NO LIMIT, NO PAGINATION - FETCHES EVERYTHING!
        const [commentary] = await connection.execute(`
            SELECT * FROM commentary 
            WHERE game_id = ? 
            ORDER BY timestamp DESC
        `, [gameId]);

        // Convert datetime objects to ISO strings
        const formattedCommentary = commentary.map(comment => ({
            ...comment,
            timestamp: comment.timestamp ? comment.timestamp.toISOString() : null,
            created_at: comment.created_at ? comment.created_at.toISOString() : null
        }));

        res.json({ commentary: formattedCommentary });
    } catch (error) {
        logger.error(`Failed to fetch commentary: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch commentary' });
    } finally {
        await connection.end();
    }
});

/**
 * Add new commentary - NO RATE LIMITING!
 */
app.post('/api/games/:gameId/commentary', async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    const { message, event_type = 'play' } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const connection = await getDbConnection();
    if (!connection) {
        return res.status(500).json({ error: 'Database connection failed' });
    }

    try {
        const [result] = await connection.execute(`
            INSERT INTO commentary (game_id, message, timestamp, event_type)
            VALUES (?, ?, ?, ?)
        `, [gameId, message, new Date(), event_type]);

        res.status(201).json({
            success: true,
            commentary_id: result.insertId
        });
    } catch (error) {
        logger.error(`Failed to add commentary: ${error.message}`);
        res.status(500).json({ error: 'Failed to add commentary' });
    } finally {
        await connection.end();
    }
});

/**
 * Get API stats - VERY EXPENSIVE QUERY!
 */
app.get('/api/stats', async (req, res) => {
    const connection = await getDbConnection();
    if (!connection) {
        return res.status(500).json({ error: 'Database connection failed' });
    }

    try {
        // These queries are expensive and run every time!
        const [totalGamesResult] = await connection.execute('SELECT COUNT(*) as total_games FROM games');
        const totalGames = totalGamesResult[0].total_games;

        const [totalCommentaryResult] = await connection.execute('SELECT COUNT(*) as total_commentary FROM commentary');
        const totalCommentary = totalCommentaryResult[0].total_commentary;

        const [eventStats] = await connection.execute(`
            SELECT event_type, COUNT(*) as count 
            FROM commentary 
            GROUP BY event_type
        `);

        res.json({
            total_games: totalGames,
            total_commentary: totalCommentary,
            event_breakdown: eventStats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`Failed to fetch stats: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch stats' });
    } finally {
        await connection.end();
    }
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

/**
 * Start the server
 */
async function startServer() {
    try {
        // Initialize database
        await createTables();
        
        // Start the server - SINGLE PROCESS, NO CLUSTERING!
        app.listen(PORT, '0.0.0.0', () => {
            logger.info(`The Buzzer API is running on port ${PORT}`);
            logger.info('WARNING: This server has performance issues under load!');
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

startServer();