package ch.martinelli.demo.aitaf.ui.view;

import ch.martinelli.demo.aitaf.KaribuTest;
import ch.martinelli.demo.aitaf.db.tables.records.CompetitionRecord;
import ch.martinelli.demo.aitaf.service.CompetitionService;
import com.github.mvysny.kaributesting.v10.GridKt;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.textfield.TextField;
import org.jooq.DSLContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;

import java.time.LocalDate;

import static ch.martinelli.demo.aitaf.db.Tables.COMPETITION;
import static com.github.mvysny.kaributesting.v10.LocatorJ._find;
import static com.github.mvysny.kaributesting.v10.LocatorJ._get;
import static com.github.mvysny.kaributesting.v10.NotificationsKt.expectNotifications;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Karibu test for CompetitionView demonstrating UI testing without a browser.
 * Tests are executed directly against Vaadin components using Karibu-Testing framework.
 */
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class CompetitionViewKaribuTest extends KaribuTest {

    @Autowired
    private CompetitionService competitionService;
    
    @Autowired
    private DSLContext dsl;

    private CompetitionView view;

    @BeforeEach
    void setupView() {
        dsl.deleteFrom(COMPETITION).execute();
        UI.getCurrent().navigate(CompetitionView.class);
        view = _get(CompetitionView.class);
    }

    @Test
    void shouldDisplayEmptyGridInitially() {
        Grid<CompetitionRecord> grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isZero();
    }

    @Test
    void shouldOpenNewCompetitionDialog() {
        _get(Button.class, spec -> spec.withText("New Competition")).click();
        
        Dialog dialog = _get(Dialog.class);
        assertThat(dialog.isOpened()).isTrue();
        assertThat(dialog.getHeaderTitle()).isEqualTo("New Competition");
        
        assertThat(_find(TextField.class, spec -> spec.withLabel("Competition Name"))).hasSize(1);
        assertThat(_find(DatePicker.class, spec -> spec.withLabel("Start Date"))).hasSize(1);
        assertThat(_find(TextField.class, spec -> spec.withLabel("Location"))).hasSize(1);
        assertThat(_find(ComboBox.class, spec -> spec.withLabel("Competition Type"))).hasSize(1);
        assertThat(_find(ComboBox.class, spec -> spec.withLabel("Status"))).hasSize(1);
    }

    @Test  
    void shouldCreateNewCompetition() {
        _get(Button.class, spec -> spec.withText("New Competition")).click();
        
        _get(TextField.class, spec -> spec.withLabel("Competition Name")).setValue("Test Championship");
        _get(DatePicker.class, spec -> spec.withLabel("Start Date")).setValue(LocalDate.now().plusDays(30));
        _get(TextField.class, spec -> spec.withLabel("Location")).setValue("Test Stadium");
        _get(ComboBox.class, spec -> spec.withLabel("Competition Type")).setValue("REGIONAL");
        _get(ComboBox.class, spec -> spec.withLabel("Status")).setValue("PLANNED");
        
        _get(Button.class, spec -> spec.withText("Save")).click();
        
        expectNotifications("Competition created successfully");
        
        Grid<CompetitionRecord> grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isEqualTo(1);
        
        CompetitionRecord created = GridKt._get(grid, 0);
        assertThat(created.getName()).isEqualTo("Test Championship");
        assertThat(created.getLocation()).isEqualTo("Test Stadium");
    }

    @Test
    void shouldSearchCompetitions() {
        CompetitionRecord comp1 = createTestCompetition("Spring Championship", "Arena A");
        CompetitionRecord comp2 = createTestCompetition("Summer Games", "Stadium B");
        competitionService.create(comp1);
        competitionService.create(comp2);
        
        view.refreshGrid();
        
        Grid<CompetitionRecord> grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isEqualTo(2);
        
        TextField searchField = _get(TextField.class, spec -> spec.withPlaceholder("Search competitions..."));
        searchField.setValue("Spring");
        
        assertThat(GridKt._size(grid)).isEqualTo(1);
        assertThat(GridKt._get(grid, 0).getName()).isEqualTo("Spring Championship");
    }

    @Test
    void shouldValidateRequiredFields() {
        _get(Button.class, spec -> spec.withText("New Competition")).click();
        
        _get(Button.class, spec -> spec.withText("Save")).click();
        
        Dialog dialog = _find(Dialog.class).get(0);
        assertThat(dialog.isOpened()).isTrue();
        
        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        assertThat(nameField.isRequiredIndicatorVisible()).isTrue();
        
        DatePicker dateField = _get(DatePicker.class, spec -> spec.withLabel("Start Date"));
        assertThat(dateField.isRequiredIndicatorVisible()).isTrue();
        
        TextField locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
        assertThat(locationField.isRequiredIndicatorVisible()).isTrue();
    }

    @Test
    void shouldCancelDialogWithoutSaving() {
        _get(Button.class, spec -> spec.withText("New Competition")).click();
        
        _get(TextField.class, spec -> spec.withLabel("Competition Name")).setValue("Test Competition");
        
        _get(Button.class, spec -> spec.withText("Cancel")).click();
        
        assertThat(_find(Dialog.class)).isEmpty();
        
        Grid<CompetitionRecord> grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isZero();
    }

    private CompetitionRecord createTestCompetition(String name, String location) {
        CompetitionRecord competition = new CompetitionRecord();
        competition.setName(name);
        competition.setDate(LocalDate.now().plusDays(30));
        competition.setLocation(location);
        competition.setStatus("PLANNED");
        competition.setCompetitionType("REGIONAL");
        return competition;
    }
}