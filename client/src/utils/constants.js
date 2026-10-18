// All hiring stages in pipeline order
export const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

// Color configuration for each stage (used by Kanban, badges, charts)
export const STAGE_COLORS = {
  Applied: { bg: '#e0f2fe', text: '#0369a1', border: '#38bdf8', dot: '#0ea5e9' },
  Screening: { bg: '#fef9c3', text: '#854d0e', border: '#fbbf24', dot: '#f59e0b' },
  Interview: { bg: '#ede9fe', text: '#6d28d9', border: '#a78bfa', dot: '#8b5cf6' },
  Offer: { bg: '#dcfce7', text: '#166534', border: '#4ade80', dot: '#22c55e' },
  Hired: { bg: '#d1fae5', text: '#065f46', border: '#34d399', dot: '#10b981' },
  Rejected: { bg: '#fee2e2', text: '#991b1b', border: '#f87171', dot: '#ef4444' },
};

// Chart fill colors (used by Recharts)
export const CHART_COLORS = ['#6366f1', '#f59e0b', '#8b5cf6', '#22c55e', '#10b981', '#ef4444'];

export const DEFAULT_PAGE_LIMIT = 10;
