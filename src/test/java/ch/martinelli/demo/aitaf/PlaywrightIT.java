package ch.martinelli.demo.aitaf;

import com.microsoft.playwright.*;
import in.virit.mopo.Mopo;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class PlaywrightIT {

	@LocalServerPort
	protected Integer localServerPort;

	private static Playwright playwright;

	private static Browser browser;

	protected Page page;

	private BrowserContext browserContext;

	protected Mopo mopo;

	@BeforeAll
	static void setUpClass() {
		playwright = Playwright.create();
		BrowserType browserType = playwright.chromium();
		BrowserType.LaunchOptions launchOptions = new BrowserType.LaunchOptions();
		// set to false if you want to see the browser during development
		launchOptions.headless = true;
		browser = browserType.launch(launchOptions);
	}

	@AfterAll
	static void tearDownClass() {
		browser.close();
		playwright.close();
	}

	@BeforeEach
	void setUp() {
		browserContext = browser.newContext();
		page = browserContext.newPage();
		mopo = new Mopo(page);
	}

	@AfterEach
	void tearDown() {
		page.close();
		browserContext.close();
	}

}
