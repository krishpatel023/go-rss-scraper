.PHONY: build_backend run_backend run clean_backend

# Build the Go project inside the backend folder
build_backend:
	@echo "[Backend]: Building..."
	@cd backend && go build -o ./go-rss-scraper.exe
	@echo "[Backend]: Built!"

# Run the executable
run_backend: build_backend
	@echo "[Backend]: Running..."
	@cd backend && ./go-rss-scraper.exe


#Run common
run: run_backend

# Clean the built executable
clean_backend:
	@echo "Cleaning up backend..."
	@cd backend && rm -f go-rss-scraper.exe
