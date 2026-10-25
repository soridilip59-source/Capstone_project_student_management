
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold text-cyan-400">
        Student Dashboard
      </h1>

      <p className="mt-3 text-slate-300">
        Welcome to your Student Management Platform!
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Total Students</h2>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-xl bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Active Students</h2>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-xl bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Courses</h2>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
      >
        Back to Welcome
      </Link>
    </main>
  );
}

export default Dashboard;
