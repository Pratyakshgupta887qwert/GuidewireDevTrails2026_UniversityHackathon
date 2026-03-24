import { useEffect, useState } from "react";
import SectionCard from "../components/common/SectionCard";
import ActionButton from "../components/common/ActionButton";
import { claimHistory, payoutRules } from "../data/mockData";
import { getClaimsApi, getPayoutRulesApi } from "../services/backendApi";

export default function ClaimsPage() {
  const [showRules, setShowRules] = useState(false);
  const [claims, setClaims] = useState(claimHistory);
  const [rules, setRules] = useState(payoutRules);

  useEffect(() => {
    let active = true;

    getClaimsApi()
      .then((apiClaims) => {
        if (!active) return;
        const normalized = apiClaims.map((item) => ({
          id: item.id,
          eventType: item.event_type,
          zone: item.zone,
          payout: item.payout,
          status: item.status,
          date: item.date,
        }));
        setClaims(normalized);
      })
      .catch(() => {
        if (!active) return;
        setClaims(claimHistory);
      });

    getPayoutRulesApi()
      .then((data) => {
        if (!active) return;
        setRules(data.rules || payoutRules);
      })
      .catch(() => {
        if (!active) return;
        setRules(payoutRules);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-stack">
      <SectionCard
        title="My Claims"
        subtitle="Auto-generated claims from verified disruption events"
        rightSlot={
          <ActionButton variant="secondary" onClick={() => setShowRules((prev) => !prev)}>
            {showRules ? "Hide Payout Rules" : "View Payout Rules"}
          </ActionButton>
        }
      >
        {showRules && (
          <div className="info-panel">
            <h3>Payout rules</h3>
            <ul>
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {claims.length === 0 ? (
          <div className="empty-state">
            <img src="/ui/WhatsApp Image 2026-03-24 at 2.14.08 PM11.jpeg" alt="No claims" />
            <p>You have no claims yet. Keep riding safely and stay protected.</p>
          </div>
        ) : (
          <div className="claims-list">
            {claims.map((claim) => (
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
