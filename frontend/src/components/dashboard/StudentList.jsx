import api from "../../services/api";
import { useCallback, useEffect, useState } from "react";

const emptyForm = { name: "", email: "", phone: "", course: "", status: "Active" };

function StudentList({ role, onStudentsChanged }) {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadStudents = useCallback(async (page = 1, query = search) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/students", {
        params: { page, limit: 10, search: query },
      });
      setStudents(data.students);
      setPagination(data.pagination);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load student records.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadStudents(1);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [loadStudents]);

  function beginEdit(student) {
    setEditingId(student._id);
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      course: student.course || "",
      status: student.status,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, form);
      } else {
        await api.post("/students", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadStudents(1);
      onStudentsChanged();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save the student.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.name}'s record?`)) {
      return;
    }
    setError("");
    try {
      await api.delete(`/students/${student._id}`);
      await loadStudents(Math.min(pagination.page, Math.max(pagination.pages - 1, 1)));
      onStudentsChanged();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete the student.");
    }
  }

  return (
    <section className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Student Records</h2>

      <p className="mt-2 text-sm text-slate-400">
        Total records: {pagination.total}
      </p>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by student name..."
        aria-label="Search students by name"
        className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-cyan-400"
      />

      {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}

      {role === "admin" && (
        <form onSubmit={handleSubmit} className="mt-5 grid gap-3 rounded-lg border border-white/10 p-4 sm:grid-cols-2">
          <h3 className="font-semibold sm:col-span-2">
            {editingId ? "Update student" : "Add student"}
          </h3>
          <input
            aria-label="Student name"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            minLength={2}
            maxLength={100}
            required
            className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
          />
          <input
            aria-label="Student email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
            className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
          />
          <input
            aria-label="Student phone"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
          />
          <input
            aria-label="Student course"
            placeholder="Course (optional)"
            value={form.course}
            onChange={(event) => setForm({ ...form, course: event.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
          />
          <select
            aria-label="Student status"
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Save changes" : "Add student"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setForm(emptyForm); }}
                className="rounded-lg border border-white/20 px-4 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="mt-5 space-y-3">
        {loading ? (
          <p className="py-6 text-center text-slate-400">Loading students...</p>
        ) : students.length > 0 ? (
          students.map((student) => (
            <div
              key={student._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 p-4"
            >
              <div>
                <h3 className="font-semibold">
                  {student.name}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {student.email}{student.course ? ` · ${student.course}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-sm ${
                  student.status === "Active" ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-700 text-slate-300"
                }`}>
                  {student.status}
                </span>
                {role === "admin" && (
                  <>
                    <button type="button" onClick={() => beginEdit(student)} className="rounded border border-white/15 px-3 py-1 text-sm hover:bg-white/10">
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteStudent(student)} className="rounded border border-red-400/30 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-slate-400">
            {error ? "Student records could not be loaded." : "No students found."}
          </p>
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
          <button
            type="button"
            disabled={pagination.page <= 1 || loading}
            onClick={() => loadStudents(pagination.page - 1)}
            className="rounded border border-white/15 px-3 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {pagination.page} of {pagination.pages}</span>
          <button
            type="button"
            disabled={pagination.page >= pagination.pages || loading}
            onClick={() => loadStudents(pagination.page + 1)}
            className="rounded border border-white/15 px-3 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default StudentList;
