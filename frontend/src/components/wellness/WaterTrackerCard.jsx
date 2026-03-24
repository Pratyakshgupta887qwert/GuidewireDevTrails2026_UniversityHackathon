import { useMemo, useState } from "react";
import ActionButton from "../common/ActionButton";

export default function WaterTrackerCard({ hydrationGoalMl, hydrationDoneMl }) {
  const [done, setDone] = useState(hydrationDoneMl);
  const progress = useMemo(() => Math.min(100, Math.round((done / hydrationGoalMl) * 100)), [done, hydrationGoalMl]);

  return (
    <section className="water-card">
      <div className="water-card__header">
        <h3>Water Tracking</h3>
        <p>Goal: {hydrationGoalMl} mL</p>
      </div>
      <div className="water-card__bar">
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="water-card__count">{done} mL completed ({progress}%)</p>
      <div className="water-card__controls">
        <button onClick={() => setDone((v) => Math.max(0, v - 100))}>-100</button>
        <button onClick={() => setDone((v) => Math.min(hydrationGoalMl, v + 100))}>+100</button>
      </div>
      <ActionButton variant="secondary">Manage Tracking</ActionButton>
    </section>
  );
}
