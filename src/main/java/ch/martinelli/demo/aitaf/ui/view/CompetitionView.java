package ch.martinelli.demo.aitaf.ui.view;

import ch.martinelli.demo.aitaf.db.tables.records.CompetitionRecord;
import ch.martinelli.demo.aitaf.service.CompetitionService;
import ch.martinelli.demo.aitaf.ui.layout.MainLayout;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.datetimepicker.DateTimePicker;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.grid.ColumnTextAlign;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.IntegerField;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.data.binder.Binder;
import com.vaadin.flow.data.renderer.ComponentRenderer;
import com.vaadin.flow.data.value.ValueChangeMode;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Route(value = "competitions", layout = MainLayout.class)
@PageTitle("Competition Management")
public class CompetitionView extends VerticalLayout {

    private final CompetitionService competitionService;
    private final Grid<CompetitionRecord> grid = new Grid<>(CompetitionRecord.class, false);
    private final TextField searchField = new TextField();
    private final Binder<CompetitionRecord> binder = new Binder<>(CompetitionRecord.class);

    public CompetitionView(CompetitionService competitionService) {
        this.competitionService = competitionService;
        
        setSizeFull();
        setPadding(true);
        setSpacing(true);

        add(createHeader());
        add(createToolbar());
        add(createGrid());

        refreshGrid();
    }

    private HorizontalLayout createHeader() {
        H2 title = new H2("Competition Management");
        HorizontalLayout header = new HorizontalLayout(title);
        header.setWidthFull();
        header.setAlignItems(Alignment.CENTER);
        return header;
    }

    private HorizontalLayout createToolbar() {
        searchField.setPlaceholder("Search competitions...");
        searchField.setPrefixComponent(new Icon(VaadinIcon.SEARCH));
        searchField.setValueChangeMode(ValueChangeMode.LAZY);
        searchField.addValueChangeListener(e -> refreshGrid());
        searchField.setWidth("300px");

        Button addButton = new Button("New Competition", new Icon(VaadinIcon.PLUS));
        addButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        addButton.addClickListener(e -> openCompetitionDialog(new CompetitionRecord()));

        HorizontalLayout toolbar = new HorizontalLayout(searchField, addButton);
        toolbar.setWidthFull();
        toolbar.setJustifyContentMode(JustifyContentMode.BETWEEN);
        return toolbar;
    }

    private Grid<CompetitionRecord> createGrid() {
        grid.setSizeFull();

        grid.addColumn(CompetitionRecord::getName)
                .setHeader("Name")
                .setSortable(true)
                .setFlexGrow(2);

        grid.addColumn(CompetitionRecord::getDate)
                .setHeader("Date")
                .setSortable(true)
                .setWidth("150px");

        grid.addColumn(CompetitionRecord::getLocation)
                .setHeader("Location")
                .setSortable(true)
                .setFlexGrow(1);

        grid.addColumn(CompetitionRecord::getCompetitionType)
                .setHeader("Type")
                .setWidth("120px");

        grid.addColumn(new ComponentRenderer<>(competition -> {
            Span badge = new Span(competition.getStatus());
            badge.getElement().getThemeList().add("badge");
            switch (competition.getStatus()) {
                case "PLANNED" -> badge.getElement().getThemeList().add("contrast");
                case "ACTIVE" -> badge.getElement().getThemeList().add("success");
                case "COMPLETED" -> badge.getElement().getThemeList().add("primary");
                case "CANCELLED" -> badge.getElement().getThemeList().add("error");
                case "ARCHIVED" -> badge.getElement().getStyle().set("background-color", "var(--lumo-shade-20pct)");
            }
            return badge;
        })).setHeader("Status")
                .setWidth("120px");

        grid.addColumn(new ComponentRenderer<>(competition -> {
            int count = competitionService.getRegistrationCount(competition.getId());
            return new Span(String.valueOf(count));
        })).setHeader("Registrations")
                .setWidth("120px")
                .setTextAlign(ColumnTextAlign.CENTER);

        grid.addColumn(new ComponentRenderer<>(this::createActionButtons))
                .setHeader("Actions")
                .setWidth("200px")
                .setFlexGrow(0);

        grid.asSingleSelect().addValueChangeListener(event -> {
            if (event.getValue() != null) {
                viewCompetitionDetails(event.getValue());
            }
        });

        return grid;
    }

    private HorizontalLayout createActionButtons(CompetitionRecord competition) {
        Button editButton = new Button(new Icon(VaadinIcon.EDIT));
        editButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY_INLINE);
        editButton.getElement().setAttribute("title", "Edit");
        editButton.addClickListener(e -> openCompetitionDialog(competition));

        Button deleteButton = new Button(new Icon(VaadinIcon.TRASH));
        deleteButton.addThemeVariants(ButtonVariant.LUMO_ERROR, ButtonVariant.LUMO_TERTIARY_INLINE);
        deleteButton.getElement().setAttribute("title", "Delete");
        deleteButton.addClickListener(e -> confirmDelete(competition));

        Button archiveButton = new Button(new Icon(VaadinIcon.ARCHIVE));
        archiveButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY_INLINE);
        archiveButton.getElement().setAttribute("title", "Archive");
        archiveButton.setVisible(!"ARCHIVED".equals(competition.getStatus()));
        archiveButton.addClickListener(e -> archiveCompetition(competition));

        return new HorizontalLayout(editButton, archiveButton, deleteButton);
    }

    private void openCompetitionDialog(CompetitionRecord competition) {
        Dialog dialog = new Dialog();
        dialog.setHeaderTitle(competition.getId() == null ? "New Competition" : "Edit Competition");
        dialog.setWidth("600px");

        FormLayout formLayout = createCompetitionForm();
        
        binder.setBean(competition.getId() == null ? createNewCompetition() : competition);

        HorizontalLayout buttons = new HorizontalLayout();
        Button saveButton = new Button("Save", e -> {
            if (binder.validate().isOk()) {
                saveCompetition(binder.getBean());
                dialog.close();
            }
        });
        saveButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);

        Button cancelButton = new Button("Cancel", e -> dialog.close());

        buttons.add(saveButton, cancelButton);

        dialog.add(formLayout, buttons);
        dialog.open();
    }

    private FormLayout createCompetitionForm() {
        FormLayout formLayout = new FormLayout();

        TextField nameField = new TextField("Competition Name");
        nameField.setRequiredIndicatorVisible(true);
        binder.forField(nameField)
                .asRequired("Name is required")
                .bind(CompetitionRecord::getName, CompetitionRecord::setName);

        DatePicker dateField = new DatePicker("Start Date");
        dateField.setRequiredIndicatorVisible(true);
        binder.forField(dateField)
                .asRequired("Start date is required")
                .bind(CompetitionRecord::getDate, CompetitionRecord::setDate);

        DatePicker endDateField = new DatePicker("End Date");
        binder.forField(endDateField)
                .bind(CompetitionRecord::getEndDate, CompetitionRecord::setEndDate);

        TextField locationField = new TextField("Location");
        locationField.setRequiredIndicatorVisible(true);
        binder.forField(locationField)
                .asRequired("Location is required")
                .bind(CompetitionRecord::getLocation, CompetitionRecord::setLocation);

        ComboBox<String> typeField = new ComboBox<>("Competition Type");
        typeField.setItems("REGIONAL", "NATIONAL", "CLUB", "INTERNATIONAL");
        typeField.setRequiredIndicatorVisible(true);
        binder.forField(typeField)
                .asRequired("Type is required")
                .bind(CompetitionRecord::getCompetitionType, CompetitionRecord::setCompetitionType);

        ComboBox<String> statusField = new ComboBox<>("Status");
        statusField.setItems("PLANNED", "ACTIVE", "COMPLETED", "CANCELLED", "ARCHIVED");
        statusField.setRequiredIndicatorVisible(true);
        binder.forField(statusField)
                .asRequired("Status is required")
                .bind(CompetitionRecord::getStatus, CompetitionRecord::setStatus);

        TextArea descriptionField = new TextArea("Description");
        descriptionField.setMaxLength(1000);
        binder.forField(descriptionField)
                .bind(CompetitionRecord::getDescription, CompetitionRecord::setDescription);

        DateTimePicker deadlineField = new DateTimePicker("Registration Deadline");
        binder.forField(deadlineField)
                .bind(
                    record -> record.getRegistrationDeadline() != null ? 
                        record.getRegistrationDeadline().atZone(ZoneId.systemDefault()).toLocalDateTime() : null,
                    (record, value) -> record.setRegistrationDeadline(
                        value != null ? value.atZone(ZoneId.systemDefault()).toLocalDateTime() : null)
                );

        IntegerField maxParticipantsField = new IntegerField("Max Participants");
        maxParticipantsField.setMin(0);
        binder.forField(maxParticipantsField)
                .bind(CompetitionRecord::getMaxParticipants, CompetitionRecord::setMaxParticipants);

        TextField contactNameField = new TextField("Contact Name");
        binder.forField(contactNameField)
                .bind(CompetitionRecord::getContactName, CompetitionRecord::setContactName);

        EmailField contactEmailField = new EmailField("Contact Email");
        binder.forField(contactEmailField)
                .bind(CompetitionRecord::getContactEmail, CompetitionRecord::setContactEmail);

        TextField contactPhoneField = new TextField("Contact Phone");
        binder.forField(contactPhoneField)
                .bind(CompetitionRecord::getContactPhone, CompetitionRecord::setContactPhone);

        formLayout.add(nameField, dateField, endDateField, locationField, 
                      typeField, statusField, descriptionField, deadlineField,
                      maxParticipantsField, contactNameField, contactEmailField, contactPhoneField);
        formLayout.setResponsiveSteps(
                new FormLayout.ResponsiveStep("0", 1),
                new FormLayout.ResponsiveStep("500px", 2)
        );
        formLayout.setColspan(descriptionField, 2);

        return formLayout;
    }

    private CompetitionRecord createNewCompetition() {
        CompetitionRecord competition = new CompetitionRecord();
        competition.setStatus("PLANNED");
        competition.setCompetitionType("REGIONAL");
        competition.setDate(LocalDate.now().plusDays(30));
        return competition;
    }

    private void viewCompetitionDetails(CompetitionRecord competition) {
        Dialog dialog = new Dialog();
        dialog.setHeaderTitle("Competition Details");
        dialog.setWidth("600px");

        VerticalLayout content = new VerticalLayout();
        content.add(new Span("Name: " + competition.getName()));
        content.add(new Span("Date: " + competition.getDate()));
        content.add(new Span("Location: " + competition.getLocation()));
        content.add(new Span("Type: " + competition.getCompetitionType()));
        content.add(new Span("Status: " + competition.getStatus()));
        
        if (competition.getDescription() != null) {
            content.add(new Span("Description: " + competition.getDescription()));
        }
        
        int registrations = competitionService.getRegistrationCount(competition.getId());
        content.add(new Span("Registrations: " + registrations));

        Button closeButton = new Button("Close", e -> dialog.close());
        dialog.add(content, closeButton);
        dialog.open();
    }

    private void saveCompetition(CompetitionRecord competition) {
        try {
            if (competition.getId() == null) {
                competitionService.create(competition);
                showNotification("Competition created successfully", NotificationVariant.LUMO_SUCCESS);
            } else {
                competitionService.update(competition);
                showNotification("Competition updated successfully", NotificationVariant.LUMO_SUCCESS);
            }
            refreshGrid();
        } catch (CompetitionService.ValidationException e) {
            showNotification(e.getMessage(), NotificationVariant.LUMO_ERROR);
        } catch (Exception e) {
            showNotification("Error saving competition: " + e.getMessage(), NotificationVariant.LUMO_ERROR);
        }
    }

    private void confirmDelete(CompetitionRecord competition) {
        boolean hasRegistrations = competitionService.hasActiveRegistrations(competition.getId());
        
        ConfirmDialog dialog = new ConfirmDialog();
        dialog.setHeader("Delete Competition");
        
        if (hasRegistrations) {
            dialog.setText("This competition has active registrations. You can archive it instead. Do you want to archive this competition?");
            dialog.setConfirmText("Archive");
            dialog.setConfirmButtonTheme("primary");
            dialog.addConfirmListener(e -> archiveCompetition(competition));
        } else {
            dialog.setText("Are you sure you want to delete this competition?");
            dialog.setConfirmText("Delete");
            dialog.setConfirmButtonTheme("error primary");
            dialog.addConfirmListener(e -> deleteCompetition(competition));
        }
        
        dialog.setCancelable(true);
        dialog.open();
    }

    private void deleteCompetition(CompetitionRecord competition) {
        try {
            competitionService.delete(competition.getId());
            showNotification("Competition deleted successfully", NotificationVariant.LUMO_SUCCESS);
            refreshGrid();
        } catch (CompetitionService.ValidationException e) {
            showNotification(e.getMessage(), NotificationVariant.LUMO_ERROR);
        } catch (Exception e) {
            showNotification("Error deleting competition: " + e.getMessage(), NotificationVariant.LUMO_ERROR);
        }
    }

    private void archiveCompetition(CompetitionRecord competition) {
        try {
            competitionService.archive(competition.getId());
            showNotification("Competition archived successfully", NotificationVariant.LUMO_SUCCESS);
            refreshGrid();
        } catch (Exception e) {
            showNotification("Error archiving competition: " + e.getMessage(), NotificationVariant.LUMO_ERROR);
        }
    }

    public void refreshGrid() {
        String searchTerm = searchField.getValue();
        List<CompetitionRecord> competitions;
        
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            competitions = competitionService.search(searchTerm);
        } else {
            competitions = competitionService.findAll();
        }
        
        grid.setItems(competitions);
    }

    private void showNotification(String message, NotificationVariant variant) {
        Notification notification = Notification.show(message, 3000, Notification.Position.TOP_CENTER);
        notification.addThemeVariants(variant);
    }
}