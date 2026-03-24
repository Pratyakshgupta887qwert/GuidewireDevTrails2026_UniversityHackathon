import SectionCard from "../components/common/SectionCard";
import HeroCarousel from "../components/home/HeroCarousel";
import ServicesGrid from "../components/home/ServicesGrid";
import { services, worker } from "../data/mockData";

export default function HomePage() {
  return (
    <div className="page-stack">
      <HeroCarousel />

      <SectionCard
        title="Income Protection Meter"
        subtitle="Live estimate of disruption coverage for your operating zone"
      >
        <div className="meter">
          <div className="meter__head">
            <h3>{worker.planName}</h3>
            <span>Risk Zone: {worker.city}</span>
          </div>
          <div className="meter__track">
            <span style={{ width: "62%" }} />
          </div>
          <div className="meter__legend">
            <div>
              <strong>4%</strong>
              <span>Low Risk</span>
            </div>
            <div>
              <strong>10%</strong>
              <span>Moderate</span>
            </div>
            <div>
              <strong>14%</strong>
              <span>Elevated</span>
            </div>
            <div>
              <strong>20%</strong>
              <span>High Risk</span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Core Services" subtitle="Everything needed for real-time parametric protection">
        <ServicesGrid items={services} />
      </SectionCard>
    </div>
  );
}
