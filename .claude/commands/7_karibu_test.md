Create KaribuTest for the use case #$ARGUMENTS.
Never use Mockito!
Check the KaribuTesting MCP server for guidance.
Use afterMigrate.sql to create the database test data.
Use the test data from the afterMigrate.sql file in tests.
For complex components like Grid or ConfirmDialog there are Karibu test helpers like GridKt or ConfirmDialogKt. Always
check the APIs of these helpers. 