#!/usr/bin/env node
/**
 * The Buzzer - Live Sports Commentary API
 * Optimized for production performance
 */

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');
const NodeCache = require('node-cache');

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

// Database configuration with connection pooling
const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'buzzer',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 3306,
    connectionLimit: 20,
    acquireTimeout: 60000,
    timeout: 60000
};

// Connection pool for better performance
let pool;

// Cache for frequently accessed data
const cache = new NodeCache({ stdTTL: 300 }); // 5 minute cache

/**
 * Initialize database connection pool
 */
function initializeDatabase() {
    pool = mysql.createPool(DB_CONFIG);
    logger.info('Database connection pool initialized');
}

/**
 * Get database connection from pool
 */
function getDbConnection() {
    return pool;
}

/**
 * Initialize database tables
 */
async function createTables() {
    const connection = getDbConnection();

    try {
        // Games table with proper indexing
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS games (
                id INT AUTO_INCREMENT PRIMARY KEY,
                home_team VARCHAR(100) NOT NULL,
                away_team VARCHAR(100) NOT NULL,
                game_date DATETIME NOT NULL,
                status VARCHAR(20) DEFAULT 'upcoming',
                home_score INT DEFAULT 0,
                away_score INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_game_date (game_date),
                INDEX idx_status (status)
            )
        `);

        // Commentary table with proper indexing
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS commentary (
                id INT AUTO_INCREMENT PRIMARY KEY,
                game_id INT NOT NULL,
                message TEXT NOT NULL,
                timestamp DATETIME NOT NULL,
                event_type VARCHAR(50) DEFAULT 'play',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (game_id) REFERENCES games(id),
                INDEX idx_game_timestamp (game_id, timestamp),
                INDEX idx_event_type (event_type)
            )
        `);

        logger.info("Database tables created successfully");
        return true;
    } catch (error) {
        logger.error(`Failed to create tables: ${error.message}`);
        return false;
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
 * Get all games - Optimized with caching
 */
app.get('/api/games', async (req, res) => {
    const cacheKey = 'all_games';
    const cachedGames = cache.get(cacheKey);
    
    if (cachedGames) {
        return res.json({ games: cachedGames });
    }

    const connection = getDbConnection();

    try {
        // Optimized query with proper indexing
        const [games] = await connection.execute(`
            SELECT g.*, COUNT(c.id) as commentary_count 
            FROM games g 
            LEFT JOIN commentary c ON g.id = c.game_id 
            GROUP BY g.id 
            ORDER BY g.game_date DESC
            LIMIT 50
        `);

        // Convert datetime objects to ISO strings
        const formattedGames = games.map(game => ({
            ...game,
            game_date: game.game_date ? game.game_date.toISOString() : null,
            created_at: game.created_at ? game.created_at.toISOString() : null
        }));

        // Cache the results
        cache.set(cacheKey, formattedGames);
        
        res.json({ games: formattedGames });
    } catch (error) {
        logger.error(`Failed to fetch games: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

/**
 * Get commentary for a game - Optimized with pagination and caching
 */
app.get('/api/games/:gameId/commentary', async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const cacheKey = `commentary_${gameId}_${limit}_${offset}`;
    const cachedCommentary = cache.get(cacheKey);
    
    if (cachedCommentary) {
        return res.json({ commentary: cachedCommentary });
    }

    const connection = getDbConnection();

    try {
        // Optimized query with pagination
        const [commentary] = await connection.execute(`
            SELECT * FROM commentary 
            WHERE game_id = ? 
            ORDER BY timestamp DESC
            LIMIT ? OFFSET ?
        `, [gameId, limit, offset]);

        // Convert datetime objects to ISO strings
        const formattedCommentary = commentary.map(comment => ({
            ...comment,
            timestamp: comment.timestamp ? comment.timestamp.toISOString() : null,
            created_at: comment.created_at ? comment.created_at.toISOString() : null
        }));

        // Cache the results (shorter TTL for real-time data)
        cache.set(cacheKey, formattedCommentary, 60); // 1 minute cache
        
        res.json({ commentary: formattedCommentary });
    } catch (error) {
        logger.error(`Failed to fetch commentary: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch commentary' });
    }
});

/**
 * Add new commentary - Optimized with cache invalidation
 */
app.post('/api/games/:gameId/commentary', async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    const { message, event_type = 'play' } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const connection = getDbConnection();

    try {
        const [result] = await connection.execute(`
            INSERT INTO commentary (game_id, message, timestamp, event_type)
            VALUES (?, ?, ?, ?)
        `, [gameId, message, new Date(), event_type]);

        // Invalidate related caches
        const keys = cache.keys();
        keys.forEach(key => {
            if (key.includes(`commentary_${gameId}`) || key === 'stats') {
                cache.del(key);
            }
        });

        res.status(201).json({
            success: true,
            commentary_id: result.insertId
        });
    } catch (error) {
        logger.error(`Failed to add commentary: ${error.message}`);
        res.status(500).json({ error: 'Failed to add commentary' });
    }
});

/**
 * Get API stats - Optimized with aggressive caching
 */
app.get('/api/stats', async (req, res) => {
    const cacheKey = 'stats';
    const cachedStats = cache.get(cacheKey);
    
    if (cachedStats) {
        return res.json(cachedStats);
    }

    const connection = getDbConnection();

    try {
        // Run queries in parallel for better performance
        const [totalGamesResult, totalCommentaryResult, eventStats] = await Promise.all([
            connection.execute('SELECT COUNT(*) as total_games FROM games'),
            connection.execute('SELECT COUNT(*) as total_commentary FROM commentary'),
            connection.execute(`
                SELECT event_type, COUNT(*) as count 
                FROM commentary 
                GROUP BY event_type
            `)
        ]);

        const stats = {
            total_games: totalGamesResult[0][0].total_games,
            total_commentary: totalCommentaryResult[0][0].total_commentary,
            event_breakdown: eventStats[0],
            timestamp: new Date().toISOString()
        };

        // Cache for 10 minutes since stats don't change frequently
        cache.set(cacheKey, stats, 600);
        
        res.json(stats);
    } catch (error) {
        logger.error(`Failed to fetch stats: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch stats' });
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
        // Initialize database connection pool
        initializeDatabase();
        
        // Initialize database tables
        await createTables();
        
        // Start the server with optimized performance
        app.listen(PORT, '0.0.0.0', () => {
            logger.info(`The Buzzer API is running on port ${PORT}`);
            logger.info('Server optimized for production performance');
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