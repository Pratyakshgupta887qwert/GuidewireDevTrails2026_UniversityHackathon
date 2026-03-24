import SectionCard from "../components/common/SectionCard";
import ActionButton from "../components/common/ActionButton";
import ArticleCard from "../components/discover/ArticleCard";
import ServicesGrid from "../components/home/ServicesGrid";
import { articles, discoverProducts } from "../data/mockData";

export default function DiscoverPage() {
  return (
    <div className="page-stack">
      <SectionCard title="Explore Products" subtitle="Coverage bundles and add-ons aligned to your risk profile">
        <ServicesGrid items={discoverProducts} />
        <div className="mt-16">
          <ActionButton variant="secondary">View All Products</ActionButton>
        </div>
      </SectionCard>

      <SectionCard title="Instant Access to Disruption Insights">
        <div className="promo-block">
          <h3>Track live weather, AQI, and traffic impact before each shift.</h3>
          <p>Use geospatial disruption maps to choose safer and higher-earning zones.</p>
          <div className="promo-block__actions">
            <ActionButton variant="ghost">Detect Current Location</ActionButton>
            <ActionButton>Advanced Search</ActionButton>
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
