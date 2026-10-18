/**
 * Pagination - renders Previous/Next and page-number buttons
 *
 * @param {number} currentPage - the current active page (1-indexed)
 * @param {number} totalPages - total number of pages
 * @param {Function} onPageChange - callback called with the new page number
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Build a list of page numbers to display (show max 5 around current page)
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    if (left > 1) range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push('...');
    if (right < totalPages) range.push(totalPages);

    return range;
  };

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {getPageNumbers().map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
        ) : (
          <button
            key={page}
            className={`pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        )
      )}

      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
