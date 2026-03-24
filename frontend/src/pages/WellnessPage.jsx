import { useEffect, useState } from "react";
import SectionCard from "../components/common/SectionCard";
import ActionButton from "../components/common/ActionButton";
import { riskMonitor, riskZones, validationChecks } from "../data/mockData";
import {
  calculateDisruptionRisk,
  DEFAULT_COORDS,
  getCurrentPosition,
  getLiveRiskSignals,
} from "../services/publicApis";

export default function WellnessPage() {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [apiStatus, setApiStatus] = useState("Loading live disruption signals...");
  const [liveSignals, setLiveSignals] = useState(null);

  const loadSignals = (useDeviceLocation = false, withLoadingState = true) => {
    if (withLoadingState) {
      setApiStatus("Loading live disruption signals...");
    }

    const source = useDeviceLocation ? getCurrentPosition() : Promise.resolve(DEFAULT_COORDS);

    source
      .then((coords) => getLiveRiskSignals(coords))
      .then((signals) => {
        const risk = calculateDisruptionRisk(signals);
        setLiveSignals({ ...signals, risk });
        setApiStatus("Live signals loaded from Open-Meteo APIs.");
      })
      .catch(() => {
        setLiveSignals(null);
        setApiStatus("Live API unavailable. Showing fallback values.");
      });
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadSignals(false, false);
    }, 0);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  const displayedRisk = liveSignals?.risk ?? riskMonitor.disruptionProbability;

  return (
    <div className="page-stack">
      <SectionCard title="Risk Watch" subtitle="Live disruption intelligence for your delivery zone">
        <div className="wellness-banner">
          <img src="/ui/WhatsApp Image 2026-03-24 at 2.14.08 PM11.jpeg" alt="Disruption monitoring" />
          <div>
            <h3>Zone Risk is {displayedRisk}% Today</h3>
            <p>
              Signals tracked now: {riskMonitor.activeSignals.join(", ")}. If thresholds cross, compensation
              flows automatically without manual filing.
            </p>
            <p className="action-feedback">{apiStatus}</p>
            {liveSignals && (
              <p className="action-feedback">
                AQI {liveSignals.aqi} | Rain {liveSignals.precipitation} mm | Temp {liveSignals.temperature}°C
              </p>
            )}
            <div className="promo-block__actions">
              <ActionButton variant="ghost" onClick={() => loadSignals(false)}>
                Refresh Signals
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => loadSignals(true)}>
                Use My Location
              </ActionButton>
            </div>
            <ActionButton onClick={() => setShowHeatmap((prev) => !prev)}>
              {showHeatmap ? "Hide Risk Heatmap" : "Open Risk Heatmap"}
            </ActionButton>
          </div>
        </div>
        {showHeatmap && (
          <div className="info-panel mt-16">
            <h3>Live zone risk snapshot</h3>
            <ul>
              {riskZones.map((zoneItem) => (
                <li key={zoneItem.zone}>
                  {zoneItem.zone}: {zoneItem.risk} risk ({zoneItem.trigger})
                </li>
              ))}
            </ul>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Fraud & Trust Shield">
        <div className="connect-card">
          <h3>Worker trust score: {riskMonitor.trustScore}/100</h3>
          <p>
            GPS integrity, delivery activity, and duplicate claim checks are running in the background to prevent
            spoofing and ensure fair payouts for genuine workers.
          </p>
          <ActionButton variant="ghost" onClick={() => setShowValidation((prev) => !prev)}>
            {showValidation ? "Hide Validation Details" : "View Validation Details"}
          </ActionButton>
        </div>
        {showValidation && (
          <div className="info-panel mt-16">
            <h3>Validation pipeline</h3>
            <ul>
              {validationChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </div>
        )}
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
