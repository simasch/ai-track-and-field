package ch.martinelli.demo.aitaf.repository;

import ch.martinelli.demo.aitaf.db.tables.records.CompetitionRecord;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ch.martinelli.demo.aitaf.db.Tables.COMPETITION;

@Repository
public class CompetitionRepository {

    private final DSLContext dsl;

    public CompetitionRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public CompetitionRecord create(String name, LocalDate competitionDate, String location) {
        CompetitionRecord competition = dsl.newRecord(COMPETITION);
        competition.setId(UUID.randomUUID());
        competition.setName(name);
        competition.setCompetitionDate(competitionDate);
        competition.setLocation(location);
        competition.setCreatedAt(LocalDateTime.now());
        competition.setUpdatedAt(LocalDateTime.now());
        competition.store();
        return competition;
    }

    public Optional<CompetitionRecord> findById(UUID id) {
        return dsl.selectFrom(COMPETITION)
                .where(COMPETITION.ID.eq(id))
                .fetchOptional();
    }

    public List<CompetitionRecord> findAll() {
        return dsl.selectFrom(COMPETITION)
                .orderBy(COMPETITION.COMPETITION_DATE.desc())
                .fetch();
    }

    public List<CompetitionRecord> findByNameAndDate(String name, LocalDate date) {
        return dsl.selectFrom(COMPETITION)
                .where(COMPETITION.NAME.eq(name))
                .and(COMPETITION.COMPETITION_DATE.eq(date))
                .fetch();
    }

    public boolean existsByNameAndDate(String name, LocalDate date) {
        return dsl.fetchExists(
                dsl.selectFrom(COMPETITION)
                        .where(COMPETITION.NAME.eq(name))
                        .and(COMPETITION.COMPETITION_DATE.eq(date))
        );
    }

    public void update(CompetitionRecord competition) {
        competition.setUpdatedAt(LocalDateTime.now());
        competition.store();
    }

    public void delete(UUID id) {
        dsl.deleteFrom(COMPETITION)
                .where(COMPETITION.ID.eq(id))
                .execute();
    }
}