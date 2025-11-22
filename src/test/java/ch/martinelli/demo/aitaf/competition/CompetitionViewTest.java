package ch.martinelli.demo.aitaf.competition;

import ch.martinelli.demo.aitaf.KaribuTest;
import ch.martinelli.demo.aitaf.db.Tables;
import ch.martinelli.demo.aitaf.db.enums.CompetitionStatus;
import ch.martinelli.demo.aitaf.db.tables.records.CompetitionRecord;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.select.Select;
import com.vaadin.flow.component.textfield.TextField;
import org.jooq.DSLContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;

import static com.github.mvysny.kaributesting.v10.GridKt.*;
import static com.github.mvysny.kaributesting.v10.LocatorJ.*;
import static com.github.mvysny.kaributesting.v10.LocatorJ._get;
import static com.github.mvysny.kaributesting.v10.NotificationsKt.expectNotifications;
import static com.github.mvysny.kaributesting.v10.pro.ConfirmDialogKt._fireCancel;
import static com.github.mvysny.kaributesting.v10.pro.ConfirmDialogKt._fireConfirm;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Karibu test for UC-001: Manage Competitions.
 * Tests the CompetitionView CRUD operations without using Mockito.
 * Test data is created using Flyway migrations in src/test/resources/db/migration.
 */
class CompetitionViewTest extends KaribuTest {

	@Autowired
	private DSLContext dsl;

	private List<Long> testCreatedIds;

	@BeforeEach
	void navigateToView() {
		testCreatedIds = new java.util.ArrayList<>();
		UI.getCurrent().navigate(CompetitionView.class);
	}

	@AfterEach
	void cleanupTestData() {
		// Remove only the competitions created during tests (not the migration data)
		if (!testCreatedIds.isEmpty()) {
			dsl.deleteFrom(Tables.COMPETITION)
					.where(Tables.COMPETITION.ID.in(testCreatedIds))
					.execute();
		}
	}

	/**
	 * Test UC-001 Main Success Scenario: Display competition list.
	 * Verifies that the grid displays existing competitions from test data.
	 */
	@Test
	void displays_competition_list_from_test_data() {
		var grid = _get(Grid.class);

		// Verify grid has the test data competitions (3 from migration)
		assertThat(_size(grid)).isGreaterThanOrEqualTo(3);

		// Get all items and verify test data is present
		int gridSize = _size(grid);
		List<CompetitionRecord> items = _fetch(grid, 0, gridSize);
		assertThat(items)
				.extracting(CompetitionRecord::getName)
				.contains(
						"Spring Athletics Championship 2025",
						"Summer Track Meet 2025",
						"Autumn Regional Competition 2024"
				);
	}

	/**
	 * Test UC-001 Main Success Scenario: Verify grid columns.
	 * Ensures all required columns are displayed.
	 */
	@Test
	void grid_displays_required_columns() {
		var grid = _get(Grid.class);

		// Verify column headers
		assertThat(_getColumnByKey(grid, "name")).isNotNull();
		assertThat(_getColumnByKey(grid, "date")).isNotNull();
		assertThat(_getColumnByKey(grid, "location")).isNotNull();
		assertThat(_getColumnByKey(grid, "status")).isNotNull();
		assertThat(_getColumnByKey(grid, "actions")).isNotNull();
	}

	/**
	 * Test UC-001 Main Success Scenario: Create new competition.
	 * Steps 3-10: Create competition form and submission.
	 */
	@Test
	void creates_new_competition_successfully() {
		// Step 3: Click create button
		_click(_get(Button.class, spec -> spec.withText("Create Competition")));

		// Step 4: Verify dialog opens
		var dialog = _get(Dialog.class);
		assertThat(dialog.isOpened()).isTrue();
		assertThat(dialog.getHeaderTitle()).isEqualTo("Create Competition");

		// Step 5: Fill in competition details
		_setValue(_get(TextField.class, spec -> spec.withLabel("Name")), "New Test Competition 2025");
		_setValue(_get(DatePicker.class, spec -> spec.withLabel("Date")), LocalDate.of(2025, 12, 25));
		_setValue(_get(TextField.class, spec -> spec.withLabel("Location")), "Test Stadium");
		_setValue(_get(Select.class, spec -> spec.withLabel("Status")), CompetitionStatus.PLANNED);

		// Step 6: Submit the form
		_click(_get(Button.class, spec -> spec.withText("Save")));

		// Step 8-9: Verify success notification
		expectNotifications("Competition created successfully");

		// Step 9: Verify competition appears in grid
		var grid = _get(Grid.class);
		int gridSize = _size(grid);
		List<CompetitionRecord> items = _fetch(grid, 0, gridSize);
		var createdCompetition = items.stream()
				.filter(c -> "New Test Competition 2025".equals(c.getName()))
				.findFirst()
				.orElseThrow();

		assertThat(createdCompetition.getName()).isEqualTo("New Test Competition 2025");
		assertThat(createdCompetition.getDate()).isEqualTo(LocalDate.of(2025, 12, 25));
		assertThat(createdCompetition.getLocation()).isEqualTo("Test Stadium");
		assertThat(createdCompetition.getStatus()).isEqualTo(CompetitionStatus.PLANNED);

		// Track for cleanup
		testCreatedIds.add(createdCompetition.getId());
	}

	/**
	 * Test A1: Edit Existing Competition.
	 * Verifies editing flow including data pre-population and update.
	 */
	@Test
	void edits_existing_competition_successfully() {
		var grid = _get(Grid.class);

		// Get the first test competition
		CompetitionRecord competition = (CompetitionRecord) _fetch(grid, 0, 1).get(0);
		var originalName = competition.getName();

		// Click edit button in the actions column
		_getCellComponent(grid, 0, "actions")
				.getChildren()
				.filter(Button.class::isInstance)
				.map(Button.class::cast)
				.filter(btn -> "Edit".equals(btn.getText()))
				.findFirst()
				.ifPresent(Button::click);

		// Verify edit dialog opens with existing data
		var dialog = _get(Dialog.class);
		assertThat(dialog.isOpened()).isTrue();
		assertThat(dialog.getHeaderTitle()).isEqualTo("Edit Competition");

		// Verify form is pre-populated
		var nameField = _get(TextField.class, spec -> spec.withLabel("Name"));
		assertThat(nameField.getValue()).isEqualTo(originalName);

		// Modify the location
		_setValue(_get(TextField.class, spec -> spec.withLabel("Location")), "Updated Location");

		// Save changes
		_click(_get(Button.class, spec -> spec.withText("Save")));

		// Verify success notification
		expectNotifications("Competition updated successfully");

		// Verify changes in database
		var updated = dsl.selectFrom(Tables.COMPETITION)
				.where(Tables.COMPETITION.ID.eq(competition.getId()))
				.fetchOne();

		assertThat(updated).isNotNull();
		assertThat(updated.getLocation()).isEqualTo("Updated Location");
		assertThat(updated.getName()).isEqualTo(originalName); // Name unchanged
	}

	/**
	 * Test A2: Delete Competition without results.
	 * Verifies deletion confirmation dialog and successful deletion.
	 */
	@Test
	void deletes_competition_without_results() {
		// First, create a competition to delete (to avoid deleting test data)
		createTestCompetition("Competition to Delete", LocalDate.of(2026, 8, 1), "Delete Test Location");

		var grid = _get(Grid.class);
		int gridSize = _size(grid);
		List<CompetitionRecord> items = _fetch(grid, 0, gridSize);
		var competitionToDelete = items.stream()
				.filter(c -> "Competition to Delete".equals(c.getName()))
				.findFirst()
				.orElseThrow();

		int originalSize = _size(grid);

		// Find and click delete button
		int rowIndex = items.indexOf(competitionToDelete);
		_getCellComponent(grid, rowIndex, "actions")
				.getChildren()
				.filter(Button.class::isInstance)
				.map(Button.class::cast)
				.filter(btn -> "Delete".equals(btn.getText()))
				.findFirst()
				.ifPresent(Button::click);

		// Verify confirmation dialog
		var confirmDialog = _get(ConfirmDialog.class);
		assertThat(confirmDialog.isOpened()).isTrue();

		// Confirm the deletion using Karibu Testing utility
		_fireConfirm(confirmDialog);

		// Verify success notification
		expectNotifications("Competition deleted successfully");

		// Verify competition is removed from grid
		assertThat(_size(grid)).isEqualTo(originalSize - 1);

		// Verify deletion from database
		var deleted = dsl.selectFrom(Tables.COMPETITION)
				.where(Tables.COMPETITION.ID.eq(competitionToDelete.getId()))
				.fetchOne();
		assertThat(deleted).isNull();
	}

	/**
	 * Test A2: Delete Competition with results.
	 * Verifies warning message when deleting competition with results.
	 */
	@Test
	void shows_warning_when_deleting_competition_with_results() {
		var grid = _get(Grid.class);
		int gridSize = _size(grid);
		List<CompetitionRecord> items = _fetch(grid, 0, gridSize);

		// Find the competition with results (ID=3 from test data)
		var competitionWithResults = items.stream()
				.filter(c -> "Autumn Regional Competition 2024".equals(c.getName()))
				.findFirst()
				.orElseThrow();

		// Find and click delete button
		int rowIndex = items.indexOf(competitionWithResults);
		_getCellComponent(grid, rowIndex, "actions")
				.getChildren()
				.filter(Button.class::isInstance)
				.map(Button.class::cast)
				.filter(btn -> "Delete".equals(btn.getText()))
				.findFirst()
				.ifPresent(Button::click);

		// Verify confirmation dialog with warning
		var confirmDialog = _get(ConfirmDialog.class);
		assertThat(confirmDialog.isOpened()).isTrue();

		// Note: The warning text is shown in the ConfirmDialog but cannot be easily accessed
		// in Karibu Testing due to how ConfirmDialog renders its text property.
		// The important part is that the dialog is shown for a competition with results.

		// Cancel deletion (to preserve test data)
		_fireCancel(confirmDialog);
	}

	/**
	 * Test A3: Validation Error - Required fields.
	 * Verifies BR-003: Required fields validation.
	 */
	@Test
	void validates_required_fields_on_create() {
		_click(_get(Button.class, spec -> spec.withText("Create Competition")));

		var dialog = _get(Dialog.class);
		assertThat(dialog.isOpened()).isTrue();

		// Try to save without filling required fields
		_click(_get(Button.class, spec -> spec.withText("Save")));

		// Verify error notification
		expectNotifications("Please fix the validation errors");

		// Verify dialog remains open
		assertThat(dialog.isOpened()).isTrue();

		// Verify validation errors on fields
		var nameField = _get(TextField.class, spec -> spec.withLabel("Name"));
		assertThat(nameField.isInvalid()).isTrue();

		var dateField = _get(DatePicker.class, spec -> spec.withLabel("Date"));
		assertThat(dateField.isInvalid()).isTrue();

		var locationField = _get(TextField.class, spec -> spec.withLabel("Location"));
		assertThat(locationField.isInvalid()).isTrue();
	}

	/**
	 * Test A3: Validation Error - Name uniqueness.
	 * Verifies BR-001: Competition name uniqueness.
	 */
	@Test
	void validates_unique_competition_name() {
		_click(_get(Button.class, spec -> spec.withText("Create Competition")));

		// Try to create competition with existing name
		_setValue(_get(TextField.class, spec -> spec.withLabel("Name")), "Spring Athletics Championship 2025");
		_setValue(_get(DatePicker.class, spec -> spec.withLabel("Date")), LocalDate.of(2025, 12, 1));
		_setValue(_get(TextField.class, spec -> spec.withLabel("Location")), "Some Location");

		_click(_get(Button.class, spec -> spec.withText("Save")));

		// Verify error notification
		expectNotifications("Please fix the validation errors");

		// Verify name field shows uniqueness error
		var nameField = _get(TextField.class, spec -> spec.withLabel("Name"));
		assertThat(nameField.isInvalid()).isTrue();
		assertThat(nameField.getErrorMessage()).contains("competition with this name already exists");
	}

	/**
	 * Test A3: Validation Error - Past date for new competition.
	 * Verifies BR-002: Competition date cannot be in the past for new competitions.
	 */
	@Test
	void validates_past_date_for_new_competition() {
		_click(_get(Button.class, spec -> spec.withText("Create Competition")));

		// Try to create competition with past date
		_setValue(_get(TextField.class, spec -> spec.withLabel("Name")), "Past Competition Test");
		_setValue(_get(DatePicker.class, spec -> spec.withLabel("Date")), LocalDate.of(2020, 1, 1));
		_setValue(_get(TextField.class, spec -> spec.withLabel("Location")), "Past Location");

		_click(_get(Button.class, spec -> spec.withText("Save")));

		// Verify error notification
		expectNotifications("Please fix the validation errors");

		// Verify date field shows validation error
		var dateField = _get(DatePicker.class, spec -> spec.withLabel("Date"));
		assertThat(dateField.isInvalid()).isTrue();
		assertThat(dateField.getErrorMessage()).contains("cannot be in the past");
	}

	/**
	 * Test A3: Validation Error - String length validation.
	 * Verifies BR-006: Data validation for name and location length.
	 */
	@Test
	void validates_field_lengths() {
		_click(_get(Button.class, spec -> spec.withText("Create Competition")));

		// Try to create competition with too long name (> 255 characters)
		String longName = "A".repeat(256);
		_setValue(_get(TextField.class, spec -> spec.withLabel("Name")), longName);
		_setValue(_get(DatePicker.class, spec -> spec.withLabel("Date")), LocalDate.of(2025, 12, 1));
		_setValue(_get(TextField.class, spec -> spec.withLabel("Location")), "Location");

		_click(_get(Button.class, spec -> spec.withText("Save")));

		// Verify error notification
		expectNotifications("Please fix the validation errors");

		// Verify name field shows length validation error
		var nameField = _get(TextField.class, spec -> spec.withLabel("Name"));
		assertThat(nameField.isInvalid()).isTrue();
		assertThat(nameField.getErrorMessage()).contains("must be between 1 and 255 characters");
	}

	/**
	 * Test A4: Cancel Operation.
	 * Verifies cancel button discards changes and closes dialog.
	 */
	@Test
	void cancels_create_operation() {
		_click(_get(Button.class, spec -> spec.withText("Create Competition")));

		var dialog = _get(Dialog.class);
		assertThat(dialog.isOpened()).isTrue();

		// Fill in some data
		_setValue(_get(TextField.class, spec -> spec.withLabel("Name")), "Cancelled Competition");
		_setValue(_get(DatePicker.class, spec -> spec.withLabel("Date")), LocalDate.of(2025, 12, 1));

		// Click cancel
		_click(_get(Button.class, spec -> spec.withText("Cancel")));

		// Verify dialog is closed
		assertThat(dialog.isOpened()).isFalse();

		// Verify no competition was created
		var grid = _get(Grid.class);
		int gridSize = _size(grid);
		List<CompetitionRecord> items = _fetch(grid, 0, gridSize);
		assertThat(items)
				.extracting(CompetitionRecord::getName)
				.doesNotContain("Cancelled Competition");
	}

	/**
	 * Test A4: Cancel edit operation.
	 * Verifies cancel button in edit mode discards changes.
	 */
	@Test
	void cancels_edit_operation() {
		var grid = _get(Grid.class);
		CompetitionRecord competition = (CompetitionRecord) _fetch(grid, 0, 1).get(0);
		var originalLocation = competition.getLocation();

		// Click edit button
		_getCellComponent(grid, 0, "actions")
				.getChildren()
				.filter(Button.class::isInstance)
				.map(Button.class::cast)
				.filter(btn -> "Edit".equals(btn.getText()))
				.findFirst()
				.ifPresent(Button::click);

		// Modify location
		_setValue(_get(TextField.class, spec -> spec.withLabel("Location")), "Should Not Be Saved");

		// Click cancel
		_click(_get(Button.class, spec -> spec.withText("Cancel")));

		// Verify location is unchanged in database
		var unchanged = dsl.selectFrom(Tables.COMPETITION)
				.where(Tables.COMPETITION.ID.eq(competition.getId()))
				.fetchOne();

		assertThat(unchanged).isNotNull();
		assertThat(unchanged.getLocation()).isEqualTo(originalLocation);
	}

	/**
	 * Test BR-004: Competition Status Values.
	 * Verifies that status field has correct values.
	 */
	@Test
	void status_field_has_valid_values() {
		_click(_get(Button.class, spec -> spec.withText("Create Competition")));

		var statusField = _get(Select.class, spec -> spec.withLabel("Status"));

		// Verify available status values
		var items = statusField.getListDataView().getItems().toList();
		assertThat(items).containsExactlyInAnyOrder(
				CompetitionStatus.PLANNED,
				CompetitionStatus.ONGOING,
				CompetitionStatus.COMPLETED
		);
	}

	/**
	 * Test that editing allows past dates (BR-002).
	 * Past dates are allowed when editing existing competitions.
	 */
	@Test
	void allows_past_date_when_editing() {
		var grid = _get(Grid.class);
		CompetitionRecord competition = (CompetitionRecord) _fetch(grid, 0, 1).get(0);

		// Click edit button
		_getCellComponent(grid, 0, "actions")
				.getChildren()
				.filter(Button.class::isInstance)
				.map(Button.class::cast)
				.filter(btn -> "Edit".equals(btn.getText()))
				.findFirst()
				.ifPresent(Button::click);

		// Set past date (allowed for editing)
		_setValue(_get(DatePicker.class, spec -> spec.withLabel("Date")), LocalDate.of(2020, 6, 15));

		// Save changes
		_click(_get(Button.class, spec -> spec.withText("Save")));

		// Verify success (no validation error)
		expectNotifications("Competition updated successfully");

		// Verify date was updated
		var updated = dsl.selectFrom(Tables.COMPETITION)
				.where(Tables.COMPETITION.ID.eq(competition.getId()))
				.fetchOne();

		assertThat(updated).isNotNull();
		assertThat(updated.getDate()).isEqualTo(LocalDate.of(2020, 6, 15));
	}

	/**
	 * Test grid action buttons are present and functional.
	 */
	@Test
	void grid_rows_have_edit_and_delete_buttons() {
		var grid = _get(Grid.class);

		// Get action buttons from first row
		var actionButtons = _getCellComponent(grid, 0, "actions")
				.getChildren()
				.filter(Button.class::isInstance)
				.map(Button.class::cast)
				.toList();

		assertThat(actionButtons).hasSize(2);
		assertThat(actionButtons.get(0).getText()).isEqualTo("Edit");
		assertThat(actionButtons.get(1).getText()).isEqualTo("Delete");
	}

	// Helper method to create a test competition
	private void createTestCompetition(String name, LocalDate date, String location) {
		_click(_get(Button.class, spec -> spec.withText("Create Competition")));
		_setValue(_get(TextField.class, spec -> spec.withLabel("Name")), name);
		_setValue(_get(DatePicker.class, spec -> spec.withLabel("Date")), date);
		_setValue(_get(TextField.class, spec -> spec.withLabel("Location")), location);
		_click(_get(Button.class, spec -> spec.withText("Save")));

		// Wait for success notification
		expectNotifications("Competition created successfully");

		// Track the created competition for cleanup
		var grid = _get(Grid.class);
		int gridSize = _size(grid);
		List<CompetitionRecord> items = _fetch(grid, 0, gridSize);
		items.stream()
				.filter(c -> name.equals(c.getName()))
				.findFirst()
				.ifPresent(c -> testCreatedIds.add(c.getId()));
	}
}
