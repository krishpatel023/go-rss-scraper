.PHONY: backend_build backend_run backend_clean backend_sqlc backend_migrate run

#########
# BACKEND
#########

backend_build:
	@echo "[Backend]: Building..."
	@cd backend && go build -o ./go-rss-scraper.exe
	@echo "[Backend]: Built!"

backend_run: backend_build
	@echo "[Backend]: Running..."
	@cd backend && ./go-rss-scraper.exe

backend_clean:
	@echo "Cleaning up backend..."
	@cd backend && rm -f go-rss-scraper.exe

backend_sqlc:
	@echo "[Backend]: Generating from SQL..."
	@cd backend && sqlc generate
	@echo "[Backend]: Generated from SQL!"

# To run the database migration 
include backend/.env
export $(shell sed 's/=.*//' backend/.env)

backend_migrate_up:
	@echo "[Backend]: Running Up Migration..."
	@if [ -z "$(DATABASE_URL)" ]; then echo "[Backend]: DATABASE_URL is not set! Check your .env file."; exit 1; fi
	@cd backend/database/migrations && goose postgres '$(DATABASE_URL)' up
	@echo "[Backend]: Migrated Up Successfully"

backend_migrate_down:
	@echo "[Backend]: Running Down Migration..."
	@if [ -z "$(DATABASE_URL)" ]; then echo "[Backend]: DATABASE_URL is not set! Check your .env file."; exit 1; fi
	@cd backend/database/migrations && goose postgres '$(DATABASE_URL)' down
	@echo "[Backend]: Migrated Down Successfully"


#Run common
run: backend_run