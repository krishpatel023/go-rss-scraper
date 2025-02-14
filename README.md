# RSS Feed Scraper & Aggregator

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Go-1.23.2-blue)](https://golang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791)](https://www.postgresql.org/)

> A modern RSS feed aggregator that helps you stay up-to-date with content from multiple sources in one place. Built with Next.js frontend and Go backend, featuring automatic feed synchronization and a clean, accessible interface.

## 🌟 Overview

This RSS Feed Scraper is a personal project designed to provide a clean, efficient way to track various blogs, news sites, and content creators. Unlike commercial RSS readers, it focuses on simplicity and speed, letting you aggregate all your favorite feeds in one place without unnecessary social features or recommendations.

## ✨ Features

### Feed Management
- **Multiple RSS Sources**: Add any number of RSS feeds from blogs, news sites, and podcasts with automatic feed URL validation and metadata extraction.
- **Automatic Synchronization**: Stay up-to-date with fresh content through our efficient background synchronization system that fetches new articles every minute. Currently limited to 10 feeds at a time but can be easily increased.
- **Feed Validation**: Robust error handling system that validates feed formats and maintains feed health monitoring.

## 🚀 Tech Stack

### Frontend
- Next.js 15.1 with App Router
- TypeScript 5.0
- Tailwind CSS for styling
- ShadcnUI components
- Zod for validation
- Axios for API requests

### Backend
- Go 1.23.2
- Chi router for HTTP routing
- PostgreSQL with SQLC
- JWT authentication
- Bcrypt for password hashing


## 📦 Installation

### Prerequisites
- Go 1.23.2 or higher
- Node.js 18 or higher
- PostgreSQL
- Make (for running Makefile commands)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Go dependencies:
```bash
go mod download
```

3. Create and configure environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` with:
```bash
PORT=8000
DATABASE_URL=postgresql://[user]:[password]@localhost:5432/[dbname]
```

5. Run database migrations:
```bash
make backend_migrate_up
```

6. Build and run the backend:
```bash
# Build the backend
make backend_build

# Run the backend
make backend_run
```

Additional backend commands:
```bash
# Clean up backend build artifacts
make backend_clean

# Generate SQLC code from SQL
make backend_sqlc

# Run database migrations down
make backend_migrate_down
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create and configure environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` with:
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## 🚀 Usage

### Starting the Frontend
```bash
cd frontend
npm run dev
```
Frontend will be available at `http://localhost:3000`

### Starting the Backend
```bash
make backend_run
```
Backend will be available at `http://localhost:8000`

## 🔒 Authentication Flow

The application uses API key-based authentication:
1. User signs up/logs in and receives an API key
2. API key is stored in HTTP-only cookies
3. Subsequent requests include the API key in Authorization header
4. Protected routes verify the API key before processing requests