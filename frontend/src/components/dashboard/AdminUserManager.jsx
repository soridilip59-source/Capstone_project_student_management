import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = { name: "", username: "", email: "", password: "" };

function AdminUserManager() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data.users);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load user accounts.");
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadUsers();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadUsers]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const { data } = await api.post("/users", form);
      setUsers((currentUsers) => [data.user, ...currentUsers]);
      setForm(initialForm);
      setMessage(`Account created for ${data.user.username}. Share the temporary password securely.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create the user account.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">User Accounts</h2>
      <p className="mt-2 text-sm text-slate-400">
        Create staff accounts. They can sign in with their username or email.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-3 sm:grid-cols-2">
        <input
          aria-label="User full name"
          placeholder="Full name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          minLength={2}
          maxLength={80}
          required
          className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
        />
        <input
          aria-label="Username"
          placeholder="Username"
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
          pattern="[A-Za-z0-9._-]{3,30}"
          title="3-30 letters, numbers, dots, underscores, or hyphens"
          autoComplete="username"
          required
          className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
        />
        <input
          aria-label="User email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          autoComplete="email"
          required
          className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
        />
        <input
          aria-label="Temporary password"
          type="password"
          placeholder="Temporary password (minimum 8 characters)"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          required
          className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
        >
          {saving ? "Creating account..." : "Create staff account"}
        </button>
      </form>

      {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
      {message && <p role="status" className="mt-4 text-sm text-emerald-400">{message}</p>}

      <ul className="mt-5 divide-y divide-white/10">
        {users.map((user) => (
          <li key={user.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
            <span className="font-medium text-white">{user.name} <span className="text-slate-400">(@{user.username})</span></span>
            <span className="text-slate-400">{user.email} · {user.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AdminUserManager;
