-- Update competition table to match UC11 requirements

-- Add new columns to competition table
ALTER TABLE competition
    ADD COLUMN end_date DATE,
    ADD COLUMN competition_type VARCHAR(50) DEFAULT 'REGIONAL',
    ADD COLUMN description TEXT,
    ADD COLUMN registration_deadline TIMESTAMP,
    ADD COLUMN max_participants INTEGER,
    ADD COLUMN contact_name VARCHAR(255),
    ADD COLUMN contact_email VARCHAR(255),
    ADD COLUMN contact_phone VARCHAR(50),
    ADD COLUMN created_by VARCHAR(100),
    ADD COLUMN modified_by VARCHAR(100);

-- Add constraint for competition_type
ALTER TABLE competition
    ADD CONSTRAINT chk_competition_type CHECK (competition_type IN ('REGIONAL', 'NATIONAL', 'CLUB', 'INTERNATIONAL'));

-- Add constraint for status
ALTER TABLE competition
    DROP CONSTRAINT IF EXISTS competition_status_check,
    ADD CONSTRAINT chk_competition_status CHECK (status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED'));

-- Add constraint for end_date
ALTER TABLE competition
    ADD CONSTRAINT chk_date_range CHECK (end_date IS NULL OR end_date >= date);

-- Create index for competition status
CREATE INDEX IF NOT EXISTS idx_competition_status ON competition(status);

-- Create index for competition date
CREATE INDEX IF NOT EXISTS idx_competition_date ON competition(date);

-- Create composite unique index for name and date to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_competition_name_date ON competition(name, date);