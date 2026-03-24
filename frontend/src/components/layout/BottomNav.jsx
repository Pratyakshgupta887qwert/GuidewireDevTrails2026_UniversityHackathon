import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Home",
    to: "/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "My Policies",
    to: "/policies",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Discover",
    to: "/discover",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.5 5.5-2.7 6.4-6.4 2.7 2.7-6.4Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "My Claims",
    to: "/claims",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path d="M7 3h10l4 4v14H3V3zm8 1.5V8h3.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Risk Watch",
    to: "/wellness",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path d="M12 3 4 6v6c0 5.2 3.4 8.3 8 10 4.6-1.7 8-4.8 8-10V6z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  return (
    <>
      <nav className="hidden border-b border-slate-200 bg-white px-4 md:block lg:px-6" aria-label="Desktop navigation">
        <ul className="flex h-14 items-center gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <li key={`desktop-${item.to}`}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                    isActive
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-800",
                  ].join(" ")
                }
                end={item.to === "/"}
              >
                <span className="inline-flex h-4 w-4 items-center justify-center">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav
        className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 px-1 backdrop-blur md:hidden"
        aria-label="Mobile navigation"
      >
        <ul className="grid h-[78px] grid-cols-5 gap-1">
        {navItems.map((item) => (
          <li key={item.to} className="flex">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                [
                  "group flex w-full flex-col items-center justify-center gap-1 rounded-lg px-1 text-center text-[11px] font-medium transition",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                ].join(" ")
              }
              end={item.to === "/"}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full transition group-hover:scale-105">
                {item.icon}
              </span>
              <span className="leading-tight">{item.label}</span>
            </NavLink>
          </li>
        ))}
        </ul>
      </nav>
    </>
  );
}
