package ch.martinelli.demo.aitaf.service;

import ch.martinelli.demo.aitaf.db.tables.records.CompetitionRecord;
import org.jooq.DSLContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static ch.martinelli.demo.aitaf.db.Tables.COMPETITION;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Testcontainers
@Transactional
class CompetitionServiceTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:latest")
            .withDatabaseName("aitaf_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private CompetitionService competitionService;

    @Autowired
    private DSLContext dsl;

    private CompetitionRecord testCompetition;

    @BeforeEach
    void setUp() {
        dsl.deleteFrom(COMPETITION).execute();
        
        testCompetition = new CompetitionRecord();
        testCompetition.setName("Spring Championship");
        testCompetition.setDate(LocalDate.now().plusDays(30));
        testCompetition.setLocation("Stadium A");
        testCompetition.setStatus("PLANNED");
        testCompetition.setCompetitionType("REGIONAL");
    }

    @Test
    void shouldCreateCompetition() {
        CompetitionRecord created = competitionService.create(testCompetition);

        assertThat(created).isNotNull();
        assertThat(created.getId()).isNotNull();
        assertThat(created.getName()).isEqualTo("Spring Championship");
        assertThat(created.getStatus()).isEqualTo("PLANNED");
        assertThat(created.getCreatedAt()).isNotNull();
        assertThat(created.getUpdatedAt()).isNotNull();
    }

    @Test
    void shouldNotCreateCompetitionWithDuplicateNameAndDate() {
        competitionService.create(testCompetition);

        CompetitionRecord duplicate = new CompetitionRecord();
        duplicate.setName("Spring Championship");
        duplicate.setDate(testCompetition.getDate());
        duplicate.setLocation("Stadium B");
        duplicate.setStatus("PLANNED");
        duplicate.setCompetitionType("NATIONAL");

        assertThatThrownBy(() -> competitionService.create(duplicate))
                .isInstanceOf(CompetitionService.ValidationException.class)
                .hasMessageContaining("same name and date already exists");
    }

    @Test
    void shouldNotCreateCompetitionWithPastDate() {
        testCompetition.setDate(LocalDate.now().minusDays(1));

        assertThatThrownBy(() -> competitionService.create(testCompetition))
                .isInstanceOf(CompetitionService.ValidationException.class)
                .hasMessageContaining("cannot be in the past");
    }

    @Test
    void shouldUpdateCompetition() {
        CompetitionRecord created = competitionService.create(testCompetition);
        
        created.setLocation("Stadium B");
        created.setMaxParticipants(100);
        CompetitionRecord updated = competitionService.update(created);

        assertThat(updated.getLocation()).isEqualTo("Stadium B");
        assertThat(updated.getMaxParticipants()).isEqualTo(100);
        assertThat(updated.getUpdatedAt()).isNotNull();
    }

    @Test
    void shouldFindCompetitionById() {
        CompetitionRecord created = competitionService.create(testCompetition);

        Optional<CompetitionRecord> found = competitionService.findById(created.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Spring Championship");
    }

    @Test
    void shouldFindAllCompetitions() {
        competitionService.create(testCompetition);
        
        CompetitionRecord second = new CompetitionRecord();
        second.setName("Summer Championship");
        second.setDate(LocalDate.now().plusDays(60));
        second.setLocation("Stadium B");
        second.setStatus("PLANNED");
        second.setCompetitionType("NATIONAL");
        competitionService.create(second);

        List<CompetitionRecord> all = competitionService.findAll();

        assertThat(all).hasSize(2);
    }

    @Test
    void shouldSearchCompetitions() {
        competitionService.create(testCompetition);
        
        CompetitionRecord second = new CompetitionRecord();
        second.setName("Summer Championship");
        second.setDate(LocalDate.now().plusDays(60));
        second.setLocation("Arena B");
        second.setStatus("PLANNED");
        second.setCompetitionType("NATIONAL");
        competitionService.create(second);

        List<CompetitionRecord> results = competitionService.search("Spring");
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getName()).isEqualTo("Spring Championship");

        results = competitionService.search("Arena");
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getLocation()).isEqualTo("Arena B");
    }

    @Test
    void shouldDeleteCompetitionWithoutRegistrations() {
        CompetitionRecord created = competitionService.create(testCompetition);

        competitionService.delete(created.getId());

        Optional<CompetitionRecord> found = competitionService.findById(created.getId());
        assertThat(found).isEmpty();
    }

    @Test
    void shouldArchiveCompetition() {
        CompetitionRecord created = competitionService.create(testCompetition);

        competitionService.archive(created.getId());

        Optional<CompetitionRecord> found = competitionService.findById(created.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getStatus()).isEqualTo("ARCHIVED");
    }

    @Test
    void shouldValidateStatusTransitions() {
        CompetitionRecord created = competitionService.create(testCompetition);
        
        created.setStatus("ACTIVE");
        competitionService.update(created);

        created.setStatus("PLANNED");
        assertThatThrownBy(() -> competitionService.update(created))
                .isInstanceOf(CompetitionService.ValidationException.class)
                .hasMessageContaining("Invalid status transition");
    }

    @Test
    void shouldValidateEndDateNotBeforeStartDate() {
        testCompetition.setEndDate(testCompetition.getDate().minusDays(1));

        assertThatThrownBy(() -> competitionService.create(testCompetition))
                .isInstanceOf(CompetitionService.ValidationException.class)
                .hasMessageContaining("End date cannot be before start date");
    }

    @Test
    void shouldValidateMaxParticipants() {
        testCompetition.setMaxParticipants(-1);

        assertThatThrownBy(() -> competitionService.create(testCompetition))
                .isInstanceOf(CompetitionService.ValidationException.class)
                .hasMessageContaining("Maximum participants must be positive");
    }

    @Test
    void shouldFindCompetitionsByStatus() {
        testCompetition.setStatus("ACTIVE");
        competitionService.create(testCompetition);
        
        CompetitionRecord planned = new CompetitionRecord();
        planned.setName("Future Championship");
        planned.setDate(LocalDate.now().plusDays(90));
        planned.setLocation("Stadium C");
        planned.setStatus("PLANNED");
        planned.setCompetitionType("CLUB");
        competitionService.create(planned);

        List<CompetitionRecord> activeCompetitions = competitionService.findByStatus("ACTIVE");
        assertThat(activeCompetitions).hasSize(1);
        assertThat(activeCompetitions.get(0).getName()).isEqualTo("Spring Championship");

        List<CompetitionRecord> plannedCompetitions = competitionService.findByStatus("PLANNED");
        assertThat(plannedCompetitions).hasSize(1);
        assertThat(plannedCompetitions.get(0).getName()).isEqualTo("Future Championship");
    }
}