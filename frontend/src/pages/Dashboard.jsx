
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatCard from "../components/dashboard/StatCard";
import StudentList from "../components/dashboard/StudentList";
import AdminUserManager from "../components/dashboard/AdminUserManager";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, courses: 0 });
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const loadStats = useCallback(async () => {
    try {
      const [studentResponse, courseResponse] = await Promise.all([
        api.get("/students/stats"),
        api.get("/courses", { params: { page: 1, limit: 1 } }),
      ]);
      setStats({
        total: studentResponse.data.total,
        active: studentResponse.data.active,
        courses: courseResponse.data.pagination.total,
      });
      setError("");
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } else {
        setError(requestError.response?.data?.message || "Unable to load dashboard data.");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadStats();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadStats]);

  const cards = [
    { id: 1, title: "Total Students", value: stats.total, description: "All registered students" },
    { id: 2, title: "Active Students", value: stats.active, description: "Currently active students" },
    { id: 3, title: "Courses", value: stats.courses, description: "Available courses" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Student Management Platform
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Overview of student activity · Signed in as {user.username || user.email || "user"}
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/" className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/10">
            Back to Welcome
          </Link>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login", { replace: true });
            }}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </header>

      {error && <p role="alert" className="mt-5 text-sm text-red-400">{error}</p>}

      <section
        aria-label="Platform statistics"
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {cards.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </section>

      {user.role === "admin" && <AdminUserManager />}

      <StudentList role={user.role} onStudentsChanged={loadStats} />
    </main>
  );
}

export default Dashboard;
