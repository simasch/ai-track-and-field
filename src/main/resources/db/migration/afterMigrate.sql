-- afterMigrate.sql
-- This file runs after all migrations and is used to populate test data
-- Test data uses IDs 1-999 (sequences start at 1000 for production data)

-- Insert test competitions
INSERT INTO competition (id, name, date, location, status) VALUES
    (1, 'Spring Championship 2025', '2025-05-15', 'National Stadium, Zurich', 'PLANNED'),
    (2, 'Summer Athletics Meet', '2025-07-20', 'Olympic Park, Bern', 'PLANNED'),
    (3, 'Fall Track & Field Event', '2024-09-10', 'Regional Stadium, Basel', 'COMPLETED');

-- Insert test clubs
INSERT INTO club (id, name, abbreviation, location) VALUES
    (1, 'Zurich Athletic Club', 'ZAC', 'Zurich'),
    (2, 'Bern Sports Association', 'BSA', 'Bern'),
    (3, 'Basel Track Team', 'BTT', 'Basel');

-- Insert test categories for competitions
INSERT INTO category (id, competition_id, name, gender, year_from, year_to) VALUES
    (1, 1, 'Men U20', 'MALE', 2005, 2007),
    (2, 1, 'Women U20', 'FEMALE', 2005, 2007),
    (3, 2, 'Men Senior', 'MALE', 1900, 2005),
    (4, 3, 'Women Senior', 'FEMALE', 1900, 2005);

-- Insert test events for categories
INSERT INTO event (id, category_id, name, type, unit) VALUES
    (1, 1, '100m Sprint', 'TRACK', 'seconds'),
    (2, 1, 'Long Jump', 'FIELD', 'meters'),
    (3, 2, '100m Sprint', 'TRACK', 'seconds'),
    (4, 3, '400m Run', 'TRACK', 'seconds');

-- Insert test athletes
INSERT INTO athlete (id, club_id, category_id, first_name, last_name, birth_year, gender) VALUES
    (1, 1, 1, 'Max', 'Mueller', 2006, 'MALE'),
    (2, 2, 2, 'Anna', 'Schmidt', 2006, 'FEMALE'),
    (3, 3, 3, 'Peter', 'Zimmermann', 1998, 'MALE');

-- Insert test results (for competition 3 which is completed)
INSERT INTO result (id, athlete_id, event_id, competition_id, performance_value, points, rank) VALUES
    (1, 1, 1, 3, 10.85, 950, 1),
    (2, 2, 3, 3, 12.34, 880, 1),
    (3, 3, 4, 3, 48.92, 920, 1);
