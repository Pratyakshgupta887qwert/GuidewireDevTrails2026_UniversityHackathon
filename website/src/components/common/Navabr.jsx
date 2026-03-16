import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ isDashboard = false }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-3 py-3 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/40 bg-white/70 shadow-xl shadow-blue-900/10 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="ml-4 flex items-center gap-2">
            <div className="rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 p-2.5 text-lg shadow-lg shadow-indigo-300/60 dark:shadow-indigo-900/40">
              🛡️
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">GigGuard</span>
              <p className="text-xs text-slate-500 dark:text-slate-300">Smart Parametric Insurance</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {!isDashboard && !isAuthenticated && (
              <>
                {navLinks.map((item) => (
                  <a key={item.label} href={item.href} className="text-sm font-semibold text-slate-600 transition hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-100">
                    {item.label}
                  </a>
                ))}
                <Link to="/login" className="rounded-xl border border-primary-200 bg-white/60 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 dark:border-slate-600 dark:bg-slate-800 dark:text-primary-100">
                  Login
                </Link>
                <Link to="/register" className="rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90">
                  Register
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                  {user?.role === 'admin' ? '🧠 Admin' : '🚴 Worker'}
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
                >
                  Logout
                </button>
              </>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
              aria-label="Toggle dark mode"
            >
              {isDark ? '🌙' : '☀️'}
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mr-4 rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden dark:border-slate-600 dark:text-slate-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-2 border-t border-slate-200 px-4 pb-4 pt-3 md:hidden dark:border-slate-700">
            {!isDashboard && !isAuthenticated && navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}

            {!isDashboard && !isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50 dark:text-primary-100 dark:hover:bg-slate-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-3 py-2 text-sm font-semibold text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <div className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-100">{user?.name}</div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-lg bg-red-600 px-3 py-2 text-left text-sm font-semibold text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-100"
            >
              {isDark ? '🌙 Switch to light mode' : '☀️ Switch to dark mode'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;