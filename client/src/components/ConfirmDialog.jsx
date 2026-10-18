/**
 * ConfirmDialog - a simple yes/no confirmation modal
 * Used before destructive actions like deleting a candidate
 */
const ConfirmDialog = ({ isOpen, onConfirm, onCancel, message, danger = true }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="alertdialog" aria-modal="true">
      <div className="modal modal--sm">
        <div className="modal__body" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>
            {message || 'Are you sure you want to do this?'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="btn btn--ghost" onClick={onCancel}>
              Cancel
            </button>
            <button
              className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`}
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
