package ch.martinelli.demo.aitaf.competition;

import ch.martinelli.demo.aitaf.PlaywrightIT;
import com.microsoft.playwright.Locator;
import in.virit.mopo.GridPw;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Playwright integration tests for UC-001: Manage Competitions.
 * Tests use existing test data from src/test/resources/db/migration/V999__test_data_competitions.sql
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CompetitionViewIT extends PlaywrightIT {

    @Test
    @Order(1)
    void shouldDisplayExistingCompetitions() {
        page.navigate("http://localhost:%d/".formatted(localServerPort));
        mopo.waitForConnectionToSettle();

        GridPw gridPw = new GridPw(page);
        // Caution! This test runs in the browser and depending on the view port not all rows are rendered.
        Assertions.assertThat(gridPw.getRenderedRowCount()).isGreaterThanOrEqualTo(4);

        // Verify that at least one known competition from test data exists
        // Data is ordered by date descending: Summer Track Meet (2025-07-20) should be present
        int summerTrackIndex = findRowByName(gridPw, "Summer Track Meet");
        Assertions.assertThat(summerTrackIndex).isGreaterThanOrEqualTo(0);

        // Spring Athletics Championship should also be present
        int springChampionshipIndex = findRowByName(gridPw, "Spring Athletics Championship");
        Assertions.assertThat(springChampionshipIndex).isGreaterThanOrEqualTo(0);
    }

    @Test
    @Order(2)
    void shouldCreateNewCompetition() {
        page.navigate("http://localhost:%d/".formatted(localServerPort));
        mopo.waitForConnectionToSettle();

        // Click Create Competition button
        page.locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Create Competition")).click();
        mopo.waitForConnectionToSettle();

        // Fill in the form
        String testCompetitionName = "Test Competition " + System.currentTimeMillis();
        LocalDate futureDate = LocalDate.now().plusMonths(1);

        Locator nameField = page.locator("vaadin-text-field")
                .filter(new Locator.FilterOptions().setHasText("Name"))
                .locator("input");
        nameField.fill(testCompetitionName);

        // Fill date using type() method with clear to handle overlay properly
        Locator dateField = page.locator("vaadin-date-picker")
                .filter(new Locator.FilterOptions().setHasText("Date"))
                .locator("input");
        dateField.click();
        // Clear any existing value and type the date
        dateField.clear();
        dateField.type(futureDate.format(DateTimeFormatter.ofPattern("M/d/yyyy")));
        // Press Enter to confirm the date and close overlay
        dateField.press("Enter");
        mopo.waitForConnectionToSettle();

        Locator locationField = page.locator("vaadin-text-field")
                .filter(new Locator.FilterOptions().setHasText("Location"))
                .locator("input");
        locationField.fill("Test Location");

        // Save - status defaults to Planned so we don't need to select it
        page.locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Save")).click();
        mopo.waitForConnectionToSettle();

        // Verify success notification
        Locator notification = page.locator("vaadin-notification-card");
        Assertions.assertThat(notification.innerText()).contains("Competition created successfully");

        // Verify the new competition appears in the grid
        GridPw gridPw = new GridPw(page);
        boolean found = false;
        for (int i = 0; i < gridPw.getRenderedRowCount(); i++) {
            if (gridPw.getRow(i).getCell(0).innerText().equals(testCompetitionName)) {
                found = true;
                break;
            }
        }
        Assertions.assertThat(found).isTrue();

        // Cleanup: Delete the created competition
        deleteCompetitionByName(testCompetitionName);
    }

    @Test
    @Order(3)
    void shouldEditExistingCompetition() {
        page.navigate("http://localhost:%d/".formatted(localServerPort));
        mopo.waitForConnectionToSettle();

        GridPw gridPw = new GridPw(page);

        // Find Summer Track Meet and edit it
        int rowIndex = findRowByName(gridPw, "Summer Track Meet");
        Assertions.assertThat(rowIndex).isGreaterThanOrEqualTo(0);

        // Click Edit button in the actions column
        GridPw.RowPw row = gridPw.getRow(rowIndex);
        row.getCell(4).locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Edit")).click();
        mopo.waitForConnectionToSettle();

        // Modify the location
        Locator locationField = page.locator("vaadin-text-field")
                .filter(new Locator.FilterOptions().setHasText("Location"))
                .locator("input");
        String originalLocation = locationField.inputValue();
        locationField.fill("Updated Location");

        // Save
        page.locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Save")).click();
        mopo.waitForConnectionToSettle();

        // Verify success notification
        Locator notification = page.locator("vaadin-notification-card");
        Assertions.assertThat(notification.innerText()).contains("Competition updated successfully");

        // Verify the change in the grid
        mopo.waitForConnectionToSettle();
        gridPw = new GridPw(page);
        rowIndex = findRowByName(gridPw, "Summer Track Meet");
        Assertions.assertThat(gridPw.getRow(rowIndex).getCell(2).innerText()).isEqualTo("Updated Location");

        // Revert the change back to original
        gridPw.getRow(rowIndex).getCell(4).locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Edit")).click();
        mopo.waitForConnectionToSettle();
        locationField = page.locator("vaadin-text-field")
                .filter(new Locator.FilterOptions().setHasText("Location"))
                .locator("input");
        locationField.fill(originalLocation);
        page.locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Save")).click();
        mopo.waitForConnectionToSettle();
    }

    @Test
    @Order(4)
    void shouldDeleteCompetition() {
        // First create a competition to delete
        page.navigate("http://localhost:%d/".formatted(localServerPort));
        mopo.waitForConnectionToSettle();

        String competitionToDelete = "Competition To Delete " + System.currentTimeMillis();
        createCompetition(competitionToDelete, "Delete Test Location");

        // Now delete it
        GridPw gridPw = new GridPw(page);
        int rowIndex = findRowByName(gridPw, competitionToDelete);
        Assertions.assertThat(rowIndex).isGreaterThanOrEqualTo(0);

        // Click Delete button
        gridPw.getRow(rowIndex).getCell(4).locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Delete")).click();
        mopo.waitForConnectionToSettle();

        // Confirm deletion in the dialog overlay
        page.locator("vaadin-confirm-dialog-overlay vaadin-button[slot='confirm-button']").click();
        mopo.waitForConnectionToSettle();

        // Verify success notification - use filter to find the specific notification
        Locator notification = page.locator("vaadin-notification-card")
                .filter(new Locator.FilterOptions().setHasText("Competition deleted successfully"));
        Assertions.assertThat(notification.first().innerText()).contains("Competition deleted successfully");

        // Verify the competition is no longer in the grid
        gridPw = new GridPw(page);
        rowIndex = findRowByName(gridPw, competitionToDelete);
        Assertions.assertThat(rowIndex).isEqualTo(-1);
    }

    @Test
    @Order(5)
    void shouldCancelCreateOperation() {
        page.navigate("http://localhost:%d/".formatted(localServerPort));
        mopo.waitForConnectionToSettle();

        GridPw gridPw = new GridPw(page);
        int initialRowCount = gridPw.getRenderedRowCount();

        // Click Create Competition button
        page.locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Create Competition")).click();
        mopo.waitForConnectionToSettle();

        // Fill in some data
        Locator nameField = page.locator("vaadin-text-field")
                .filter(new Locator.FilterOptions().setHasText("Name"))
                .locator("input");
        nameField.fill("Cancelled Competition");

        // Click Cancel
        page.locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Cancel")).click();
        mopo.waitForConnectionToSettle();

        // Verify the grid still has the same number of rows
        gridPw = new GridPw(page);
        Assertions.assertThat(gridPw.getRenderedRowCount()).isEqualTo(initialRowCount);
    }

    @Test
    @Order(6)
    void shouldShowValidationErrors() {
        page.navigate("http://localhost:%d/".formatted(localServerPort));
        mopo.waitForConnectionToSettle();

        // Click Create Competition button
        page.locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Create Competition")).click();
        mopo.waitForConnectionToSettle();

        // Try to save without filling required fields
        page.locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Save")).click();
        mopo.waitForConnectionToSettle();

        // Verify error notification
        Locator notification = page.locator("vaadin-notification-card");
        Assertions.assertThat(notification.innerText()).contains("Please fix the validation errors");

        // Close the dialog
        page.locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Cancel")).click();
        mopo.waitForConnectionToSettle();
    }

    /**
     * Helper method to find a row by competition name.
     *
     * @param gridPw the grid
     * @param name   the competition name to find
     * @return the row index, or -1 if not found
     */
    private int findRowByName(GridPw gridPw, String name) {
        for (int i = 0; i < gridPw.getRenderedRowCount(); i++) {
            if (gridPw.getRow(i).getCell(0).innerText().equals(name)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Helper method to create a competition.
     *
     * @param name     the competition name
     * @param location the competition location
     */
    private void createCompetition(String name, String location) {
        page.locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Create Competition")).click();
        mopo.waitForConnectionToSettle();

        LocalDate futureDate = LocalDate.now().plusMonths(1);

        Locator nameField = page.locator("vaadin-text-field")
                .filter(new Locator.FilterOptions().setHasText("Name"))
                .locator("input");
        nameField.fill(name);

        // Fill date using type() method with clear to handle overlay properly
        Locator dateField = page.locator("vaadin-date-picker")
                .filter(new Locator.FilterOptions().setHasText("Date"))
                .locator("input");
        dateField.click();
        // Clear any existing value and type the date
        dateField.clear();
        dateField.type(futureDate.format(DateTimeFormatter.ofPattern("M/d/yyyy")));
        // Press Enter to confirm the date and close overlay
        dateField.press("Enter");
        mopo.waitForConnectionToSettle();

        Locator locationField = page.locator("vaadin-text-field")
                .filter(new Locator.FilterOptions().setHasText("Location"))
                .locator("input");
        locationField.fill(location);

        // Save - status defaults to Planned so we don't need to select it
        page.locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Save")).click();
        mopo.waitForConnectionToSettle();
    }

    /**
     * Helper method to delete a competition by name.
     *
     * @param name the competition name to delete
     */
    private void deleteCompetitionByName(String name) {
        GridPw gridPw = new GridPw(page);
        int rowIndex = findRowByName(gridPw, name);
        if (rowIndex >= 0) {
            gridPw.getRow(rowIndex).getCell(4).locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Delete")).click();
            mopo.waitForConnectionToSettle();
            // Click the confirm button in the confirm dialog overlay
            page.locator("vaadin-confirm-dialog-overlay vaadin-button[slot='confirm-button']").click();
            mopo.waitForConnectionToSettle();
        }
    }
}