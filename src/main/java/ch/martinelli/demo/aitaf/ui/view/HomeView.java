package ch.martinelli.demo.aitaf.ui.view;

import ch.martinelli.demo.aitaf.ui.layout.MainLayout;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

@Route(value = "", layout = MainLayout.class)
@PageTitle("AI Track & Field")
public class HomeView extends VerticalLayout {

    public HomeView() {
        setSizeFull();
        setAlignItems(Alignment.CENTER);
        setJustifyContentMode(JustifyContentMode.CENTER);

        H1 title = new H1("Welcome to AI Track & Field Competition System");
        Paragraph description = new Paragraph("Manage competitions, athletes, and track results with ease.");
        
        add(title, description);
    }
}