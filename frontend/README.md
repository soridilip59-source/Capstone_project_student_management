# Student Management Platform

## Run locally

1. Start MongoDB locally or configure a MongoDB Atlas connection string.
2. Follow setup and run instructions in [`../backend/README.md`](../backend/README.md).
3. In another terminal, start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

The frontend uses `http://localhost:5000/api` by default. Copy `.env.example` to `.env.local` for local configuration, or set `VITE_API_URL` in the hosting provider to the deployed API URL (including `/api`). Vite embeds this value at build time, so rebuild after changing it. Public signup is disabled: seed the administrator from the backend instructions, then sign in with username or email. Administrators can create staff accounts and manage student records; staff can log in with username or email and view/search records.

Run `npm run build` to create the production frontend build and `npm run lint` to check the React application.
