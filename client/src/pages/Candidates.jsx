import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCandidates } from '../api/candidates';
import CandidateTable from '../components/CandidateTable';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import CandidateForm from '../components/CandidateForm';
import useDebounce from '../hooks/useDebounce';
import { STAGES, DEFAULT_PAGE_LIMIT } from '../utils/constants';

/**
 * Candidates page - searchable, filterable, paginated list of all candidates
 */
const Candidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Search / filter state
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  // Modal state for adding a new candidate
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCandidates({
        search: debouncedSearch,
        stage: stageFilter,
        page,
        limit: DEFAULT_PAGE_LIMIT,
        sort: '-createdAt',
      });
      setCandidates(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, stageFilter, page]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, stageFilter]);

  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchCandidates();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Candidates</h1>
          <p className="page-subtitle">
            {pagination.total} candidate{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          id="add-candidate-btn"
          className="btn btn--primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add Candidate
        </button>
      </div>

      {/* Filters Row */}
      <div className="filters-row">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            className="form-input search-input"
            placeholder="Search by name, email, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <select
          id="stage-filter"
          className="form-input filter-select"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
        >
          <option value="">All Stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <CandidateTable
          candidates={candidates}
          loading={loading}
          onDataChange={fetchCandidates}
        />
      </div>

      {/* Pagination */}
      {!loading && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={setPage}
        />
      )}

      {/* Add Candidate Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Candidate"
        size="lg"
      >
        <CandidateForm
          onSuccess={handleAddSuccess}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Candidates;
