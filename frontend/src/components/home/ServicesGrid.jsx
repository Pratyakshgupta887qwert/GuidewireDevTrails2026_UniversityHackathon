export default function ServicesGrid({ items }) {
  return (
    <div className="service-grid">
      {items.map((item) => (
        <article key={item} className="service-grid__item">
          <span className="service-grid__icon">●</span>
          <h3>{item}</h3>
        </article>
      ))}
    </div>
  );
}
