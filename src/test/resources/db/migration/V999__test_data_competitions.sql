-- Test data for competition management tests
-- Using IDs below 1000 to avoid conflicts with production sequences

-- Insert test competitions with various statuses
INSERT INTO competition (id, name, date, location, status) VALUES (1, 'Spring Athletics Championship', '2025-05-15', 'Berlin Stadium', 'PLANNED');
INSERT INTO competition (id, name, date, location, status) VALUES (2, 'Summer Track Meet', '2025-07-20', 'London Olympic Park', 'PLANNED');
INSERT INTO competition (id, name, date, location, status) VALUES (3, 'Autumn Field Events', '2024-10-10', 'Paris Arena', 'COMPLETED');
INSERT INTO competition (id, name, date, location, status) VALUES (4, 'Winter Indoor Championship', '2025-01-30', 'Munich Sports Hall', 'ONGOING');

-- Insert test clubs
INSERT INTO club (id, name, abbreviation, location) VALUES (1, 'Berlin Athletics Club', 'BAC', 'Berlin');
INSERT INTO club (id, name, abbreviation, location) VALUES (2, 'London Runners', 'LR', 'London');

-- Insert test categories for competitions
INSERT INTO category (id, competition_id, name, gender, year_from, year_to) VALUES (1, 1, 'Men U20', 'MALE', 2006, 2015);
INSERT INTO category (id, competition_id, name, gender, year_from, year_to) VALUES (2, 1, 'Women U20', 'FEMALE', 2006, 2015);
INSERT INTO category (id, competition_id, name, gender, year_from, year_to) VALUES (3, 3, 'Men Senior', 'MALE', 1900, 2005);

-- Insert test events
INSERT INTO event (id, category_id, name, type, unit) VALUES (1, 1, '100m Sprint', 'TRACK', 'seconds');
INSERT INTO event (id, category_id, name, type, unit) VALUES (2, 1, 'Long Jump', 'FIELD', 'meters');
INSERT INTO event (id, category_id, name, type, unit) VALUES (3, 3, 'Javelin Throw', 'FIELD', 'meters');

-- Insert test athletes
INSERT INTO athlete (id, club_id, category_id, first_name, last_name, birth_year, gender) VALUES (1, 1, 1, 'Max', 'Mueller', 2008, 'MALE');
INSERT INTO athlete (id, club_id, category_id, first_name, last_name, birth_year, gender) VALUES (2, 2, 2, 'Emma', 'Smith', 2007, 'FEMALE');
INSERT INTO athlete (id, club_id, category_id, first_name, last_name, birth_year, gender) VALUES (3, 1, 3, 'John', 'Doe', 1995, 'MALE');

-- Insert test results for the completed competition
INSERT INTO result (id, athlete_id, event_id, competition_id, performance_value, points, rank) VALUES (1, 3, 3, 3, 75.5, 850, 1);