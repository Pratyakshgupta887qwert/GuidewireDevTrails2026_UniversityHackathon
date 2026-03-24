import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/common/ActionButton";
import SectionCard from "../components/common/SectionCard";
import { coverageExcluded, coverageIncluded, policies } from "../data/mockData";
import { getPolicyApi, renewPolicyApi } from "../services/backendApi";

export default function PolicyDetailsPage() {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(policies.find((item) => item.id === policyId) ?? policies[0]);

  useEffect(() => {
    if (!policyId) return;
    let active = true;

    getPolicyApi(policyId)
      .then((item) => {
        if (!active) return;
        setPolicy({
          id: item.id,
          status: item.status,
          name: item.name,
          holder: item.holder,
          endDate: item.end_date,
          daysLeft: item.days_left,
          premium: item.premium,
          sumInsured: item.sum_insured,
        });
      })
      .catch(() => {
        if (!active) return;
        setPolicy(policies.find((item) => item.id === policyId) ?? policies[0]);
      });

    return () => {
      active = false;
    };
  }, [policyId]);

  const downloadSummary = () => {
    const lines = [
      "AegisAI Policy Summary",
      `Policy: ${policy.name}`,
      `Policy ID: ${policy.id.toUpperCase()}`,
      `Status: ${policy.status}`,
      `Premium per week: Rs ${policy.premium}`,
      `Coverage limit: Rs ${policy.sumInsured}`,
      `Days left: ${policy.daysLeft}`,
      "",
      "Included:",
      ...coverageIncluded.map((item) => `- ${item}`),
      "",
      "Excluded:",
      ...coverageExcluded.map((item) => `- ${item}`),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${policy.id}-summary.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

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
          <ActionButton variant="ghost" onClick={downloadSummary}>
            Download Policy Summary
          </ActionButton>
          <ActionButton
            onClick={() => {
              renewPolicyApi(policy.id)
                .then((item) => {
                  setPolicy((prev) => ({
                    ...prev,
                    status: item.status,
                    daysLeft: item.days_left,
                  }));
                })
                .finally(() => navigate("/policies"));
            }}
          >
            Renew Now
          </ActionButton>
        </div>
      </SectionCard>
    </div>
  );
}
