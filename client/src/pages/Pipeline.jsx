import { useState, useEffect, useCallback } from 'react';
import { getCandidates } from '../api/candidates';
import KanbanBoard from '../components/KanbanBoard';

/**
 * Pipeline page - Kanban drag-and-drop view of all candidates
 */
const Pipeline = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all candidates (no pagination for kanban – load up to 200)
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCandidates({ limit: 200 });
      setCandidates(res.data.data);
    } catch {
      setError('Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Pipeline</h1>
        </div>
        <div className="kanban-loading">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="kanban-column-skeleton">
              <div className="skeleton" style={{ height: '2rem', width: '80%', marginBottom: '1rem' }} />
              {Array.from({ length: 2 }).map((__, j) => (
                <div key={j} className="skeleton" style={{ height: '100px', marginBottom: '0.75rem', borderRadius: '12px' }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state__icon">⚠️</div>
          <h3>Error</h3>
          <p>{error}</p>
          <button className="btn btn--primary" onClick={fetchAll}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pipeline</h1>
          <p className="page-subtitle">
            Drag cards between columns to move candidates through stages
          </p>
        </div>
      </div>
      <KanbanBoard candidates={candidates} onUpdate={fetchAll} />
    </div>
  );
};

export default Pipeline;
