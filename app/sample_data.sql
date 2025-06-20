-- Sample data for testing The Buzzer API
-- Run this to populate the database with test data

INSERT INTO games (home_team, away_team, game_date, status, home_score, away_score) VALUES
('Lakers', 'Warriors', '2024-01-15 19:30:00', 'live', 98, 102),
('Celtics', 'Heat', '2024-01-15 20:00:00', 'upcoming', 0, 0),
('Bulls', 'Knicks', '2024-01-14 19:00:00', 'completed', 115, 108);

INSERT INTO commentary (game_id, message, timestamp, event_type) VALUES
(1, 'Game starts with Lakers winning the tip-off!', '2024-01-15 19:30:00', 'game_start'),
(1, 'LeBron James scores the first basket with a powerful dunk!', '2024-01-15 19:31:30', 'score'),
(1, 'Stephen Curry answers back with a three-pointer from downtown!', '2024-01-15 19:32:15', 'score'),
(1, 'Timeout called by Lakers coach as Warriors take early lead', '2024-01-15 19:35:00', 'timeout'),
(1, 'Warriors extend lead to 15 points with 2 minutes left in quarter', '2024-01-15 19:42:00', 'play'),
(3, 'Final buzzer! Bulls win in a thrilling overtime game!', '2024-01-14 22:15:00', 'game_end'),
(3, 'DeMar DeRozan with the game-winning shot!', '2024-01-14 22:14:45', 'score');