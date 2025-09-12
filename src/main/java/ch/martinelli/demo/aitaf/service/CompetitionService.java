package ch.martinelli.demo.aitaf.service;

import ch.martinelli.demo.aitaf.db.tables.records.CompetitionRecord;
import ch.martinelli.demo.aitaf.repository.CompetitionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CompetitionService {

    private final CompetitionRepository competitionRepository;

    public CompetitionService(CompetitionRepository competitionRepository) {
        this.competitionRepository = competitionRepository;
    }

    @Transactional
    public CompetitionRecord createCompetition(String name, LocalDate competitionDate, String location) {
        validateCompetitionData(name, competitionDate, location);
        
        CompetitionRecord competition = competitionRepository.create(name, competitionDate, location);
        
        return competition;
    }

    public Optional<CompetitionRecord> findById(UUID id) {
        return competitionRepository.findById(id);
    }

    public List<CompetitionRecord> findAll() {
        return competitionRepository.findAll();
    }

    public boolean isDuplicateCompetition(String name, LocalDate date) {
        return competitionRepository.existsByNameAndDate(name, date);
    }

    @Transactional
    public void updateCompetition(CompetitionRecord competition) {
        validateCompetitionData(competition.getName(), competition.getCompetitionDate(), competition.getLocation());
        competitionRepository.update(competition);
    }

    @Transactional
    public void deleteCompetition(UUID id) {
        competitionRepository.delete(id);
    }

    private void validateCompetitionData(String name, LocalDate date, String location) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Competition name is required");
        }
        if (date == null) {
            throw new IllegalArgumentException("Competition date is required");
        }
        if (location == null || location.trim().isEmpty()) {
            throw new IllegalArgumentException("Competition location is required");
        }
        if (name.length() > 255) {
            throw new IllegalArgumentException("Competition name must not exceed 255 characters");
        }
        if (location.length() > 255) {
            throw new IllegalArgumentException("Competition location must not exceed 255 characters");
        }
    }
}