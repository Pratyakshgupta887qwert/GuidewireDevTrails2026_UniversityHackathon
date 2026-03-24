import ActionButton from "../common/ActionButton";

export default function HeroCarousel() {
  return (
    <section className="hero-card">
      <div>
        <p className="hero-card__eyebrow">AegisAI Income Protection</p>
        <h1>Smart Weekly Protection for Delivery Workers</h1>
        <p>
          Get automatic compensation when weather, AQI, or mobility disruptions reduce your earning hours.
        </p>
        <ActionButton>Activate Coverage</ActionButton>
      </div>
      <img
        src="/ui/WhatsApp Image 2026-03-24 at 2.10.55 PM.jpeg"
        alt="Insurance dashboard preview"
      />
    </section>
  );
}
