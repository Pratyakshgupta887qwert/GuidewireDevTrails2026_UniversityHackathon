import { worker } from "../../data/mockData";

export default function TopHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-[88px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3.5">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-sm font-bold text-white shadow-sm">
          RR
        </div>
        <div>
          <p className="m-0 text-base font-bold text-slate-900 md:text-lg">Hi! {worker.name}</p>
          <p className="m-0 mt-0.5 text-sm text-slate-500">{worker.greeting}</p>
        </div>
      </div>
      <button
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50"
        aria-label="Support"
      >
        ?
      </button>
    </header>
  );
}
