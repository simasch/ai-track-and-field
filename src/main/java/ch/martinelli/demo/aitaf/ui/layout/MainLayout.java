package ch.martinelli.demo.aitaf.ui.layout;

import ch.martinelli.demo.aitaf.ui.view.CompetitionView;
import com.vaadin.flow.component.applayout.AppLayout;
import com.vaadin.flow.component.applayout.DrawerToggle;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Header;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.Scroller;
import com.vaadin.flow.component.sidenav.SideNav;
import com.vaadin.flow.component.sidenav.SideNavItem;
import com.vaadin.flow.router.Layout;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.flow.theme.lumo.LumoUtility;

@Layout
@AnonymousAllowed
public class MainLayout extends AppLayout {

    public MainLayout() {
        setPrimarySection(Section.DRAWER);
        addHeaderContent();
        addDrawerContent();
    }

    private void addHeaderContent() {
        DrawerToggle toggle = new DrawerToggle();
        toggle.setAriaLabel("Menu toggle");

        H1 title = new H1("AI Track & Field");
        title.addClassNames(LumoUtility.FontSize.LARGE, LumoUtility.Margin.NONE);

        Header header = new Header(toggle, title);
        header.addClassNames(LumoUtility.AlignItems.CENTER, LumoUtility.Display.FLEX,
                LumoUtility.Padding.End.MEDIUM, LumoUtility.Width.FULL);

        addToNavbar(true, header);
    }

    private void addDrawerContent() {
        Scroller scroller = new Scroller(createNavigation());
        addToDrawer(scroller);
    }

    private SideNav createNavigation() {
        SideNav nav = new SideNav();

        nav.addItem(new SideNavItem("Competitions", CompetitionView.class, 
                new Icon(VaadinIcon.TROPHY)));
        nav.addItem(new SideNavItem("Athletes", "athletes", 
                new Icon(VaadinIcon.GROUP)));
        nav.addItem(new SideNavItem("Categories", "categories", 
                new Icon(VaadinIcon.TAGS)));
        nav.addItem(new SideNavItem("Events", "events", 
                new Icon(VaadinIcon.FLAG_CHECKERED)));
        nav.addItem(new SideNavItem("Registrations", "registrations", 
                new Icon(VaadinIcon.FORM)));
        nav.addItem(new SideNavItem("Results", "results", 
                new Icon(VaadinIcon.CHART)));
        nav.addItem(new SideNavItem("Clubs", "clubs", 
                new Icon(VaadinIcon.BUILDING)));

        return nav;
    }
}