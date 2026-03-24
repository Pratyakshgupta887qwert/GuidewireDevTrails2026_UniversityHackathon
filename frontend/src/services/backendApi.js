const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/$/, "");

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    throw new Error(`API ${response.status}: ${path}`);
  }
  return response.json();
}

export function getPoliciesApi() {
  return fetchJson("/policies");
}

export function getPolicyApi(policyId) {
  return fetchJson(`/policies/${policyId}`);
}

export function renewPolicyApi(policyId) {
  return fetchJson(`/policies/${policyId}/renew`, { method: "POST" });
}

export function getClaimsApi() {
  return fetchJson("/claims");
}

export function getPayoutRulesApi() {
  return fetchJson("/claims/payout-rules");
}

export function getWorkerApi() {
  return fetchJson("/workers/me");
}

export function getRiskLiveApi({ latitude = 28.6139, longitude = 77.2090 } = {}) {
  return fetchJson(`/risk/live?latitude=${latitude}&longitude=${longitude}`);
}

export { API_BASE };
