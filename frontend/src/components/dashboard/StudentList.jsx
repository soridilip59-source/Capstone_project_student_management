import api from "../../services/api";
import {useEffect, useState } from "react";

function StudentList({ students }) {
  const [search, setSearch] = useState("");
  const [studentsData, setStudentsData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">
        Student Records
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Total records: {filteredStudents.length}
      </p>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by student name..."
        aria-label="Search students by name"
        className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-cyan-400"
      />

      <div className="mt-5 space-y-3">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 p-4"
            >
              <div>
                <h3 className="font-semibold">
                  {student.name}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {student.email}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  student.status === "Active"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {student.status}
              </span>
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-slate-400">
            No students found.
          </p>
        )}
      </div>
    </section>
  );
}

export default StudentList;
