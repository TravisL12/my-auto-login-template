# NestJS Authentication Backend

A production-ready NestJS backend with JWT authentication using httpOnly cookies, Drizzle ORM, and PostgreSQL.

## Features

- **JWT Authentication** with access and refresh tokens
- **httpOnly Cookies** for XSS protection
- **Argon2id Password Hashing** (more secure than bcrypt)
- **Refresh Token Rotation** with database storage
- **Drizzle ORM** with PostgreSQL
- **Docker Compose** for development and production
- **Hot Reload** enabled in development mode
- **CORS** configured for frontend integration

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL 16** - Relational database
- **Drizzle ORM** - TypeScript ORM
- **Passport JWT** - Authentication middleware
- **Argon2** - Password hashing
- **Docker & Docker Compose** - Containerization

## Project Structure

```
my-auth-project/
├── docker-compose.yml              # Development orchestration
├── docker-compose.production.yml   # Production orchestration
├── .env                            # Development environment variables
├── .env.production                 # Production environment template
├── backend/
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
```

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js 22+ (for local development)
- Yarn package manager

### Development Setup

1. **Clone the repository** (if applicable) and navigate to the project:
   ```bash
   cd my-auth-project
   ```

2. **Review environment variables** in `.env` (already configured for development)

3. **Start the development environment**:
   ```bash
   docker-compose up
   ```

   This will:
   - Start PostgreSQL on port 5432
   - Start the backend on port 3000 with hot reload
   - Install dependencies automatically
   - Mount source code for live updates

4. **Generate and run database migrations**:
   ```bash
   # Enter the backend container
   docker-compose exec backend sh

   # Generate migrations from schema
   yarn db:generate

   # Apply migrations
   yarn db:migrate

   # Or use push for development (skips migrations)
   yarn db:push
   ```

5. **Verify the server is running**:
   ```bash
   curl http://localhost:3000
   ```

### Production Setup

1. **Configure production environment**:
   - Copy `.env.production` and fill in actual values
   - Generate strong JWT secrets:
     ```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```

2. **Start production services**:
   ```bash
   docker-compose -f docker-compose.production.yml up -d
   ```

3. **Run migrations**:
   ```bash
   docker-compose -f docker-compose.production.yml exec backend sh
   yarn db:migrate
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

## Frontend Integration

When building a React frontend:

1. **Install dependencies**:
   ```bash
   npm install axios
   # or
   yarn add axios
   ```

2. **Configure axios with credentials**:
   ```typescript
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:3000',
     withCredentials: true, // REQUIRED for cookies
   });
   ```

3. **Make requests**:
   ```typescript
   // Register
   await api.post('/auth/register', {
     email: 'user@example.com',
     username: 'username',
     password: 'password123',
   });

   // Login
   await api.post('/auth/login', {
     email: 'user@example.com',
     password: 'password123',
   });

   // Get profile (cookies sent automatically)
   const { data } = await api.get('/users/me');

   // Refresh tokens (cookies sent automatically)
   await api.post('/auth/refresh');

   // Logout
   await api.post('/auth/logout');
   ```

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
