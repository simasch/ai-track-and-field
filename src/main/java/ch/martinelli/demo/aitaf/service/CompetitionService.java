package ch.martinelli.demo.aitaf.service;

import ch.martinelli.demo.aitaf.db.tables.records.CompetitionRecord;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static ch.martinelli.demo.aitaf.db.Tables.*;

@Service
@Transactional
public class CompetitionService {

    private final DSLContext dsl;

    public CompetitionService(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Transactional(readOnly = true)
    public List<CompetitionRecord> findAll() {
        return dsl.selectFrom(COMPETITION)
                .orderBy(COMPETITION.DATE.desc(), COMPETITION.NAME)
                .fetch();
    }

    @Transactional(readOnly = true)
    public Optional<CompetitionRecord> findById(Long id) {
        return dsl.selectFrom(COMPETITION)
                .where(COMPETITION.ID.eq(id))
                .fetchOptional();
    }

    @Transactional(readOnly = true)
    public List<CompetitionRecord> findByStatus(String status) {
        return dsl.selectFrom(COMPETITION)
                .where(COMPETITION.STATUS.eq(status))
                .orderBy(COMPETITION.DATE.desc())
                .fetch();
    }

    @Transactional(readOnly = true)
    public List<CompetitionRecord> search(String searchTerm) {
        String searchPattern = "%" + searchTerm + "%";
        return dsl.selectFrom(COMPETITION)
                .where(COMPETITION.NAME.likeIgnoreCase(searchPattern)
                        .or(COMPETITION.LOCATION.likeIgnoreCase(searchPattern)))
                .orderBy(COMPETITION.DATE.desc())
                .fetch();
    }

    public CompetitionRecord create(CompetitionRecord competition) {
        validateCompetition(competition);
        
        if (isDuplicateNameAndDate(competition.getName(), competition.getDate(), null)) {
            throw new ValidationException("A competition with the same name and date already exists");
        }

        competition.setCreatedAt(LocalDateTime.now());
        competition.setUpdatedAt(LocalDateTime.now());
        
        return dsl.insertInto(COMPETITION)
                .set(competition)
                .returning()
                .fetchOne();
    }

    public CompetitionRecord update(CompetitionRecord competition) {
        validateCompetition(competition);
        
        if (isDuplicateNameAndDate(competition.getName(), competition.getDate(), competition.getId())) {
            throw new ValidationException("A competition with the same name and date already exists");
        }

        competition.setUpdatedAt(LocalDateTime.now());
        
        return dsl.update(COMPETITION)
                .set(competition)
                .where(COMPETITION.ID.eq(competition.getId()))
                .returning()
                .fetchOne();
    }

    public void delete(Long id) {
        Optional<CompetitionRecord> competition = findById(id);
        if (competition.isEmpty()) {
            throw new ValidationException("Competition not found");
        }

        if (hasActiveRegistrations(id)) {
            throw new ValidationException("Cannot delete competition with active registrations. Consider archiving instead.");
        }

        dsl.deleteFrom(COMPETITION)
                .where(COMPETITION.ID.eq(id))
                .execute();
    }

    public void archive(Long id) {
        dsl.update(COMPETITION)
                .set(COMPETITION.STATUS, "ARCHIVED")
                .set(COMPETITION.UPDATED_AT, LocalDateTime.now())
                .where(COMPETITION.ID.eq(id))
                .execute();
    }

    @Transactional(readOnly = true)
    public boolean hasActiveRegistrations(Long competitionId) {
        return dsl.fetchCount(REGISTRATION, REGISTRATION.COMPETITION_ID.eq(competitionId)) > 0;
    }

    @Transactional(readOnly = true)
    public boolean hasResults(Long competitionId) {
        return dsl.selectCount()
                .from(RESULT)
                .join(REGISTRATION).on(RESULT.REGISTRATION_ID.eq(REGISTRATION.ID))
                .where(REGISTRATION.COMPETITION_ID.eq(competitionId))
                .fetchOne(0, int.class) > 0;
    }

    @Transactional(readOnly = true)
    public int getRegistrationCount(Long competitionId) {
        return dsl.fetchCount(REGISTRATION, REGISTRATION.COMPETITION_ID.eq(competitionId));
    }

    private void validateCompetition(CompetitionRecord competition) {
        if (competition.getName() == null || competition.getName().trim().isEmpty()) {
            throw new ValidationException("Competition name is required");
        }
        
        if (competition.getDate() == null) {
            throw new ValidationException("Competition date is required");
        }
        
        if (competition.getDate().isBefore(LocalDate.now()) && 
            competition.getId() == null) {
            throw new ValidationException("Competition date cannot be in the past");
        }
        
        if (competition.getEndDate() != null && 
            competition.getEndDate().isBefore(competition.getDate())) {
            throw new ValidationException("End date cannot be before start date");
        }
        
        if (competition.getMaxParticipants() != null && competition.getMaxParticipants() < 0) {
            throw new ValidationException("Maximum participants must be positive");
        }

        validateStatusTransition(competition);
    }

    private void validateStatusTransition(CompetitionRecord competition) {
        if (competition.getId() == null) {
            return;
        }

        Optional<CompetitionRecord> existing = findById(competition.getId());
        if (existing.isEmpty()) {
            return;
        }

        String currentStatus = existing.get().getStatus();
        String newStatus = competition.getStatus();

        if (currentStatus.equals(newStatus)) {
            return;
        }

        boolean validTransition = switch (currentStatus) {
            case "PLANNED" -> List.of("ACTIVE", "CANCELLED").contains(newStatus);
            case "ACTIVE" -> List.of("COMPLETED", "CANCELLED").contains(newStatus);
            case "COMPLETED" -> "ARCHIVED".equals(newStatus);
            default -> false;
        };

        if (!validTransition) {
            throw new ValidationException(
                String.format("Invalid status transition from %s to %s", currentStatus, newStatus)
            );
        }
    }

    private boolean isDuplicateNameAndDate(String name, LocalDate date, Long excludeId) {
        var query = dsl.selectFrom(COMPETITION)
                .where(COMPETITION.NAME.eq(name))
                .and(COMPETITION.DATE.eq(date));
        
        if (excludeId != null) {
            query = query.and(COMPETITION.ID.ne(excludeId));
        }
        
        return query.fetchOne() != null;
    }

    public static class ValidationException extends RuntimeException {
        public ValidationException(String message) {
            super(message);
        }
    }
}