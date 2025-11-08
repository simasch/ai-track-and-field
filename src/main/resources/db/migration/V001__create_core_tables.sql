-- Create sequences for primary keys
-- Starting at 1000 to leave room for test data (1-999)
CREATE SEQUENCE competition_seq START WITH 1000;
CREATE SEQUENCE category_seq START WITH 1000;
CREATE SEQUENCE event_seq START WITH 1000;
CREATE SEQUENCE club_seq START WITH 1000;
CREATE SEQUENCE athlete_seq START WITH 1000;
CREATE SEQUENCE result_seq START WITH 1000;

-- Create enum types
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE');
CREATE TYPE event_type AS ENUM ('TRACK', 'FIELD');
CREATE TYPE competition_status AS ENUM ('PLANNED', 'ONGOING', 'COMPLETED');

-- Competition table
CREATE TABLE competition (
    id BIGINT PRIMARY KEY DEFAULT nextval('competition_seq'),
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    status competition_status NOT NULL DEFAULT 'PLANNED'
);

-- Club table
CREATE TABLE club (
    id BIGINT PRIMARY KEY DEFAULT nextval('club_seq'),
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(50) NOT NULL,
    location VARCHAR(255)
);

-- Category table
CREATE TABLE category (
    id BIGINT PRIMARY KEY DEFAULT nextval('category_seq'),
    competition_id BIGINT NOT NULL REFERENCES competition(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    gender gender_type NOT NULL,
    year_from INTEGER NOT NULL,
    year_to INTEGER NOT NULL,
    CONSTRAINT check_year_range CHECK (year_from <= year_to)
);

-- Event table
CREATE TABLE event (
    id BIGINT PRIMARY KEY DEFAULT nextval('event_seq'),
    category_id BIGINT NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type event_type NOT NULL,
    unit VARCHAR(50) NOT NULL
);

-- Athlete table
CREATE TABLE athlete (
    id BIGINT PRIMARY KEY DEFAULT nextval('athlete_seq'),
    club_id BIGINT REFERENCES club(id) ON DELETE SET NULL,
    category_id BIGINT REFERENCES category(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_year INTEGER NOT NULL,
    gender gender_type NOT NULL,
    CONSTRAINT check_birth_year CHECK (birth_year > 1900 AND birth_year <= EXTRACT(YEAR FROM CURRENT_DATE))
);

-- Result table
CREATE TABLE result (
    id BIGINT PRIMARY KEY DEFAULT nextval('result_seq'),
    athlete_id BIGINT NOT NULL REFERENCES athlete(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES event(id) ON DELETE CASCADE,
    competition_id BIGINT NOT NULL REFERENCES competition(id) ON DELETE CASCADE,
    performance_value DECIMAL(10, 3) NOT NULL,
    points INTEGER,
    rank INTEGER,
    CONSTRAINT unique_athlete_event_competition UNIQUE (athlete_id, event_id, competition_id)
);

-- Create indexes for foreign keys and common queries
CREATE INDEX idx_category_competition ON category(competition_id);
CREATE INDEX idx_event_category ON event(category_id);
CREATE INDEX idx_athlete_club ON athlete(club_id);
CREATE INDEX idx_athlete_category ON athlete(category_id);
CREATE INDEX idx_athlete_gender_birth_year ON athlete(gender, birth_year);
CREATE INDEX idx_result_athlete ON result(athlete_id);
CREATE INDEX idx_result_event ON result(event_id);
CREATE INDEX idx_result_competition ON result(competition_id);
CREATE INDEX idx_result_competition_event ON result(competition_id, event_id);
CREATE INDEX idx_result_points ON result(points DESC) WHERE points IS NOT NULL;

-- Comments for documentation
COMMENT ON TABLE competition IS 'Track and field competition events';
COMMENT ON TABLE category IS 'Age and gender-based athlete groupings';
COMMENT ON TABLE event IS 'Specific athletic events within categories';
COMMENT ON TABLE club IS 'Athletic clubs that athletes belong to';
COMMENT ON TABLE athlete IS 'Individual athletes participating in competitions';
COMMENT ON TABLE result IS 'Performance results of athletes in specific events';

COMMENT ON COLUMN athlete.category_id IS 'Auto-assigned based on birth year and gender';
COMMENT ON COLUMN result.points IS 'Calculated using IAAF ranking formulas';
COMMENT ON COLUMN result.rank IS 'Position within category for this event';