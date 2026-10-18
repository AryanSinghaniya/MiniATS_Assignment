import { STAGE_COLORS } from '../utils/constants';

/**
 * StageBadge - colored pill badge showing a candidate's stage
 */
const StageBadge = ({ stage }) => {
  const colors = STAGE_COLORS[stage] || {};
  return (
    <span
      className="stage-badge"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      <span
        className="stage-badge__dot"
        style={{ backgroundColor: colors.dot }}
      />
      {stage}
    </span>
  );
};

export default StageBadge;
