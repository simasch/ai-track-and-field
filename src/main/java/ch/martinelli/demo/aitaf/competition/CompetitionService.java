package ch.martinelli.demo.aitaf.competition;

import ch.martinelli.demo.aitaf.db.Tables;
import ch.martinelli.demo.aitaf.db.enums.CompetitionStatus;
import ch.martinelli.demo.aitaf.db.tables.records.CompetitionRecord;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing competitions.
 * Implements business rules from UC-001 for competition management.
 */
@Service
public class CompetitionService {

    private final DSLContext dsl;

    public CompetitionService(DSLContext dsl) {
        this.dsl = dsl;
    }

    /**
     * Retrieves all competitions ordered by date descending.
     */
    public List<CompetitionRecord> findAll() {
        return dsl.selectFrom(Tables.COMPETITION)
                .orderBy(Tables.COMPETITION.DATE.desc())
                .fetch();
    }

    /**
     * Checks if a competition name is unique.
     * Used for validation in the UI.
     * BR-001: Competition name uniqueness.
     *
     * @param name the competition name to check
     * @param excludeId ID to exclude from the check (for updates), or null
     * @return true if the name is unique
     */
    public boolean isNameUnique(String name, Long excludeId) {
        var query = dsl.selectFrom(Tables.COMPETITION)
                .where(Tables.COMPETITION.NAME.eq(name));

        if (excludeId != null) {
            query = query.and(Tables.COMPETITION.ID.ne(excludeId));
        }

        return !dsl.fetchExists(query);
    }

    /**
     * Saves a competition (create or update).
     * Validation is performed in the UI layer via Binder.
     *
     * @param competition the competition to save
     * @return the saved competition with generated ID (for new records)
     */
    @Transactional
    public CompetitionRecord save(CompetitionRecord competition) {
        dsl.attach(competition);

        boolean isNew = competition.getId() == null;
        if (isNew) {
            competition.setStatus(CompetitionStatus.PLANNED);
        }

        competition.store();

        return competition;
    }

    /**
     * Deletes a competition by ID.
     * Implements BR-005 (cascade deletion).
     *
     * @param id the competition ID to delete
     * @return true if deleted, false if not found
     */
    @Transactional
    public boolean delete(Long id) {
        int deleted = dsl.deleteFrom(Tables.COMPETITION)
                .where(Tables.COMPETITION.ID.eq(id))
                .execute();

        return deleted > 0;
    }

    /**
     * Checks if a competition has associated results.
     * Used to show warnings before deletion per BR-005.
     *
     * @param id the competition ID
     * @return true if the competition has results
     */
    public boolean hasResults(Long id) {
        return dsl.fetchExists(
                dsl.selectFrom(Tables.RESULT)
                        .where(Tables.RESULT.COMPETITION_ID.eq(id))
        );
    }
}
