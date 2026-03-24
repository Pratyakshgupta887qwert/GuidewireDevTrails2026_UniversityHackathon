import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page-stack">
      <section className="section-card">
        <h2 className="section-card__title">Page not found</h2>
        <p className="section-card__subtitle">The page you requested is not available.</p>
        <Link className="text-link" to="/">
          Go back to dashboard
        </Link>
      </section>
    </div>
  );
}
