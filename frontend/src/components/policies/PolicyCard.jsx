import ActionButton from "../common/ActionButton";

export default function PolicyCard({ policy, onViewDetails }) {
  return (
    <article className="policy-card">
      <div className="policy-card__head">
        <span className={`status-tag status-tag--${policy.status.toLowerCase()}`}>{policy.status}</span>
      </div>
      <h3>{policy.name}</h3>
      <p className="policy-card__id">{policy.id.toUpperCase()}</p>
      <div className="policy-card__metrics">
        <div>
          <span>Premium / week</span>
          <strong>Rs {policy.premium}</strong>
        </div>
        <div>
          <span>Coverage limit</span>
          <strong>Rs {policy.sumInsured}</strong>
        </div>
      </div>
      <div className="policy-card__footer">
        <span>{policy.holder}</span>
        <ActionButton variant="ghost" onClick={() => onViewDetails(policy.id)}>
          View Details
        </ActionButton>
      </div>
    </article>
  );
}
