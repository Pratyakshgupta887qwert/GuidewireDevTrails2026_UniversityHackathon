import SectionCard from "../components/common/SectionCard";
import ActionButton from "../components/common/ActionButton";
import { claimHistory } from "../data/mockData";

export default function ClaimsPage() {
  return (
    <div className="page-stack">
      <SectionCard
        title="My Claims"
        subtitle="Auto-generated claims from verified disruption events"
        rightSlot={<ActionButton variant="secondary">+ Register</ActionButton>}
      >
        {claimHistory.length === 0 ? (
          <div className="empty-state">
            <img src="/ui/WhatsApp Image 2026-03-24 at 2.14.08 PM11.jpeg" alt="No claims" />
            <p>You have no claims yet. Keep riding safely and stay protected.</p>
          </div>
        ) : (
          <div className="claims-list">
            {claimHistory.map((claim) => (
              <article key={claim.id} className="claim-item">
                <div>
                  <h3>{claim.eventType}</h3>
                  <p>
                    {claim.zone} · {claim.date}
                  </p>
                </div>
                <div className="claim-item__meta">
                  <strong>Rs {claim.payout}</strong>
                  <span className={`status-tag status-tag--${claim.status.toLowerCase()}`}>{claim.status}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
