/**
 * Skeleton - animated placeholder shown while content loads
 * Accepts width/height via style props or className
 */
const Skeleton = ({ width, height = '1rem', borderRadius = '6px', style = {} }) => (
  <div
    className="skeleton"
    style={{ width, height, borderRadius, ...style }}
    aria-hidden="true"
  />
);

/** Pre-built skeleton for a table row */
export const TableRowSkeleton = ({ cols = 6 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i}>
        <Skeleton width={i === 0 ? '120px' : '80px'} />
      </td>
    ))}
  </tr>
);

/** Pre-built skeleton for a stat card */
export const StatCardSkeleton = () => (
  <div className="stat-card stat-card--blue" style={{ opacity: 0.6 }}>
    <Skeleton width="3rem" height="3rem" borderRadius="12px" />
    <div className="stat-card__body">
      <Skeleton width="80px" height="0.75rem" style={{ marginBottom: '0.5rem' }} />
      <Skeleton width="60px" height="1.75rem" />
    </div>
  </div>
);

export default Skeleton;
