
import { Link } from "react-router-dom";

function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="mb-2 text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mb-6 text-slate-400">
          Login to your Student Management Platform
        </p>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 outline-none focus:border-cyan-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 outline-none focus:border-cyan-400"
            required
          />

          <button
            type="button"
            className="w-full rounded-lg bg-cyan-400 p-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Login
          </button>
        </form>

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
