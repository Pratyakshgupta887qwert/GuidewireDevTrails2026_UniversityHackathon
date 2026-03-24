import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionCard from "../components/common/SectionCard";
import PolicyCard from "../components/policies/PolicyCard";
import { policies } from "../data/mockData";
import { getPoliciesApi } from "../services/backendApi";

const FILTERS = ["All", "Active", "Pending", "Expired"];

export default function PoliciesPage() {
  const [filter, setFilter] = useState("All");
  const [items, setItems] = useState(policies);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    getPoliciesApi()
      .then((apiPolicies) => {
        if (!active) return;
        const normalized = apiPolicies.map((item) => ({
          id: item.id,
          status: item.status,
          name: item.name,
          holder: item.holder,
          endDate: item.end_date,
          daysLeft: item.days_left,
          premium: item.premium,
          sumInsured: item.sum_insured,
        }));
        setItems(normalized);
      })
      .catch(() => {
        if (!active) return;
        setItems(policies);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return items;
    return items.filter((p) => p.status === filter);
  }, [filter, items]);

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
