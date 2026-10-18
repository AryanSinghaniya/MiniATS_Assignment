import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deleteCandidate, updateCandidateStage } from '../api/candidates';
import StageBadge from './StageBadge';
import ConfirmDialog from './ConfirmDialog';
import { STAGES } from '../utils/constants';

/**
 * CandidateTable - renders the list of candidates with inline stage change,
 * edit, delete, and row click to view details.
 *
 * @param {Array} candidates - list of candidate objects
 * @param {boolean} loading - show skeleton rows when true
 * @param {Function} onDataChange - called after a mutation to trigger a refetch
 */
const CandidateTable = ({ candidates, loading, onDataChange }) => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [stageLoading, setStageLoading] = useState({});

  const handleStageChange = async (id, newStage) => {
    setStageLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await updateCandidateStage(id, newStage);
      toast.success(`Stage updated to ${newStage}`);
      onDataChange();
    } catch {
      toast.error('Failed to update stage');
    } finally {
      setStageLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCandidate(deleteId);
      toast.success('Candidate deleted');
      onDataChange();
    } catch {
      toast.error('Failed to delete candidate');
    } finally {
      setDeleteId(null);
    }
  };

  if (!loading && candidates.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">🔍</div>
        <h3>No candidates found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Experience</th>
              <th>Skills</th>
              <th>Stage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j}>
                        <div className="skeleton" style={{ height: '1rem', width: j === 0 ? '130px' : '80px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              : candidates.map((candidate) => (
                  <tr
                    key={candidate._id}
                    className="table-row"
                    onClick={() => navigate(`/candidates/${candidate._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div className="candidate-name-cell">
                        <div className="avatar">{candidate.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{candidate.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {candidate.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{candidate.position || '—'}</td>
                    <td>{candidate.experience != null ? `${candidate.experience} yr${candidate.experience !== 1 ? 's' : ''}` : '—'}</td>
                    <td>
                      <div className="skills-cell">
                        {(candidate.skills || []).slice(0, 2).map((s) => (
                          <span key={s} className="skill-tag">{s}</span>
                        ))}
                        {candidate.skills?.length > 2 && (
                          <span className="skill-tag skill-tag--more">+{candidate.skills.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {stageLoading[candidate._id] ? (
                        <div className="skeleton" style={{ height: '1.75rem', width: '100px' }} />
                      ) : (
                        <select
                          className="stage-select"
                          value={candidate.stage}
                          onChange={(e) => handleStageChange(candidate._id, e.target.value)}
                          style={{
                            backgroundColor: 'var(--surface)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="action-buttons">
                        <button
                          id={`edit-btn-${candidate._id}`}
                          className="btn btn--icon"
                          title="Edit candidate"
                          onClick={() => navigate(`/candidates/${candidate._id}/edit`)}
                        >
                          ✏️
                        </button>
                        <button
                          id={`delete-btn-${candidate._id}`}
                          className="btn btn--icon btn--icon-danger"
                          title="Delete candidate"
                          onClick={() => setDeleteId(candidate._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        message="Are you sure you want to delete this candidate? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
};

export default CandidateTable;
