
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/animations/Loader";
import api from "../services/api";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Please enter your username or email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { identifier, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="mb-2 text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mb-6 text-slate-400">
          Login to your Student Management Platform
        </p>

        <form onSubmit={handleSubmit} aria-busy={loading} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="mb-2 block text-sm">
              Username or email
            </label>

            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="StudentAdmin or you@example.com"
              autoComplete="username"
              maxLength={254}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 outline-none focus:border-cyan-400"
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 p-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-80"
          >
            <span aria-live="polite">{loading ? "Logging in..." : "Login"}</span>
          </button>

          {loading && (
            <div role="status" aria-label="Logging in">
              <Loader />
            </div>
          )}
        </form>

        <p className="mt-5 text-sm text-slate-400">
          Need an account? Ask your administrator to create one.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block text-cyan-400 hover:underline"
        >
          ← Back to Welcome
        </Link>
      </div>
    </main>
  );
}

export default Login;
