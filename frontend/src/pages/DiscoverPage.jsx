import { useMemo, useState } from "react";
import SectionCard from "../components/common/SectionCard";
import ActionButton from "../components/common/ActionButton";
import ArticleCard from "../components/discover/ArticleCard";
import ServicesGrid from "../components/home/ServicesGrid";
import { articles, discoverProducts } from "../data/mockData";
import { calculateDisruptionRisk, getCurrentPosition, getLiveRiskSignals } from "../services/publicApis";

export default function DiscoverPage() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [locationStatus, setLocationStatus] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return discoverProducts;
    return discoverProducts.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const detectCurrentLocation = () => {
    setLocationStatus("Detecting your current location...");
    getCurrentPosition()
      .then((coords) => getLiveRiskSignals(coords))
      .then((signals) => {
        const risk = calculateDisruptionRisk(signals);
        setLocationStatus(
          `Live zone risk ${risk}% | AQI ${signals.aqi} | Rain ${signals.precipitation} mm | Temp ${signals.temperature}°C`
        );
      })
      .catch((error) => {
        setLocationStatus(error.message || "Could not detect location right now.");
      });
  };

  return (
    <div className="page-stack">
      <SectionCard title="Explore Products" subtitle="Coverage bundles and add-ons aligned to your risk profile">
        {showSearch && (
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="search-input"
            placeholder="Search coverage options"
            aria-label="Search products"
          />
        )}
        <ServicesGrid items={filteredProducts} />
        <div className="mt-16">
          <ActionButton variant="secondary" to="/policies">
            View All Products
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard title="Instant Access to Disruption Insights">
        <div className="promo-block">
          <h3>Track live weather, AQI, and traffic impact before each shift.</h3>
          <p>Use geospatial disruption maps to choose safer and higher-earning zones.</p>
          {locationStatus && <p className="action-feedback">{locationStatus}</p>}
          <div className="promo-block__actions">
            <ActionButton variant="ghost" onClick={detectCurrentLocation}>
              Detect Current Location
            </ActionButton>
            <ActionButton onClick={() => setShowSearch((prev) => !prev)}>
              {showSearch ? "Hide Search" : "Advanced Search"}
            </ActionButton>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Trending Now" subtitle="Risk and earning intelligence updates">
        <div className="article-grid">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
