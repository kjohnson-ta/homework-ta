#!/usr/bin/env python3
"""
The Buzzer - Live Sports Commentary API
WARNING: This code has performance issues under load!
"""

import os
import time
import json
from datetime import datetime
from flask import Flask, jsonify, request
import mysql.connector
from mysql.connector import Error
import logging

app = Flask(__name__)

# Basic logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'buzzer'),
    'user': os.getenv('DB_USER', 'admin'),
    'password': os.getenv('DB_PASSWORD', 'password')
}

def get_db_connection():
    """Get database connection - NO CONNECTION POOLING!"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        logger.error(f"Database connection failed: {e}")
        return None

def create_tables():
    """Initialize database tables"""
    connection = get_db_connection()
    if not connection:
        return False
    
    try:
        cursor = connection.cursor()
        
        # Games table
        cursor.execute("""
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
        """)
        
        # Commentary table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS commentary (
                id INT AUTO_INCREMENT PRIMARY KEY,
                game_id INT NOT NULL,
                message TEXT NOT NULL,
                timestamp DATETIME NOT NULL,
                event_type VARCHAR(50) DEFAULT 'play',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (game_id) REFERENCES games(id)
            )
        """)
        
        connection.commit()
        logger.info("Database tables created successfully")
        return True
        
    except Error as e:
        logger.error(f"Failed to create tables: {e}")
        return False
    finally:
        connection.close()

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'buzzer-api'
    })

@app.route('/api/games')
def get_games():
    """Get all games - INEFFICIENT QUERY!"""
    # Simulate some processing delay
    time.sleep(0.1)  # This adds up under load!
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        # NO INDEXING OR OPTIMIZATION!
        cursor.execute("""
            SELECT g.*, COUNT(c.id) as commentary_count 
            FROM games g 
            LEFT JOIN commentary c ON g.id = c.game_id 
            GROUP BY g.id 
            ORDER BY g.game_date DESC
        """)
        games = cursor.fetchall()
        
        # Convert datetime objects to strings
        for game in games:
            if game['game_date']:
                game['game_date'] = game['game_date'].isoformat()
            if game['created_at']:
                game['created_at'] = game['created_at'].isoformat()
        
        return jsonify({'games': games})
        
    except Error as e:
        logger.error(f"Failed to fetch games: {e}")
        return jsonify({'error': 'Failed to fetch games'}), 500
    finally:
        connection.close()

@app.route('/api/games/<int:game_id>/commentary')
def get_commentary(game_id):
    """Get commentary for a game - ANOTHER INEFFICIENT QUERY!"""
    # More processing delay
    time.sleep(0.05)
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        # NO LIMIT, NO PAGINATION - FETCHES EVERYTHING!
        cursor.execute("""
            SELECT * FROM commentary 
            WHERE game_id = %s 
            ORDER BY timestamp DESC
        """, (game_id,))
        commentary = cursor.fetchall()
        
        # Convert datetime objects to strings
        for comment in commentary:
            if comment['timestamp']:
                comment['timestamp'] = comment['timestamp'].isoformat()
            if comment['created_at']:
                comment['created_at'] = comment['created_at'].isoformat()
        
        return jsonify({'commentary': commentary})
        
    except Error as e:
        logger.error(f"Failed to fetch commentary: {e}")
        return jsonify({'error': 'Failed to fetch commentary'}), 500
    finally:
        connection.close()

@app.route('/api/games/<int:game_id>/commentary', methods=['POST'])
def add_commentary(game_id):
    """Add new commentary - NO RATE LIMITING!"""
    data = request.get_json()
    
    if not data or 'message' not in data:
        return jsonify({'error': 'Message is required'}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO commentary (game_id, message, timestamp, event_type)
            VALUES (%s, %s, %s, %s)
        """, (
            game_id,
            data['message'],
            datetime.now(),
            data.get('event_type', 'play')
        ))
        connection.commit()
        
        return jsonify({
            'success': True,
            'commentary_id': cursor.lastrowid
        }), 201
        
    except Error as e:
        logger.error(f"Failed to add commentary: {e}")
        return jsonify({'error': 'Failed to add commentary'}), 500
    finally:
        connection.close()

@app.route('/api/stats')
def get_stats():
    """Get API stats - VERY EXPENSIVE QUERY!"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # These queries are expensive and run every time!
        cursor.execute("SELECT COUNT(*) as total_games FROM games")
        total_games = cursor.fetchone()['total_games']
        
        cursor.execute("SELECT COUNT(*) as total_commentary FROM commentary")
        total_commentary = cursor.fetchone()['total_commentary']
        
        cursor.execute("""
            SELECT event_type, COUNT(*) as count 
            FROM commentary 
            GROUP BY event_type
        """)
        event_stats = cursor.fetchall()
        
        return jsonify({
            'total_games': total_games,
            'total_commentary': total_commentary,
            'event_breakdown': event_stats,
            'timestamp': datetime.now().isoformat()
        })
        
    except Error as e:
        logger.error(f"Failed to fetch stats: {e}")
        return jsonify({'error': 'Failed to fetch stats'}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    # Initialize database
    create_tables()
    
    # Run the app - NOT PRODUCTION READY!
    app.run(host='0.0.0.0', port=5000, debug=True)  # Debug mode in production!