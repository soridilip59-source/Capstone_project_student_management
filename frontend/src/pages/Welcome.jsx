import DroppingText from "../components/animations/DroppingText";
import Loader from "../components/animations/Loader";
import { useNavigate } from "react-router-dom";
function Welcome() {
  const navigate = useNavigate();
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"></div>

      <section className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-14">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Phase 8 Capstone
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Student
          <span className="mt-2 block text-cyan-400">Management Platform</span>
        </h1>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xl text-slate-300 sm:text-2xl">
          <span>One platform to</span>
          <DroppingText />
        </div>

        <p className="mx-auto mt-6 max-w-xl leading-7 text-slate-400">
          Manage student records, organize information, and simplify everyday
          academic administration.
        </p>

        <button
          onClick={()=> navigate("/login")}
          type="button"
          className="mt-9 rounded-xl bg-cyan-400 px-8 py-3.5 font-semibold text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-cyan-300"
        >
          Get Started
        </button>

        <div className="mt-8">
          <Loader />
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Built with React and Tailwind CSS
        </p>
      </section>
    </main>
  );
}

export default Welcome;
