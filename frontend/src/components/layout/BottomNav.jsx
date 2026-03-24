import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "My Policies", to: "/policies" },
  { label: "Discover", to: "/discover" },
  { label: "My Claims", to: "/claims" },
  { label: "My Wellness", to: "/wellness" },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            isActive ? "bottom-nav__item bottom-nav__item--active" : "bottom-nav__item"
          }
          end={item.to === "/"}
        >
          <span className="bottom-nav__dot" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
