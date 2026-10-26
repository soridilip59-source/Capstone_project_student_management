# Student Management API

Express and MongoDB backend for the React student management platform.

## Requirements

- Node.js 20 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Set `MONGODB_URI` and a long, private `JWT_SECRET` in `.env`. Keep `.env` out of source control. Set `CLIENT_ORIGIN` to the frontend origin; multiple origins can be comma-separated.

## Run

```powershell
npm run dev
```

The API listens on `http://localhost:5000` by default. Confirm startup at `http://localhost:5000/api/health`.

## Authentication and access

Register with `POST /api/auth/register` using `{ "name", "email", "password" }`. The first account is an administrator; later accounts are staff. Login with `POST /api/auth/login`. Both return a JWT and user object. Send the token as `Authorization: Bearer <token>`.

Authenticated users can read student/course data. Only administrators can create, update, or delete records.

## Endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Health check |
| POST | `/api/auth/register` | Public | Register an account |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Authenticated | Current user |
| GET | `/api/students?page=1&limit=10&search=name&status=Active` | Authenticated | Search and paginate students |
| GET | `/api/students/stats` | Authenticated | Student totals |
| GET/POST | `/api/students`, `/api/students/:id` | Read: authenticated; write: admin | Student CRUD |
| GET/POST | `/api/courses`, `/api/courses/:id` | Read: authenticated; write: admin | Course CRUD |

Student fields: `name`, `email`, optional `phone`, optional `course`, and `status` (`Active` or `Inactive`). Course fields: `name`, optional `description`, and optional `duration`.
