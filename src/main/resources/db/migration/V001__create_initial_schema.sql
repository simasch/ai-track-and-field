-- V001__create_initial_schema.sql
-- Initial database schema for Track and Field Competition Management System

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Club table
CREATE TABLE club (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Athlete table
CREATE TABLE athlete (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_year INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL,
    club_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_athlete_club FOREIGN KEY (club_id) REFERENCES club(id) ON DELETE SET NULL,
    CONSTRAINT chk_gender CHECK (gender IN ('M', 'F', 'Other')),
    CONSTRAINT chk_birth_year CHECK (birth_year >= 1900 AND birth_year <= EXTRACT(YEAR FROM CURRENT_DATE))
);

-- Create Competition table
CREATE TABLE competition (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    competition_date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Category table
CREATE TABLE category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    age_from INTEGER NOT NULL,
    age_to INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_competition FOREIGN KEY (competition_id) REFERENCES competition(id) ON DELETE CASCADE,
    CONSTRAINT chk_category_gender CHECK (gender IN ('M', 'F', 'Other')),
    CONSTRAINT chk_age_range CHECK (age_from <= age_to),
    CONSTRAINT chk_age_from CHECK (age_from >= 0),
    CONSTRAINT chk_age_to CHECK (age_to <= 150)
);

-- Create Event table
CREATE TABLE event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    iaaf_formula VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_event_type CHECK (event_type IN ('track', 'field', 'throwing')),
    CONSTRAINT chk_unit CHECK (unit IN ('seconds', 'meters', 'points'))
);

-- Create CategoryEvent junction table
CREATE TABLE category_event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL,
    event_id UUID NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_event_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
    CONSTRAINT fk_category_event_event FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE,
    CONSTRAINT uq_category_event UNIQUE (category_id, event_id)
);

-- Create Registration table
CREATE TABLE registration (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL,
    athlete_id UUID NOT NULL,
    category_id UUID NOT NULL,
    bib_number VARCHAR(20),
    all_events_completed BOOLEAN DEFAULT FALSE,
    total_points DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_registration_competition FOREIGN KEY (competition_id) REFERENCES competition(id) ON DELETE CASCADE,
    CONSTRAINT fk_registration_athlete FOREIGN KEY (athlete_id) REFERENCES athlete(id) ON DELETE CASCADE,
    CONSTRAINT fk_registration_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
    CONSTRAINT uq_competition_athlete UNIQUE (competition_id, athlete_id)
);

-- Create Result table
CREATE TABLE result (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL,
    event_id UUID NOT NULL,
    performance_value DECIMAL(10, 3),
    points DECIMAL(10, 2) DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_result_registration FOREIGN KEY (registration_id) REFERENCES registration(id) ON DELETE CASCADE,
    CONSTRAINT fk_result_event FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE,
    CONSTRAINT uq_registration_event UNIQUE (registration_id, event_id),
    CONSTRAINT chk_performance_value CHECK (performance_value >= 0),
    CONSTRAINT chk_points CHECK (points >= 0),
    CONSTRAINT chk_rank CHECK (rank > 0)
);

-- Create indexes for foreign keys and frequently queried columns
CREATE INDEX idx_athlete_club_id ON athlete(club_id);
CREATE INDEX idx_athlete_birth_year ON athlete(birth_year);
CREATE INDEX idx_athlete_gender ON athlete(gender);

CREATE INDEX idx_category_competition_id ON category(competition_id);
CREATE INDEX idx_category_gender ON category(gender);

CREATE INDEX idx_category_event_category_id ON category_event(category_id);
CREATE INDEX idx_category_event_event_id ON category_event(event_id);

CREATE INDEX idx_registration_competition_id ON registration(competition_id);
CREATE INDEX idx_registration_athlete_id ON registration(athlete_id);
CREATE INDEX idx_registration_category_id ON registration(category_id);
CREATE INDEX idx_registration_all_events_completed ON registration(all_events_completed);

CREATE INDEX idx_result_registration_id ON result(registration_id);
CREATE INDEX idx_result_event_id ON result(event_id);
CREATE INDEX idx_result_points ON result(points);

-- Create triggers for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_club_updated_at BEFORE UPDATE ON club
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athlete_updated_at BEFORE UPDATE ON athlete
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competition_updated_at BEFORE UPDATE ON competition
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_updated_at BEFORE UPDATE ON category
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_updated_at BEFORE UPDATE ON event
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_event_updated_at BEFORE UPDATE ON category_event
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registration_updated_at BEFORE UPDATE ON registration
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_result_updated_at BEFORE UPDATE ON result
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();