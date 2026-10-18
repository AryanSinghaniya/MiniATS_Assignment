const Candidate = require('../models/Candidate');
const asyncHandler = require('../middleware/asyncHandler');

// ─── GET /api/dashboard ───────────────────────────────────────────────────
const getDashboard = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Run all aggregations in parallel for performance
  const [stageStats, recentCount, totalCount] = await Promise.all([
    // Count candidates grouped by stage
    Candidate.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 } } },
    ]),
    // Candidates added in last 7 days
    Candidate.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    // Total candidate count
    Candidate.countDocuments(),
  ]);

  // Build a map of stage -> count (fill in 0 for missing stages)
  const stageMap = {};
  Candidate.STAGES.forEach((s) => (stageMap[s] = 0));
  stageStats.forEach(({ _id, count }) => {
    stageMap[_id] = count;
  });

  const hired = stageMap['Hired'];
  const rejected = stageMap['Rejected'];
  // Active = everyone except Hired and Rejected
  const active = totalCount - hired - rejected;
  const hiredRate =
    totalCount > 0 ? ((hired / totalCount) * 100).toFixed(1) : '0.0';

  res.json({
    success: true,
    data: {
      total: totalCount,
      active,
      hired,
      rejected,
      hiredRate: parseFloat(hiredRate),
      recentCandidates: recentCount,
      byStage: Candidate.STAGES.map((stage) => ({
        stage,
        count: stageMap[stage],
      })),
    },
  });
});

module.exports = { getDashboard };
