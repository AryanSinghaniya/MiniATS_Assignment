import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCandidateById } from '../api/candidates';
import CandidateForm from '../components/CandidateForm';
import Skeleton from '../components/Skeleton';

/**
 * EditCandidate page - loads existing candidate data and renders the form in edit mode
 */
const EditCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCandidateById(id);
        setCandidate(res.data.data);
      } catch {
        toast.error('Candidate not found');
        navigate('/candidates');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleSuccess = () => {
    navigate(`/candidates/${id}`);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="card" style={{ maxWidth: 700, margin: '0 auto' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="2.5rem" style={{ marginBottom: '1rem', borderRadius: '8px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn--ghost" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>Edit Candidate</h1>
      </div>
      <div className="card" style={{ maxWidth: 700, margin: '0 auto' }}>
        <CandidateForm
          initialData={candidate}
          isEditMode
          onSuccess={handleSuccess}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
};

export default EditCandidate;
