# Database dump commands for schema
pg_dump --username=<USERNAME> --password --dbname=<DB_NAME> --column-inserts --schema-only --schema=<SCHEMA> --file=<FILE_NAME>

# Database dump commands for data
pg_dump --username=<USERNAME> --password --dbname=<DB_NAME> --column-inserts --data-only  --schema=<SCHEMA> --file=<FILE_NAME>
