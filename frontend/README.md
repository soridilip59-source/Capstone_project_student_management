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

The frontend uses `http://localhost:5000/api` by default. Set `VITE_API_URL` to override it. Create the first account from the Register page; the first account becomes the administrator. Administrators can create, edit, and delete students; staff can view and search records.

Run `npm run build` to create the production frontend build and `npm run lint` to check the React application.
