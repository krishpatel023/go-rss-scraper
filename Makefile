.PHONY: backend_build backend_run backend_clean backend_sqlc run

#########
# BACKEND
#########

backend_build:
	@echo "[Backend]: Building..."
	@cd backend && go build -o ./go-rss-scraper.exe
	@echo "[Backend]: Built!"

backend_run: build_backend
	@echo "[Backend]: Running..."
	@cd backend && ./go-rss-scraper.exe

backend_clean:
	@echo "Cleaning up backend..."
	@cd backend && rm -f go-rss-scraper.exe

backend_sqlc:
	@echo "[Backend]: Generating from SQL..."
	@cd backend && sqlc generate
	@echo "[Backend]: Generated from SQL!"
	
#Run common
run: run_backend