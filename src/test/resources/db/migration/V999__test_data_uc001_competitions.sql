-- Test data for UC-001: Manage Competitions
-- Using IDs 1-999 which are reserved for test data (production starts at 1000)

-- Insert test competitions
INSERT INTO competition (id, name, date, location, status) VALUES
(1, 'Spring Athletics Championship 2025', '2025-06-15', 'Zurich Stadium', 'PLANNED'),
(2, 'Summer Track Meet 2025', '2025-07-20', 'Bern Arena', 'PLANNED'),
(3, 'Autumn Regional Competition 2024', '2024-09-10', 'Geneva Sports Center', 'COMPLETED');

-- Insert test club for result testing
INSERT INTO club (id, name, abbreviation, location) VALUES
(1, 'Test Athletics Club', 'TAC', 'Zurich');

-- Insert test categories for competition with results
INSERT INTO category (id, competition_id, name, gender, year_from, year_to) VALUES
(1, 3, 'Men U20', 'MALE', 2005, 2006);

-- Insert test event
INSERT INTO event (id, category_id, name, type, unit) VALUES
(1, 1, '100m Sprint', 'TRACK', 'seconds');

-- Insert test athlete
INSERT INTO athlete (id, club_id, category_id, first_name, last_name, birth_year, gender) VALUES
(1, 1, 1, 'John', 'Doe', 2005, 'MALE');

-- Insert test result (to test deletion warning for competition with results)
INSERT INTO result (id, athlete_id, event_id, competition_id, performance_value, points, rank) VALUES
(1, 1, 1, 3, 11.25, 850, 1);