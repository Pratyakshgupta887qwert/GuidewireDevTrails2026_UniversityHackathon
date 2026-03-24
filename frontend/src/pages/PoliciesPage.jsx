import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionCard from "../components/common/SectionCard";
import PolicyCard from "../components/policies/PolicyCard";
import { policies } from "../data/mockData";

const FILTERS = ["All", "Active", "Pending", "Expired"];

export default function PoliciesPage() {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (filter === "All") return policies;
    return policies.filter((p) => p.status === filter);
  }, [filter]);

  return (
    <div className="page-stack">
      <SectionCard title="My Policies" subtitle="Manage active, pending, and historical weekly covers">
        <div className="filter-row">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              className={item === filter ? "chip chip--active" : "chip"}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="policy-list">
          {filtered.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} onViewDetails={(id) => navigate(`/policies/${id}`)} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
