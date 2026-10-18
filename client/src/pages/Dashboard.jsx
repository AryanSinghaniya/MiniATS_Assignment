import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getDashboard } from '../api/candidates';
import StatCard from '../components/StatCard';
import { StatCardSkeleton } from '../components/Skeleton';
import { CHART_COLORS } from '../utils/constants';

/**
 * Dashboard page - shows high-level hiring metrics and a bar chart
 */
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard();
        setData(res.data.data);
      } catch {
        setError('Failed to load dashboard data. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (error) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state__icon">⚠️</div>
          <h3>Connection Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your hiring pipeline at a glance</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Candidates"
              value={data.total}
              icon="👥"
              color="blue"
              subtitle="All time"
            />
            <StatCard
              title="Active"
              value={data.active}
              icon="🔄"
              color="purple"
              subtitle="In pipeline"
            />
            <StatCard
              title="Hired"
              value={data.hired}
              icon="✅"
              color="green"
              subtitle="Successfully placed"
            />
            <StatCard
              title="Rejected"
              value={data.rejected}
              icon="❌"
              color="red"
              subtitle="Not moving forward"
            />
            <StatCard
              title="Hired Rate"
              value={`${data.hiredRate}%`}
              icon="📈"
              color="green"
              subtitle={`${data.recentCandidates} added last 7 days`}
            />
          </>
        )}
      </div>

      {/* Bar Chart */}
      <div className="card chart-card">
        <h2 className="card-title">Candidates by Stage</h2>
        {loading ? (
          <div className="skeleton" style={{ height: '300px', borderRadius: '12px' }} />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={data.byStage}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="stage"
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                }}
                cursor={{ fill: 'rgba(99,102,241,0.08)' }}
              />
              <Bar dataKey="count" name="Candidates" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                {data.byStage.map((entry, index) => (
                  <Cell key={entry.stage} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
