import { Link, useParams } from "react-router-dom";
import ActionButton from "../components/common/ActionButton";
import SectionCard from "../components/common/SectionCard";
import { coverageExcluded, coverageIncluded, policies } from "../data/mockData";

export default function PolicyDetailsPage() {
  const { policyId } = useParams();
  const policy = policies.find((item) => item.id === policyId) ?? policies[0];

  return (
    <div className="page-stack">
      <SectionCard
        title="Policy Info"
        subtitle="Detailed breakdown of active coverage, limits, and exclusions"
        rightSlot={<Link className="text-link" to="/policies">Back to policies</Link>}
      >
        <article className="policy-details-hero">
          <div>
            <h3>{policy.name}</h3>
            <p>Policy ID: {policy.id.toUpperCase()}</p>
            <p>Holder: {policy.holder}</p>
          </div>
          <span className="status-tag status-tag--active">{policy.status}</span>
        </article>

        <div className="policy-kpis">
          <div>
            <span>Days Left</span>
            <strong>{policy.daysLeft}</strong>
          </div>
          <div>
            <span>Premium / Week</span>
            <strong>Rs {policy.premium}</strong>
          </div>
          <div>
            <span>Coverage Limit</span>
            <strong>Rs {policy.sumInsured}</strong>
          </div>
        </div>

        <div className="details-columns">
          <section>
            <h4>What is Covered</h4>
            <ul>
              {coverageIncluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h4>What is Not Covered</h4>
            <ul>
              {coverageExcluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="actions-row">
          <ActionButton variant="ghost">Download Policy PDF</ActionButton>
          <ActionButton>Renew Now</ActionButton>
        </div>
      </SectionCard>
    </div>
  );
}
