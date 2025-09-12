package ch.martinelli.demo.aitaf.ui.views;

import ch.martinelli.demo.aitaf.db.tables.records.CompetitionRecord;
import ch.martinelli.demo.aitaf.service.CompetitionService;
import ch.martinelli.demo.aitaf.ui.MainLayout;
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
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.data.binder.Binder;
import com.vaadin.flow.data.binder.ValidationException;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.lumo.LumoUtility;

import java.time.LocalDate;

@Route(value = "", layout = MainLayout.class)
@PageTitle("Competition Management")
public class CompetitionView extends VerticalLayout {

    private final CompetitionService competitionService;
    private final Grid<CompetitionRecord> grid;
    private final Binder<CompetitionRecord> binder;

    public CompetitionView(CompetitionService competitionService) {
        this.competitionService = competitionService;
        this.grid = new Grid<>(CompetitionRecord.class, false);
        this.binder = new Binder<>(CompetitionRecord.class);

        addClassName(LumoUtility.Padding.MEDIUM);
        setSizeFull();

        configureGrid();
        add(
                createHeader(),
                grid
        );
        updateGrid();
    }

    private HorizontalLayout createHeader() {
        H2 title = new H2("Competitions");
        title.addClassNames(LumoUtility.Margin.NONE);

        Button addButton = new Button("Create New Competition");
        addButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        addButton.addClickListener(e -> openCompetitionDialog(null));

        HorizontalLayout header = new HorizontalLayout(title, addButton);
        header.setWidthFull();
        header.setJustifyContentMode(JustifyContentMode.BETWEEN);
        header.setDefaultVerticalComponentAlignment(Alignment.CENTER);
        header.addClassNames(LumoUtility.Margin.Bottom.MEDIUM);

        return header;
    }

    private void configureGrid() {
        grid.addColumn(CompetitionRecord::getName).setHeader("Name").setSortable(true);
        grid.addColumn(CompetitionRecord::getCompetitionDate).setHeader("Date").setSortable(true);
        grid.addColumn(CompetitionRecord::getLocation).setHeader("Location").setSortable(true);
        
        grid.addComponentColumn(competition -> {
            Button editButton = new Button("Edit");
            editButton.addThemeVariants(ButtonVariant.LUMO_SMALL);
            editButton.addClickListener(e -> openCompetitionDialog(competition));
            
            Button deleteButton = new Button("Delete");
            deleteButton.addThemeVariants(ButtonVariant.LUMO_SMALL, ButtonVariant.LUMO_ERROR);
            deleteButton.addClickListener(e -> confirmDelete(competition));
            
            return new HorizontalLayout(editButton, deleteButton);
        }).setHeader("Actions");

        grid.setSizeFull();
        grid.getColumns().forEach(col -> col.setAutoWidth(true));
    }

    private void openCompetitionDialog(CompetitionRecord competition) {
        Dialog dialog = new Dialog();
        dialog.setHeaderTitle(competition == null ? "Create New Competition" : "Edit Competition");
        dialog.setWidth("500px");

        TextField nameField = new TextField("Competition Name");
        nameField.setWidthFull();
        nameField.setRequired(true);
        nameField.setMaxLength(255);

        DatePicker dateField = new DatePicker("Competition Date");
        dateField.setWidthFull();
        dateField.setRequired(true);

        TextField locationField = new TextField("Location");
        locationField.setWidthFull();
        locationField.setRequired(true);
        locationField.setMaxLength(255);

        binder.forField(nameField)
                .asRequired("Competition name is required")
                .withValidator(name -> name != null && !name.trim().isEmpty(), "Competition name cannot be empty")
                .bind(CompetitionRecord::getName, CompetitionRecord::setName);

        binder.forField(dateField)
                .asRequired("Competition date is required")
                .bind(CompetitionRecord::getCompetitionDate, CompetitionRecord::setCompetitionDate);

        binder.forField(locationField)
                .asRequired("Location is required")
                .withValidator(location -> location != null && !location.trim().isEmpty(), "Location cannot be empty")
                .bind(CompetitionRecord::getLocation, CompetitionRecord::setLocation);

        CompetitionRecord editedCompetition = competition != null ? competition : new CompetitionRecord();
        binder.setBean(editedCompetition);

        FormLayout formLayout = new FormLayout();
        formLayout.add(nameField, dateField, locationField);
        formLayout.setResponsiveSteps(new FormLayout.ResponsiveStep("0", 1));

        Button saveButton = new Button("Save", e -> {
            try {
                binder.writeBean(editedCompetition);
                
                if (dateField.getValue().isBefore(LocalDate.now())) {
                    ConfirmDialog confirmDialog = new ConfirmDialog();
                    confirmDialog.setHeader("Past Date Selected");
                    confirmDialog.setText("The selected date is in the past. Do you want to continue?");
                    confirmDialog.setCancelable(true);
                    confirmDialog.setConfirmText("Continue");
                    confirmDialog.setCancelText("Change Date");
                    confirmDialog.addConfirmListener(event -> saveCompetition(editedCompetition, competition == null, dialog));
                    confirmDialog.open();
                } else if (competition == null && competitionService.isDuplicateCompetition(
                        editedCompetition.getName(), editedCompetition.getCompetitionDate())) {
                    ConfirmDialog confirmDialog = new ConfirmDialog();
                    confirmDialog.setHeader("Duplicate Competition");
                    confirmDialog.setText("A competition with the same name and date already exists. Do you want to continue?");
                    confirmDialog.setCancelable(true);
                    confirmDialog.setConfirmText("Continue");
                    confirmDialog.setCancelText("Cancel");
                    confirmDialog.addConfirmListener(event -> saveCompetition(editedCompetition, true, dialog));
                    confirmDialog.open();
                } else {
                    saveCompetition(editedCompetition, competition == null, dialog);
                }
            } catch (ValidationException ex) {
                Notification.show("Please correct the errors and try again", 3000, Notification.Position.MIDDLE)
                        .addThemeVariants(NotificationVariant.LUMO_ERROR);
            }
        });
        saveButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);

        Button cancelButton = new Button("Cancel", e -> dialog.close());

        HorizontalLayout buttonLayout = new HorizontalLayout(saveButton, cancelButton);
        buttonLayout.setJustifyContentMode(JustifyContentMode.END);
        buttonLayout.setWidthFull();

        VerticalLayout dialogLayout = new VerticalLayout(formLayout, buttonLayout);
        dialogLayout.setPadding(false);
        dialogLayout.setSpacing(true);

        dialog.add(dialogLayout);
        dialog.open();
    }

    private void saveCompetition(CompetitionRecord competition, boolean isNew, Dialog dialog) {
        try {
            if (isNew) {
                competitionService.createCompetition(
                        competition.getName(),
                        competition.getCompetitionDate(),
                        competition.getLocation()
                );
                Notification.show("Competition created successfully", 3000, Notification.Position.BOTTOM_CENTER)
                        .addThemeVariants(NotificationVariant.LUMO_SUCCESS);
            } else {
                competitionService.updateCompetition(competition);
                Notification.show("Competition updated successfully", 3000, Notification.Position.BOTTOM_CENTER)
                        .addThemeVariants(NotificationVariant.LUMO_SUCCESS);
            }
            updateGrid();
            dialog.close();
        } catch (Exception e) {
            Notification.show("Error: " + e.getMessage(), 5000, Notification.Position.MIDDLE)
                    .addThemeVariants(NotificationVariant.LUMO_ERROR);
        }
    }

    private void confirmDelete(CompetitionRecord competition) {
        ConfirmDialog dialog = new ConfirmDialog();
        dialog.setHeader("Delete Competition");
        dialog.setText("Are you sure you want to delete the competition '" + competition.getName() + "'?");
        dialog.setCancelable(true);
        dialog.setConfirmText("Delete");
        dialog.setConfirmButtonTheme("error primary");
        dialog.addConfirmListener(e -> {
            try {
                competitionService.deleteCompetition(competition.getId());
                Notification.show("Competition deleted successfully", 3000, Notification.Position.BOTTOM_CENTER)
                        .addThemeVariants(NotificationVariant.LUMO_SUCCESS);
                updateGrid();
            } catch (Exception ex) {
                Notification.show("Error deleting competition: " + ex.getMessage(), 5000, Notification.Position.MIDDLE)
                        .addThemeVariants(NotificationVariant.LUMO_ERROR);
            }
        });
        dialog.open();
    }

    private void updateGrid() {
        grid.setItems(competitionService.findAll());
    }
}