
import "./StatCard.css";

function StatCard({ title, value, description }) {
  return (
    <article
      aria-label={`${title}: ${value}. ${description}`}
      tabIndex={0}
      className="stat-card"
    >
      <div className="stat-card__face stat-card__face--details">
        <div className="stat-card__content">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div aria-hidden="true" className="stat-card__face stat-card__face--value">
        <h2>{value}</h2>
      </div>
    </article>
  );
}

export default StatCard;
