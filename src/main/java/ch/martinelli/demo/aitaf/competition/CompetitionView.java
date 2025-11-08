package ch.martinelli.demo.aitaf.competition;

import ch.martinelli.demo.aitaf.db.enums.CompetitionStatus;
import ch.martinelli.demo.aitaf.db.tables.records.CompetitionRecord;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.select.Select;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.data.binder.Binder;
import com.vaadin.flow.data.binder.ValidationException;
import com.vaadin.flow.data.validator.StringLengthValidator;
import com.vaadin.flow.router.Route;

import java.time.LocalDate;

/**
 * View for managing competitions (UC-001).
 * Provides CRUD operations for track and field competitions.
 */
@Route("")
public class CompetitionView extends VerticalLayout {

    private final CompetitionService competitionService;
    private final Grid<CompetitionRecord> grid;
    private final Binder<CompetitionRecord> binder;

    public CompetitionView(CompetitionService competitionService) {
        this.competitionService = competitionService;
        this.binder = new Binder<>(CompetitionRecord.class);

        setSizeFull();
        setPadding(true);

        // Header with title and create button
        H2 title = new H2("Competition Management");
        Button createButton = new Button("Create Competition");
        createButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        createButton.addClickListener(e -> openCompetitionDialog(null));

        HorizontalLayout header = new HorizontalLayout(title, createButton);
        header.setWidthFull();
        header.setAlignItems(FlexComponent.Alignment.CENTER);
        header.expand(title);

        // Configure grid
        grid = new Grid<>(CompetitionRecord.class, false);
        grid.addColumn(CompetitionRecord::getName)
                .setHeader("Name")
                .setAutoWidth(true)
                .setFlexGrow(1);
        grid.addColumn(competitionRecord -> competitionRecord.getDate().toString())
                .setHeader("Date")
                .setAutoWidth(true);
        grid.addColumn(CompetitionRecord::getLocation)
                .setHeader("Location")
                .setAutoWidth(true);
        grid.addColumn(competitionRecord -> formatStatus(competitionRecord.getStatus()))
                .setHeader("Status")
                .setAutoWidth(true);

        // Action column with Edit and Delete buttons
        grid.addComponentColumn(competition -> {
            Button editButton = new Button("Edit");
            editButton.addThemeVariants(ButtonVariant.LUMO_SMALL);
            editButton.addClickListener(e -> openCompetitionDialog(competition));

            Button deleteButton = new Button("Delete");
            deleteButton.addThemeVariants(ButtonVariant.LUMO_SMALL, ButtonVariant.LUMO_ERROR);
            deleteButton.addClickListener(e -> confirmDelete(competition));

            return new HorizontalLayout(editButton, deleteButton);
        }).setHeader("Actions").setAutoWidth(true);

        grid.setSizeFull();

        add(header, grid);
        refreshGrid();
    }

    /**
     * Opens a dialog for creating or editing a competition.
     *
     * @param competition the competition to edit, or null to create a new one
     */
    private void openCompetitionDialog(CompetitionRecord competition) {
        boolean isNew = competition == null;
        CompetitionRecord editedCompetition;

        if (isNew) {
            editedCompetition = new CompetitionRecord();
        } else {
            // Create a copy and preserve the ID for editing
            editedCompetition = competition.copy();
            editedCompetition.setId(competition.getId());
        }

        Dialog dialog = new Dialog();
        dialog.setHeaderTitle(isNew ? "Create Competition" : "Edit Competition");
        dialog.setWidth("500px");

        // Create form fields
        TextField nameField = new TextField("Name");
        nameField.setWidthFull();
        nameField.setRequired(true);

        DatePicker dateField = new DatePicker("Date");
        dateField.setWidthFull();
        dateField.setRequired(true);

        TextField locationField = new TextField("Location");
        locationField.setWidthFull();
        locationField.setRequired(true);

        Select<CompetitionStatus> statusField = new Select<>();
        statusField.setLabel("Status");
        statusField.setItems(CompetitionStatus.PLANNED, CompetitionStatus.ONGOING, CompetitionStatus.COMPLETED);
        statusField.setItemLabelGenerator(this::formatStatus);
        statusField.setWidthFull();

        // Configure binder with validation
        binder.forField(nameField)
                .asRequired("Name is required")
                .withValidator(new StringLengthValidator(
                        "Name must be between 1 and 255 characters",
                        1, 255))
                .withValidator(name -> {
                    // BR-001: Check name uniqueness
                    return competitionService.isNameUnique(name, editedCompetition.getId());
                }, "A competition with this name already exists")
                .bind(CompetitionRecord::getName, CompetitionRecord::setName);

        binder.forField(dateField)
                .asRequired("Date is required")
                .withValidator(date -> {
                    if (isNew) {
                        return !date.isBefore(LocalDate.now());
                    }
                    return true;
                }, "Date cannot be in the past for new competitions")
                .bind(CompetitionRecord::getDate, CompetitionRecord::setDate);

        binder.forField(locationField)
                .asRequired("Location is required")
                .withValidator(new StringLengthValidator(
                        "Location must be between 1 and 255 characters",
                        1, 255))
                .bind(CompetitionRecord::getLocation, CompetitionRecord::setLocation);

        binder.forField(statusField)
                .bind(CompetitionRecord::getStatus, CompetitionRecord::setStatus);

        // Read the bean into the form
        binder.readBean(editedCompetition);

        // Create form layout
        FormLayout formLayout = new FormLayout(nameField, dateField, locationField, statusField);
        formLayout.setResponsiveSteps(new FormLayout.ResponsiveStep("0", 1));

        dialog.add(formLayout);

        // Footer buttons
        Button cancelButton = new Button("Cancel", e -> {
            binder.removeBean();
            dialog.close();
        });
        cancelButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY);

        Button saveButton = new Button("Save", e -> {
            try {
                binder.writeBean(editedCompetition);

                competitionService.save(editedCompetition);
                showNotification(
                        isNew ? "Competition created successfully" : "Competition updated successfully",
                        NotificationVariant.LUMO_SUCCESS);

                refreshGrid();
                binder.removeBean();
                dialog.close();
            } catch (ValidationException ex) {
                // Validation errors are already shown in the form fields
                showNotification("Please fix the validation errors", NotificationVariant.LUMO_ERROR);
            }
        });
        saveButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);

        dialog.getFooter().add(cancelButton, saveButton);

        dialog.open();
    }

    /**
     * Shows a confirmation dialog before deleting a competition.
     * Implements BR-005 with warning if competition has results.
     *
     * @param competition the competition to delete
     */
    private void confirmDelete(CompetitionRecord competition) {
        ConfirmDialog confirmDialog = new ConfirmDialog();
        confirmDialog.setHeader("Delete Competition");

        String message = "Are you sure you want to delete the competition '" + competition.getName() + "'?";
        if (competitionService.hasResults(competition.getId())) {
            message += "\n\nWarning: This competition has recorded results. All results will be permanently deleted.";
        }
        confirmDialog.setText(message);

        confirmDialog.setCancelable(true);
        confirmDialog.setCancelText("Cancel");

        confirmDialog.setConfirmText("Delete");
        confirmDialog.setConfirmButtonTheme("error primary");

        confirmDialog.addConfirmListener(e -> {
            boolean deleted = competitionService.delete(competition.getId());
            if (deleted) {
                showNotification("Competition deleted successfully", NotificationVariant.LUMO_SUCCESS);
                refreshGrid();
            } else {
                showNotification("Competition not found", NotificationVariant.LUMO_ERROR);
            }
        });

        confirmDialog.open();
    }

    /**
     * Refreshes the grid data from the database.
     */
    private void refreshGrid() {
        grid.setItems(competitionService.findAll());
    }

    /**
     * Formats competition status for display.
     *
     * @param status the status enum value
     * @return formatted status string
     */
    private String formatStatus(CompetitionStatus status) {
        if (status == null) {
            return "";
        }
        return switch (status) {
            case PLANNED -> "Planned";
            case ONGOING -> "Ongoing";
            case COMPLETED -> "Completed";
        };
    }

    /**
     * Shows a notification message.
     *
     * @param message the message to display
     * @param variant the notification variant (success, error, etc.)
     */
    private void showNotification(String message, NotificationVariant variant) {
        Notification notification = Notification.show(message, 3000, Notification.Position.TOP_CENTER);
        notification.addThemeVariants(variant);
    }
}
