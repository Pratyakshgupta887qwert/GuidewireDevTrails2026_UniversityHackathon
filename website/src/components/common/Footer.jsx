import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/30 bg-slate-950 py-12 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 p-2">
                <span className="text-xl">🛡️</span>
              </div>
              <span className="text-xl font-bold text-white">GigGuard</span>
            </div>
            <p className="text-sm leading-6 text-slate-400">
              Smart parametric income insurance platform for India&apos;s gig workers with instant, data-driven payouts.
            </p>
            <p className="mt-4 text-xs text-slate-500">Built for delivery partners, fleet workers, and urban micro-entrepreneurs.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Workers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#how-it-works" className="hover:text-white transition">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#coverage" className="hover:text-white transition">
                  Coverage Plans
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Trust & Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>IRDAI Compliant Framework</li>
              <li>Email: support@gigguard.in</li>
              <li>Helpline: +91 1800-GIGGUARD</li>
              <li>HQ: New Delhi, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2026 GigGuard. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#privacy" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-white transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;