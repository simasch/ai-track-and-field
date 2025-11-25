Create Playwright test for the use case #$ARGUMENTS.
Never use Mockito!
Use existing test data from src/test/resources/db/migration.
Don't accces a service, repository or DSLContext.
Make sure to remove data that was created during the tests but don't delete all data.
Use AssertJ assertions.
Extend from PlaywrightIT