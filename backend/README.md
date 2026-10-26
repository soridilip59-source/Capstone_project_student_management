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

Set `MONGODB_URI`, a random `JWT_SECRET` of at least 32 characters, and the `ADMIN_USERNAME`, `ADMIN_EMAIL`, and unique `ADMIN_PASSWORD` values in `.env`. The default administrator username in the example is `StudentAdmin`. Admin passwords must be 12-72 characters. Keep `.env` out of source control.

Create the initial administrator once:

```powershell
npm run seed:admin
```

The seed command creates an administrator or adds the configured username to the matching existing administrator. It does not reset an existing admin password. Keep any old `.env` values secret and do not commit the file.

For deployment, configure these variables in the hosting provider instead of uploading `.env`: use `NODE_ENV=production`, the production MongoDB URI, a strong random JWT secret, and the exact HTTPS frontend origin in `CLIENT_ORIGIN`. Configure the same admin seed variables securely and run `npm run seed:admin` once against the production database before opening the app. Do not run the seed command on every application start.

## Run

```powershell
npm run dev
```

The API listens on `http://localhost:5000` by default. Confirm startup at `http://localhost:5000/api/health`.

## Authentication and access

Public registration is disabled. The administrator signs in using the configured username or email and password. Administrators create staff accounts in the dashboard; users can then sign in with either their username or email and password. `POST /api/auth/register` returns `403`. Login with `POST /api/auth/login` using `{ "identifier", "password" }`; it returns a JWT and user object. Send the token as `Authorization: Bearer <token>`.

Authenticated users can read student/course data. Only administrators can create, update, or delete records.

## Endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Health check |
| POST | `/api/auth/register` | Disabled | Public signup is disabled |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Authenticated | Current user |
| GET/POST | `/api/users` | Admin | List users and create staff accounts |
| GET | `/api/students?page=1&limit=10&search=name&status=Active` | Authenticated | Search and paginate students |
| GET | `/api/students/stats` | Authenticated | Student totals |
| GET/POST | `/api/students`, `/api/students/:id` | Read: authenticated; write: admin | Student CRUD |
| GET/POST | `/api/courses`, `/api/courses/:id` | Read: authenticated; write: admin | Course CRUD |

Student fields: `name`, `email`, optional `phone`, optional `course`, and `status` (`Active` or `Inactive`). Course fields: `name`, optional `description`, and optional `duration`.
