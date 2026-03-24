export default function ArticleCard({ article }) {
  return (
    <article className="article-card">
      <img src={article.image} alt={article.title} />
      <div className="article-card__body">
        <h3>{article.title}</h3>
        <p>{article.text}</p>
      </div>
    </article>
  );
}
