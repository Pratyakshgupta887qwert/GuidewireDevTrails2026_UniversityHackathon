import SectionCard from "../components/common/SectionCard";
import ActionButton from "../components/common/ActionButton";
import { riskMonitor } from "../data/mockData";

export default function WellnessPage() {
  return (
    <div className="page-stack">
      <SectionCard title="Risk Watch" subtitle="Live disruption intelligence for your delivery zone">
        <div className="wellness-banner">
          <img src="/ui/WhatsApp Image 2026-03-24 at 2.14.08 PM11.jpeg" alt="Disruption monitoring" />
          <div>
            <h3>Zone Risk is {riskMonitor.disruptionProbability}% Today</h3>
            <p>
              Signals tracked now: {riskMonitor.activeSignals.join(", ")}. If thresholds cross, compensation
              flows automatically without manual filing.
            </p>
            <ActionButton>Open Risk Heatmap</ActionButton>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Fraud & Trust Shield">
        <div className="connect-card">
          <h3>Worker trust score: {riskMonitor.trustScore}/100</h3>
          <p>
            GPS integrity, delivery activity, and duplicate claim checks are running in the background to prevent
            spoofing and ensure fair payouts for genuine workers.
          </p>
          <ActionButton variant="ghost">View Validation Details</ActionButton>
        </div>
      </SectionCard>

      <SectionCard title="Automated Claim Flow" subtitle="How payouts are triggered during disruption events">
        <div className="claims-list">
          <article className="claim-item">
            <div>
              <h3>1. Detect disruption threshold</h3>
              <p>Rain, AQI, and traffic signals are evaluated continuously per zone.</p>
            </div>
          </article>
          <article className="claim-item">
            <div>
              <h3>2. Verify worker eligibility</h3>
              <p>Active policy + location + fraud checks determine eligibility.</p>
            </div>
          </article>
          <article className="claim-item">
            <div>
              <h3>3. Calculate income loss and payout</h3>
              <p>Compensation is computed and pushed to your dashboard automatically.</p>
            </div>
          </article>
        </div>
      </SectionCard>
    </div>
  );
}
