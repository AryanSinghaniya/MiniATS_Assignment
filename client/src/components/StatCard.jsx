/**
 * StatCard - displays a single metric on the dashboard
 *
 * @param {string} title - Label for the metric
 * @param {string|number} value - The numeric value to display
 * @param {string} icon - Emoji icon
 * @param {string} color - CSS color class suffix (blue/green/red/purple)
 * @param {string} subtitle - Small text shown below the value
 */
const StatCard = ({ title, value, icon, color = 'blue', subtitle }) => {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__body">
        <p className="stat-card__title">{title}</p>
        <p className="stat-card__value">{value}</p>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
