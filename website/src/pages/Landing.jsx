import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import GlassCard from '../components/common/GlassCard';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      <main className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-blue-200 bg-white/60 px-3 py-1 text-xs font-semibold tracking-widest text-blue-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-blue-100">
              GIGGUARD FOR INDIA
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
              Smart Parametric Income Insurance for Gig Workers
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-300 sm:text-lg">
              Automatically protect daily earnings against weather, air-quality, and traffic disruptions with instant compensation workflows.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-center font-semibold text-white shadow-lg transition hover:opacity-90">
                Get Started
              </Link>
              <Link to="/login" className="rounded-xl border border-blue-200 bg-white/70 px-6 py-3 text-center font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-blue-100">
                Login
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Trusted by workers across Delhi NCR. No paperwork. Fast payouts.</p>
          </div>

          <GlassCard>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Live Protection Metrics</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                <p className="text-xs text-blue-100">Workers Protected</p>
                <p className="mt-1 text-2xl font-bold">1,864</p>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
                <p className="text-xs text-green-100">Payout Accuracy</p>
                <p className="mt-1 text-2xl font-bold">97.4%</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs text-slate-500">Avg Weekly Cover</p>
                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">₹8,900</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs text-slate-500">Claim Turnaround</p>
                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">15-60 mins</p>
              </div>
            </div>
          </GlassCard>
        </section>

        <section className="mx-auto mt-12 max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-slate-100">The Problem We Solve</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600 dark:text-slate-300">
            Delivery workers lose earnings every time external disruptions hit. GigGuard restores confidence with compensation backed by real-time event triggers.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { icon: '🌧️', title: 'Weather Disruption', desc: 'Unexpected rain blocks delivery windows and cuts shift earnings.' },
              { icon: '💨', title: 'Air Quality Alerts', desc: 'High AQI limits ride duration and order volume.' },
              { icon: '🚦', title: 'Traffic Congestion', desc: 'Gridlocks reduce completed deliveries per hour.' },
            ].map((item) => (
              <GlassCard key={item.title} className="h-full transition hover:-translate-y-1">
                <p className="text-4xl">{item.icon}</p>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-7xl" id="features">
          <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-slate-100">Platform Features</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              '⚡ Automatic trigger-based payouts',
              '📊 Worker and admin analytics dashboards',
              '🧠 Fraud pattern detection and trust scoring',
              '🗺️ Zone-wise risk heatmaps and disruption feed',
              '🔔 Alerts, claim statuses, and notifications',
              '🔒 Secure OTP auth and role-based access',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/40 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-md backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-7xl" id="pricing">
          <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-slate-100">Simple Pricing</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { name: 'Starter', premium: 15, cover: 5000 },
              { name: 'Standard', premium: 25, cover: 10000, best: true },
              { name: 'Pro', premium: 35, cover: 16000 },
            ].map((plan) => (
              <GlassCard key={plan.name} className={plan.best ? 'border-blue-300 ring-2 ring-blue-200' : ''}>
                {plan.best ? <p className="text-xs font-bold tracking-widest text-blue-600">MOST POPULAR</p> : null}
                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Weekly premium</p>
                <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-slate-100">₹{plan.premium}</p>
                <p className="mt-2 text-sm font-semibold text-green-700 dark:text-green-300">Coverage up to ₹{plan.cover.toLocaleString()}</p>
              </GlassCard>
            ))}
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/40 bg-white/80 p-4 shadow-md backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                  <th className="py-3">Feature</th>
                  <th className="py-3">Starter</th>
                  <th className="py-3">Standard</th>
                  <th className="py-3">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr>
                  <td className="py-3 font-semibold">Triggers</td>
                  <td>Rainfall</td>
                  <td>Rainfall + AQI</td>
                  <td>Rainfall + AQI + Traffic</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">Payout Speed</td>
                  <td>24 hours</td>
                  <td>1 hour</td>
                  <td>15 minutes</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">Support</td>
                  <td>Email</td>
                  <td>Priority</td>
                  <td>Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-4xl" id="faq">
          <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-4">
            {[
              {
                q: 'How is payout triggered?',
                a: 'Payout is automatically triggered when verified external disruption thresholds are crossed in your delivery zone.',
              },
              {
                q: 'Can worker raise claim manually?',
                a: 'Yes. Workers can submit compensation claim requests from profile when disruption was missed by auto-processing.',
              },
              {
                q: 'Can admin update policy catalog?',
                a: 'Yes. Admin can add, edit, and delete policies from the policy management section.',
              },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-white/40 bg-white/80 p-4 shadow-md backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {faq.q}
                  <span className="float-right transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-5xl rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-green-600 p-8 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-extrabold">Protect Every Shift. Every Day.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-blue-100">Start with a plan, activate your coverage, and keep your income resilient against city-level external disruptions.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register" className="rounded-xl bg-white px-6 py-2.5 font-semibold text-blue-700">
              Create Worker Account
            </Link>
            <Link to="/login" className="rounded-xl border border-white/70 px-6 py-2.5 font-semibold text-white">
              Login to Dashboard
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
