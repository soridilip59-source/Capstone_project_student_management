
import { Link } from "react-router-dom";
import StatCard from "../components/dashboard/StatCard";
import students from "../data/students";
import StudentList from "../components/dashboard/StudentList";

function Dashboard() {
 const stats = [
  {
    id: 1,
    title: "Total Students",
    value: students.length,
    description: "All registered students",
  },
  {
    id: 2,
    title: "Active Students",
    value: students.filter(
      (student) => student.status === "Active"
    ).length,
    description: "Currently active students",
  },
  {
    id: 3,
    title: "Courses",
    value: 0,
    description: "Available courses",
  },
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
            Overview of student activity
          </p>
        </div>

        <Link
          to="/"
          className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
        >
          Back to Welcome
        </Link>
      </header>

      <section
        aria-label="Platform statistics"
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </section>

       <StudentList students={students} />
    </main>
  );
}

export default Dashboard;
