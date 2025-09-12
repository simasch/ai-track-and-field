package ch.martinelli.demo.aitaf.ui.views;

import ch.martinelli.demo.aitaf.KaribuTest;
import ch.martinelli.demo.aitaf.db.tables.records.CompetitionRecord;
import ch.martinelli.demo.aitaf.service.CompetitionService;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.textfield.TextField;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;

import static com.github.mvysny.kaributesting.v10.LocatorJ.*;
import static com.github.mvysny.kaributesting.v10.pro.ConfirmDialogKt._fireCancel;
import static com.github.mvysny.kaributesting.v10.pro.ConfirmDialogKt._fireConfirm;
import static org.junit.jupiter.api.Assertions.*;

class CompetitionViewTest extends KaribuTest {

    @Autowired
    private CompetitionService competitionService;

    @Test
    void shouldDisplayCompetitionManagementTitle() {
        UI.getCurrent().navigate(CompetitionView.class);
        
        _assertOne(Grid.class);
        _get(Button.class, spec -> spec.withText("Create New Competition"));
    }

    @Test
    void shouldDisplayExistingCompetitions() {
        competitionService.createCompetition("Spring Championship", LocalDate.now().plusDays(30), "Main Stadium");
        
        UI.getCurrent().navigate(CompetitionView.class);
        
        Grid<CompetitionRecord> grid = _get(Grid.class);
        assertFalse(grid.getListDataView().getItems().toList().isEmpty());
    }

    @Test
    void shouldOpenCreateCompetitionDialog() {
        UI.getCurrent().navigate(CompetitionView.class);
        
        Button createButton = _get(Button.class, spec -> spec.withText("Create New Competition"));
        _click(createButton);
        
        Dialog dialog = _get(Dialog.class);
        assertTrue(dialog.isOpened());
        
        _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        _get(DatePicker.class, spec -> spec.withLabel("Competition Date"));
        _get(TextField.class, spec -> spec.withLabel("Location"));
        _get(Button.class, spec -> spec.withText("Save"));
        _get(Button.class, spec -> spec.withText("Cancel"));
    }

    @Test
    void shouldCreateCompetitionWithValidData() {
        UI.getCurrent().navigate(CompetitionView.class);
        
        Button createButton = _get(Button.class, spec -> spec.withText("Create New Competition"));
        _click(createButton);
        
        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        DatePicker dateField = _get(DatePicker.class, spec -> spec.withLabel("Competition Date"));
        TextField locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
        
        _setValue(nameField, "Summer Track Meet 2024");
        _setValue(dateField, LocalDate.now().plusDays(60));
        _setValue(locationField, "City Sports Complex");
        
        Button saveButton = _get(Button.class, spec -> spec.withText("Save"));
        _click(saveButton);
        
        _get(Notification.class);
        
        List<CompetitionRecord> competitions = competitionService.findAll();
        assertTrue(competitions.stream().anyMatch(c -> "Summer Track Meet 2024".equals(c.getName())));
    }

    @Test
    void shouldValidateRequiredFields() {
        UI.getCurrent().navigate(CompetitionView.class);
        
        Button createButton = _get(Button.class, spec -> spec.withText("Create New Competition"));
        _click(createButton);
        
        Button saveButton = _get(Button.class, spec -> spec.withText("Save"));
        _click(saveButton);
        
        _get(Dialog.class);
        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        DatePicker dateField = _get(DatePicker.class, spec -> spec.withLabel("Competition Date"));
        TextField locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
        
        assertTrue(nameField.isInvalid() || dateField.isInvalid() || locationField.isInvalid());
    }

    @Test
    void shouldValidateCompetitionNameNotEmpty() {
        UI.getCurrent().navigate(CompetitionView.class);
        
        Button createButton = _get(Button.class, spec -> spec.withText("Create New Competition"));
        _click(createButton);
        
        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        DatePicker dateField = _get(DatePicker.class, spec -> spec.withLabel("Competition Date"));
        TextField locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
        
        _setValue(nameField, "   ");
        _setValue(dateField, LocalDate.now().plusDays(30));
        _setValue(locationField, "Main Stadium");
        
        Button saveButton = _get(Button.class, spec -> spec.withText("Save"));
        _click(saveButton);
        
        _get(Dialog.class);
        assertTrue(nameField.isInvalid());
    }

    @Test
    void shouldValidateLocationNotEmpty() {
        UI.getCurrent().navigate(CompetitionView.class);
        
        Button createButton = _get(Button.class, spec -> spec.withText("Create New Competition"));
        _click(createButton);
        
        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        DatePicker dateField = _get(DatePicker.class, spec -> spec.withLabel("Competition Date"));
        TextField locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
        
        _setValue(nameField, "Valid Competition Name");
        _setValue(dateField, LocalDate.now().plusDays(30));
        _setValue(locationField, "   ");
        
        Button saveButton = _get(Button.class, spec -> spec.withText("Save"));
        _click(saveButton);
        
        _get(Dialog.class);
        assertTrue(locationField.isInvalid());
    }

    @Test
    void shouldShowWarningForPastDate() {
        UI.getCurrent().navigate(CompetitionView.class);
        
        Button createButton = _get(Button.class, spec -> spec.withText("Create New Competition"));
        _click(createButton);
        
        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        DatePicker dateField = _get(DatePicker.class, spec -> spec.withLabel("Competition Date"));
        TextField locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
        
        _setValue(nameField, "Historical Meet");
        _setValue(dateField, LocalDate.now().minusDays(10));
        _setValue(locationField, "Old Stadium");
        
        Button saveButton = _get(Button.class, spec -> spec.withText("Save"));
        _click(saveButton);
        
        ConfirmDialog confirmDialog = _get(ConfirmDialog.class);
        assertTrue(confirmDialog.isOpened());
        assertNotNull(confirmDialog);
    }

    @Test
    void shouldShowConfirmDialogForPastDateAndAllowCreation() {
        UI.getCurrent().navigate(CompetitionView.class);
        
        Button createButton = _get(Button.class, spec -> spec.withText("Create New Competition"));
        _click(createButton);
        
        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        DatePicker dateField = _get(DatePicker.class, spec -> spec.withLabel("Competition Date"));
        TextField locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
        
        _setValue(nameField, "Historical Meet");
        _setValue(dateField, LocalDate.now().minusDays(10));
        _setValue(locationField, "Old Stadium");
        
        Button saveButton = _get(Button.class, spec -> spec.withText("Save"));
        _click(saveButton);
        
        ConfirmDialog confirmDialog = _get(ConfirmDialog.class);
        _fireConfirm(confirmDialog);
        
        _get(Notification.class);
        
        List<CompetitionRecord> competitions = competitionService.findAll();
        assertTrue(competitions.stream().anyMatch(c -> "Historical Meet".equals(c.getName())));
    }

    @Test
    void shouldShowWarningForDuplicateCompetition() {
        competitionService.createCompetition("Existing Competition", LocalDate.now().plusDays(30), "Stadium A");
        
        UI.getCurrent().navigate(CompetitionView.class);
        
        Button createButton = _get(Button.class, spec -> spec.withText("Create New Competition"));
        _click(createButton);
        
        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        DatePicker dateField = _get(DatePicker.class, spec -> spec.withLabel("Competition Date"));
        TextField locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
        
        _setValue(nameField, "Existing Competition");
        _setValue(dateField, LocalDate.now().plusDays(30));
        _setValue(locationField, "Stadium B");
        
        Button saveButton = _get(Button.class, spec -> spec.withText("Save"));
        _click(saveButton);
        
        ConfirmDialog confirmDialog = _get(ConfirmDialog.class);
        assertTrue(confirmDialog.isOpened());
        assertNotNull(confirmDialog);
    }

    @Test
    void shouldShowConfirmDialogForDuplicateCompetition() {
        competitionService.createCompetition("Existing Competition", LocalDate.now().plusDays(30), "Stadium A");
        
        UI.getCurrent().navigate(CompetitionView.class);
        
        Button createButton = _get(Button.class, spec -> spec.withText("Create New Competition"));
        _click(createButton);
        
        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        DatePicker dateField = _get(DatePicker.class, spec -> spec.withLabel("Competition Date"));
        TextField locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
        
        _setValue(nameField, "Existing Competition");
        _setValue(dateField, LocalDate.now().plusDays(30));
        _setValue(locationField, "Stadium B");
        
        Button saveButton = _get(Button.class, spec -> spec.withText("Save"));
        _click(saveButton);
        
        ConfirmDialog confirmDialog = _get(ConfirmDialog.class);
        _fireConfirm(confirmDialog);
        
        _get(Notification.class);
        
        List<CompetitionRecord> competitions = competitionService.findAll();
        assertEquals(2, competitions.stream()
                .mapToLong(c -> "Existing Competition".equals(c.getName()) ? 1 : 0)
                .sum());
    }

    @Test
    void shouldCancelPastDateCreation() {
        UI.getCurrent().navigate(CompetitionView.class);
        
        Button createButton = _get(Button.class, spec -> spec.withText("Create New Competition"));
        _click(createButton);
        
        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        DatePicker dateField = _get(DatePicker.class, spec -> spec.withLabel("Competition Date"));
        TextField locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
        
        _setValue(nameField, "Should Not Be Created");
        _setValue(dateField, LocalDate.now().minusDays(5));
        _setValue(locationField, "Some Stadium");
        
        Button saveButton = _get(Button.class, spec -> spec.withText("Save"));
        _click(saveButton);
        
        ConfirmDialog confirmDialog = _get(ConfirmDialog.class);
        _fireCancel(confirmDialog);
        
        _get(Dialog.class);
        
        List<CompetitionRecord> competitions = competitionService.findAll();
        assertFalse(competitions.stream().anyMatch(c -> "Should Not Be Created".equals(c.getName())));
    }

    @Test
    void shouldCancelCompetitionCreation() {
        UI.getCurrent().navigate(CompetitionView.class);
        
        Button createButton = _get(Button.class, spec -> spec.withText("Create New Competition"));
        _click(createButton);
        
        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        DatePicker dateField = _get(DatePicker.class, spec -> spec.withLabel("Competition Date"));
        TextField locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
        
        _setValue(nameField, "Cancelled Competition");
        _setValue(dateField, LocalDate.now().plusDays(30));
        _setValue(locationField, "Some Stadium");
        
        Button cancelButton = _get(Button.class, spec -> spec.withText("Cancel"));
        _click(cancelButton);
        
        
        List<CompetitionRecord> competitions = competitionService.findAll();
        assertFalse(competitions.stream().anyMatch(c -> "Cancelled Competition".equals(c.getName())));
    }

    @Test
    void shouldRespectMaxLengthValidation() {
        UI.getCurrent().navigate(CompetitionView.class);
        
        Button createButton = _get(Button.class, spec -> spec.withText("Create New Competition"));
        _click(createButton);
        
        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Competition Name"));
        TextField locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
        
        assertEquals(255, nameField.getMaxLength());
        assertEquals(255, locationField.getMaxLength());
    }
}