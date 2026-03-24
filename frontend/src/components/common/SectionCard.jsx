export default function SectionCard({ title, subtitle, rightSlot, children }) {
  return (
    <section className="section-card">
      {(title || subtitle || rightSlot) && (
        <header className="section-card__header">
          <div>
            {title && <h2 className="section-card__title">{title}</h2>}
            {subtitle && <p className="section-card__subtitle">{subtitle}</p>}
          </div>
          {rightSlot}
        </header>
      )}
      {children}
    </section>
  );
}
