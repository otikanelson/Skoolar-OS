# EduCore Backend API (NestJS)

## Setup Instructions

### 1. Install Dependencies
```bash
cd educore-os/backend
npm install
```

### 2. Start Development Server
```bash
npm run start:dev
```

The API will run on `http://localhost:3000`

## Authentication Endpoints

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "admin@greenfield.edu",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@greenfield.edu",
    "role": "admin",
    "schoolId": "greenfield",
    "name": "Admin User"
  }
}
```

### Get Profile (Protected)
**GET** `/auth/profile`

Headers:
```
Authorization: Bearer <access_token>
```

### Verify Token
**GET** `/auth/verify`

Headers:
```
Authorization: Bearer <access_token>
```

## Demo Users

All demo users have password: `password123`

| Email | Role | School ID |
|-------|------|-----------|
| admin@greenfield.edu | admin | greenfield |
| teacher@greenfield.edu | teacher | greenfield |
| parent@greenfield.edu | parent | greenfield |
| student@greenfield.edu | student | greenfield |

## Tech Stack

- **Framework**: NestJS
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: class-validator
- **Database**: In-memory (will be replaced with PostgreSQL)

## Project Structure

```
src/
├── auth/
│   ├── dto/
│   │   └── login.dto.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── local-auth.guard.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/
│   ├── users.module.ts
│   └── users.service.ts
├── app.module.ts
└── main.ts
```

## Next Steps

1. Replace in-memory storage with PostgreSQL
2. Add role-based access control (RBAC)
3. Implement refresh tokens
4. Add email verification
5. Add password reset functionality
6. Implement multi-tenant isolation
