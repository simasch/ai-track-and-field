package ch.martinelli.demo.aitaf;

import com.github.mvysny.fakeservlet.FakeRequest;
import com.github.mvysny.kaributesting.v10.MockVaadin;
import com.github.mvysny.kaributesting.v10.Routes;
import com.github.mvysny.kaributesting.v10.spring.MockSpringServlet;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.server.VaadinServletRequest;
import com.vaadin.flow.spring.SpringServlet;
import kotlin.jvm.functions.Function0;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Locale;

@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@SpringBootTest
public abstract class KaribuTest {

	private static Routes routes;

	@Autowired
	private ApplicationContext ctx;

	@BeforeAll
	public static void discoverRoutes() {
		Locale.setDefault(Locale.ENGLISH);
		routes = new Routes().autoDiscoverViews("ch.martinelli.demo.aitaf");
	}

	@BeforeEach
	public void setup() {
		final Function0<UI> uiFactory = UI::new;
		final SpringServlet servlet = new MockSpringServlet(routes, ctx, uiFactory);
		MockVaadin.setup(uiFactory, servlet);
	}

	@AfterEach
	public void tearDown() {
		logout();
		MockVaadin.tearDown();
	}

	protected void login(String user, String pass, final List<String> roles) {
		final List<SimpleGrantedAuthority> authorities = roles.stream().map(SimpleGrantedAuthority::new).toList();

		var userDetails = new User(user, pass, authorities);
		var authReq = new UsernamePasswordAuthenticationToken(userDetails, pass, authorities);
		var securityContext = SecurityContextHolder.getContext();
		securityContext.setAuthentication(authReq);

		// however, you also need to make sure that ViewAccessChecker works properly that
		// requires
		// a correct MockRequest.userPrincipal and MockRequest.isUserInRole()
		final var request = (FakeRequest) VaadinServletRequest.getCurrent().getRequest();
		request.setUserPrincipalInt(authReq);
		request.setUserInRole((principal, role) -> roles.contains(role) || roles.contains("ROLE_" + role));
	}

	protected void logout() {
		try {
			SecurityContextHolder.getContext().setAuthentication(null);
			if (VaadinServletRequest.getCurrent() != null) {
				final var request = (FakeRequest) VaadinServletRequest.getCurrent().getRequest();
				request.setUserPrincipalInt(null);
				request.setUserInRole((principal, role) -> false);
			}
		}
		catch (IllegalStateException e) {
			// Ignored
		}
	}

}
