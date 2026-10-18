import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCandidateById } from '../api/candidates';
import StageBadge from '../components/StageBadge';
import Skeleton from '../components/Skeleton';

/**
 * CandidateDetail page - shows all information about a single candidate
 */
const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCandidateById(id);
        setCandidate(res.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error('Candidate not found');
          navigate('/candidates');
        } else {
          toast.error('Failed to load candidate');
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  if (loading) {
    return (
      <div className="page">
        <div className="card" style={{ maxWidth: 700, margin: '0 auto' }}>
          <Skeleton height="2rem" width="60%" style={{ marginBottom: '1rem' }} />
          <Skeleton height="1rem" width="40%" style={{ marginBottom: '2rem' }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height="1rem" style={{ marginBottom: '0.75rem' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <div className="page">
      <div className="page-header">
        <button
          className="btn btn--ghost"
          onClick={() => navigate(-1)}
          style={{ marginRight: '1rem' }}
        >
          ← Back
        </button>
      </div>

      <div className="card detail-card">
        {/* Header */}
        <div className="detail-header">
          <div className="detail-avatar">{candidate.name[0]}</div>
          <div>
            <h1 className="detail-name">{candidate.name}</h1>
            <p className="detail-position">{candidate.position || 'No position specified'}</p>
            <StageBadge stage={candidate.stage} />
          </div>
          <div className="detail-actions">
            <button
              className="btn btn--primary"
              onClick={() => navigate(`/candidates/${candidate._id}/edit`)}
              id="edit-candidate-btn"
            >
              ✏️ Edit
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="detail-grid">
          <div className="detail-field">
            <span className="detail-label">📧 Email</span>
            <span className="detail-value">
              <a href={`mailto:${candidate.email}`} className="detail-link">{candidate.email}</a>
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-label">📞 Phone</span>
            <span className="detail-value">{candidate.phone || '—'}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">🕐 Experience</span>
            <span className="detail-value">
              {candidate.experience != null
                ? `${candidate.experience} year${candidate.experience !== 1 ? 's' : ''}`
                : '—'}
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-label">📅 Applied</span>
            <span className="detail-value">{formatDate(candidate.createdAt)}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">🔄 Last Updated</span>
            <span className="detail-value">{formatDate(candidate.updatedAt)}</span>
          </div>
        </div>

        {/* Skills */}
        {candidate.skills?.length > 0 && (
          <div className="detail-section">
            <h3 className="detail-section-title">Skills</h3>
            <div className="skills-cell" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
              {candidate.skills.map((skill) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {candidate.notes && (
          <div className="detail-section">
            <h3 className="detail-section-title">Notes</h3>
            <p className="detail-notes">{candidate.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetail;
