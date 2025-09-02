-- Initial schema for AI Track and Field Competition System

-- Clubs table
CREATE TABLE club (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on club name
CREATE UNIQUE INDEX idx_club_name ON club(name);

-- Competitions table
CREATE TABLE competition (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'PLANNED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Categories table (defines age groups with gender)
CREATE TABLE category (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    year_from INTEGER NOT NULL,
    year_to INTEGER NOT NULL,
    competition_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_competition FOREIGN KEY (competition_id) REFERENCES competition(id) ON DELETE CASCADE,
    CONSTRAINT chk_year_range CHECK (year_from <= year_to)
);

-- Create index on competition_id for better query performance
CREATE INDEX idx_category_competition ON category(competition_id);

-- Events table (defines track and field events)
CREATE TABLE event (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('TRACK', 'FIELD')),
    unit VARCHAR(20) NOT NULL, -- 'seconds', 'meters', 'points'
    iaaf_formula_type VARCHAR(50), -- 'sprint', 'middle_distance', 'throws', 'jumps', etc.
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on event name
CREATE UNIQUE INDEX idx_event_name ON event(name);

-- Category events junction table (assigns events to categories)
CREATE TABLE category_event (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    event_order INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_event_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
    CONSTRAINT fk_category_event_event FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE,
    CONSTRAINT uk_category_event UNIQUE (category_id, event_id)
);

-- Create indexes for foreign keys
CREATE INDEX idx_category_event_category ON category_event(category_id);
CREATE INDEX idx_category_event_event ON category_event(event_id);

-- Athletes table
CREATE TABLE athlete (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    club_id BIGINT,
    license_number VARCHAR(50),
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_athlete_club FOREIGN KEY (club_id) REFERENCES club(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_athlete_club ON athlete(club_id);
CREATE INDEX idx_athlete_name ON athlete(last_name, first_name);

-- Competition registrations (athletes enrolled in competitions)
CREATE TABLE registration (
    id BIGSERIAL PRIMARY KEY,
    competition_id BIGINT NOT NULL,
    athlete_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    bib_number VARCHAR(20),
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    all_events_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_registration_competition FOREIGN KEY (competition_id) REFERENCES competition(id) ON DELETE CASCADE,
    CONSTRAINT fk_registration_athlete FOREIGN KEY (athlete_id) REFERENCES athlete(id) ON DELETE CASCADE,
    CONSTRAINT fk_registration_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
    CONSTRAINT uk_registration UNIQUE (competition_id, athlete_id)
);

-- Create indexes for foreign keys
CREATE INDEX idx_registration_competition ON registration(competition_id);
CREATE INDEX idx_registration_athlete ON registration(athlete_id);
CREATE INDEX idx_registration_category ON registration(category_id);

-- Competition results for each athlete and event
CREATE TABLE result (
    id BIGSERIAL PRIMARY KEY,
    registration_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    performance DECIMAL(10, 3), -- Raw performance value (time in seconds, distance in meters, etc.)
    wind_speed DECIMAL(4, 2), -- Wind speed for applicable events
    points INTEGER, -- Calculated IAAF points
    attempt_number INTEGER DEFAULT 1,
    is_valid BOOLEAN DEFAULT TRUE,
    is_dns BOOLEAN DEFAULT FALSE, -- Did Not Start
    is_dnf BOOLEAN DEFAULT FALSE, -- Did Not Finish
    is_dq BOOLEAN DEFAULT FALSE, -- Disqualified
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_result_registration FOREIGN KEY (registration_id) REFERENCES registration(id) ON DELETE CASCADE,
    CONSTRAINT fk_result_event FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_result_registration ON result(registration_id);
CREATE INDEX idx_result_event ON result(event_id);
CREATE INDEX idx_result_points ON result(points DESC);

-- IAAF scoring parameters table for point calculation
CREATE TABLE iaaf_scoring_parameter (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    parameter_a DECIMAL(15, 6) NOT NULL,
    parameter_b DECIMAL(15, 6) NOT NULL,
    parameter_c DECIMAL(15, 6) NOT NULL,
    formula_type VARCHAR(50) NOT NULL, -- 'track', 'field_jump', 'field_throw'
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_iaaf_event FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE
);

-- Create index on event_id and gender for parameter lookup
CREATE INDEX idx_iaaf_parameter_lookup ON iaaf_scoring_parameter(event_id, gender);

-- Insert some common events
INSERT INTO event (name, event_type, unit, iaaf_formula_type) VALUES
    ('100m', 'TRACK', 'seconds', 'sprint'),
    ('200m', 'TRACK', 'seconds', 'sprint'),
    ('400m', 'TRACK', 'seconds', 'sprint'),
    ('800m', 'TRACK', 'seconds', 'middle_distance'),
    ('1500m', 'TRACK', 'seconds', 'middle_distance'),
    ('3000m', 'TRACK', 'seconds', 'distance'),
    ('5000m', 'TRACK', 'seconds', 'distance'),
    ('110m Hurdles', 'TRACK', 'seconds', 'hurdles'),
    ('100m Hurdles', 'TRACK', 'seconds', 'hurdles'),
    ('400m Hurdles', 'TRACK', 'seconds', 'hurdles'),
    ('High Jump', 'FIELD', 'meters', 'vertical_jump'),
    ('Pole Vault', 'FIELD', 'meters', 'vertical_jump'),
    ('Long Jump', 'FIELD', 'meters', 'horizontal_jump'),
    ('Triple Jump', 'FIELD', 'meters', 'horizontal_jump'),
    ('Shot Put', 'FIELD', 'meters', 'throw'),
    ('Discus Throw', 'FIELD', 'meters', 'throw'),
    ('Hammer Throw', 'FIELD', 'meters', 'throw'),
    ('Javelin Throw', 'FIELD', 'meters', 'throw');

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_club_updated_at BEFORE UPDATE ON club
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competition_updated_at BEFORE UPDATE ON competition
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_updated_at BEFORE UPDATE ON category
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_updated_at BEFORE UPDATE ON event
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athlete_updated_at BEFORE UPDATE ON athlete
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registration_updated_at BEFORE UPDATE ON registration
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_result_updated_at BEFORE UPDATE ON result
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_iaaf_scoring_parameter_updated_at BEFORE UPDATE ON iaaf_scoring_parameter
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();