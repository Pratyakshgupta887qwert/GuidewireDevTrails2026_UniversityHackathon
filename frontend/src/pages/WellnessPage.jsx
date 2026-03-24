import SectionCard from "../components/common/SectionCard";
import ActionButton from "../components/common/ActionButton";
import WaterTrackerCard from "../components/wellness/WaterTrackerCard";
import { wellnessStats } from "../data/mockData";

export default function WellnessPage() {
  return (
    <div className="page-stack">
      <SectionCard title="My Wellness" subtitle="Improve trust score with consistent healthy activity">
        <div className="wellness-banner">
          <img src="/ui/WhatsApp Image 2026-03-24 at 2.14.19 PM12.jpeg" alt="Wellness promo" />
          <div>
            <h3>Preventive Health Checkup</h3>
            <p>Book your free preventive health checkup and improve your profile trust score.</p>
            <ActionButton>Book Checkup</ActionButton>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Connect Your Health Data">
        <div className="connect-card">
          <h3>Unify health information</h3>
          <p>Integrate Google Fit or Apple Health to get consistency insights and smoother renewals.</p>
          <ActionButton variant="ghost">Connect now</ActionButton>
        </div>
      </SectionCard>

      <WaterTrackerCard
        hydrationGoalMl={wellnessStats.hydrationGoalMl}
        hydrationDoneMl={wellnessStats.hydrationDoneMl}
      />
    </div>
  );
}
