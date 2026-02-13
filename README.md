# Auto Login Template

A full-stack authentication application with NestJS backend and React frontend, featuring cookie-based JWT authentication, Docker support, and hot reloading in development.

## Features

### Backend (NestJS)
- **JWT Authentication** with access and refresh tokens
- **httpOnly Cookies** for XSS protection
- **Argon2id Password Hashing** (more secure than bcrypt)
- **Refresh Token Rotation** with database storage
- **Drizzle ORM** with PostgreSQL
- **CORS** configured for frontend integration

### Frontend (React + TypeScript)
- **Vite** for fast development and builds
- **Redux Toolkit** for state management
- **Styled Components** with dark gradient theme
- **React Router** for navigation
- **Protected routes** with automatic redirect
- **Automatic token refresh** via Axios interceptors
- **Responsive design** with flexbox and CSS Grid
- **Very large fonts** and modern UI

### DevOps
- **Docker Compose** for development and production
- **Hot Reload** enabled for both frontend and backend
- **Nginx** for production frontend serving

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL 16** - Relational database
- **Drizzle ORM** - TypeScript ORM
- **Passport JWT** - Authentication middleware
- **Argon2** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Styled Components** - CSS-in-JS
- **Axios** - HTTP client

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Production web server

## Project Structure

```
my-auto-login-template/
├── docker-compose.yml              # Development orchestration
├── docker-compose.production.yml   # Production orchestration
├── .env                            # Development environment variables
├── backend/                        # NestJS backend
│   ├── Dockerfile                  # Production Docker image
│   ├── Dockerfile.dev              # Development Docker image
│   ├── package.json                # Dependencies and scripts
│   ├── drizzle.config.ts           # Drizzle ORM configuration
│   └── src/
│       ├── main.ts                 # Application entry point
│       ├── app.module.ts           # Root module
│       ├── config/                 # Configuration files
│       ├── database/               # Database module and schemas
│       ├── auth/                   # Authentication module
│       └── users/                  # Users module
├── frontend/                       # React frontend
│   ├── Dockerfile                  # Production Docker image (nginx)
│   ├── Dockerfile.dev              # Development Docker image
│   ├── nginx.conf                  # Nginx config for production
│   └── src/
│       ├── api/                    # API layer (Axios)
│       ├── components/             # React components
│       │   ├── auth/               # ProtectedRoute
│       │   ├── layout/             # Layout, Header, Container
│       │   └── ui/                 # Box, Button, Input
│       ├── pages/                  # Page components
│       │   ├── Landing.tsx
│       │   ├── Register.tsx
│       │   ├── Login.tsx
│       │   └── Dashboard.tsx
│       ├── store/                  # Redux store & slices
│       ├── styles/                 # Styled components theme
│       └── types/                  # TypeScript types
```

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js 22+ (for local development)
- Yarn package manager

### Development with Docker (Recommended)

Run the full stack with hot reloading:

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access the application:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

This will:
- Start PostgreSQL on port 5432
- Start the NestJS backend on port 3000 with hot reload
- Start the React frontend on port 5173 with hot reload
- Install dependencies automatically
- Mount source code for live updates

### Local Development (Without Docker)

#### Backend
```bash
cd backend

# Install dependencies
yarn install

# Start PostgreSQL (or use Docker)
docker-compose up postgres

# Push database schema
yarn db:push

# Start development server
yarn start:dev
```

#### Frontend
```bash
cd frontend

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Production Setup

```bash
# Build and start production services
docker-compose -f docker-compose.production.yml up --build -d
```

**Access the application:**
- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:3000

Or build locally:

```bash
# Backend
cd backend
yarn build
yarn start:prod

# Frontend
cd frontend
yarn build
# Serve dist/ folder with a web server
```

## API Endpoints

### Authentication

#### Register a new user
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}

Response: Sets httpOnly cookies (accessToken, refreshToken)
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  },
  "message": "Registration successful"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: Sets httpOnly cookies (accessToken, refreshToken)
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  },
  "message": "Login successful"
}
```

#### Refresh tokens
```bash
POST /auth/refresh
Cookie: refreshToken=<token>

Response: Sets new httpOnly cookies
{
  "message": "Tokens refreshed successfully"
}
```

#### Logout
```bash
POST /auth/logout
Cookie: refreshToken=<token>

Response: Clears cookies
{
  "message": "Logged out successfully"
}
```

### Users

#### Get current user profile
```bash
GET /users/me
Cookie: accessToken=<token>

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

## Testing with cURL

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Access protected route
```bash
curl http://localhost:3000/users/me \
  -b cookies.txt
```

### 4. Refresh tokens
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### 5. Logout
```bash
curl -X POST http://localhost:3000/auth/logout \
  -b cookies.txt
```

## Database Management

### Drizzle Kit Commands

All commands should be run inside the backend container:

```bash
# Enter container
docker-compose exec backend sh

# Generate migrations from schema changes
yarn db:generate

# Apply migrations
yarn db:migrate

# Push schema directly (dev only, skips migrations)
yarn db:push

# Open Drizzle Studio (database GUI)
yarn db:studio
```

### Connect to PostgreSQL

```bash
# Using docker-compose
docker-compose exec postgres psql -U authuser -d authdb

# Direct connection
psql postgresql://authuser:authpassword@localhost:5432/authdb
```

## Development Workflow

### Hot Reload

The development setup includes hot reload:
1. Edit any file in `backend/src/`
2. NestJS automatically restarts
3. Changes are immediately available

### View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Postgres only
docker-compose logs -f postgres
```

### Stop Services

```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (deletes database data)
docker-compose down -v
```

## Security Features

- **Argon2id Password Hashing** - Resistant to GPU attacks
- **httpOnly Cookies** - Prevents XSS attacks
- **Refresh Token Rotation** - Stored hashed in database
- **CORS Configuration** - Restricts frontend origins
- **Input Validation** - class-validator DTOs
- **JWT Expiration** - Access: 15min, Refresh: 7 days

## Frontend Routes

- `/` - Landing page with links to register/login
- `/register` - Registration form (email, username, password)
- `/login` - Login form (email, password)
- `/dashboard` - Protected dashboard showing user info

## Authentication Flow

1. **Registration/Login**: User submits credentials → Backend returns user object and sets httpOnly cookies
2. **Protected Routes**: Frontend checks Redux auth state → Redirects to /login if not authenticated
3. **Token Refresh**: Axios interceptor catches 401 errors → Automatically refreshes tokens → Retries original request
4. **Logout**: Clears cookies on backend and Redux state on frontend → Redirects to homepage

## Styling

The frontend uses a dark gradient theme with very large fonts:
- Titles: **4rem (64px)**
- Headings: **3rem (48px)**
- Large text: **2rem (32px)**

Customize the theme in `frontend/src/styles/theme.ts`.

## Troubleshooting

### Port already in use
```bash
# Find process using port 3000 or 5432
lsof -i :3000
lsof -i :5432

# Kill the process
kill -9 <PID>
```

### Database connection issues
```bash
# Check postgres health
docker-compose exec postgres pg_isready -U authuser

# Restart postgres
docker-compose restart postgres
```

### Clear database and start fresh
```bash
# Stop services and remove volumes
docker-compose down -v

# Remove postgres data directory
rm -rf postgres/

# Start services again
docker-compose up
```

## Production Considerations

1. **Environment Variables**:
   - Use strong, randomly generated JWT secrets
   - Never commit `.env` files to version control
   - Use environment-specific configurations

2. **Database**:
   - Set up regular backups
   - Use connection pooling (already configured)
   - Monitor query performance

3. **Security**:
   - Enable HTTPS in production (secure cookies)
   - Implement rate limiting on auth endpoints
   - Add logging and monitoring
   - Consider adding 2FA

4. **Scaling**:
   - Use a reverse proxy (nginx)
   - Implement Redis for session storage
   - Consider database read replicas

## License

MIT
