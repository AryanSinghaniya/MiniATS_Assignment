import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createCandidate, updateCandidate } from '../api/candidates';
import { STAGES } from '../utils/constants';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  position: '',
  skills: '',
  experience: '',
  notes: '',
  stage: 'Applied',
};

/**
 * CandidateForm - handles both creating and editing a candidate.
 * Can be used as a full page (isPage=true) or inside a modal.
 *
 * @param {Object} initialData - pre-filled values when editing
 * @param {Function} onSuccess - called after a successful save
 * @param {Function} onCancel - called when user cancels
 * @param {boolean} isEditMode - true when updating an existing candidate
 */
const CandidateForm = ({ initialData = null, onSuccess, onCancel, isEditMode = false }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        position: initialData.position || '',
        skills: (initialData.skills || []).join(', '),
        experience: initialData.experience ?? '',
        notes: initialData.notes || '',
        stage: initialData.stage || 'Applied',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  // Client-side validation before hitting the API
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Must be a valid email address';
    }
    if (form.experience !== '' && (isNaN(form.experience) || Number(form.experience) < 0)) {
      newErrors.experience = 'Experience must be a positive number';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Convert comma-separated skills string to array
    const payload = {
      ...form,
      skills: form.skills
        ? form.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      experience: form.experience !== '' ? Number(form.experience) : undefined,
    };

    setSubmitting(true);
    try {
      if (isEditMode && initialData) {
        await updateCandidate(initialData._id, payload);
        toast.success('Candidate updated successfully!');
      } else {
        await createCandidate(payload);
        toast.success('Candidate added successfully!');
      }
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'An error occurred. Please try again.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="candidate-form" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="form-server-error" role="alert">
          ⚠️ {serverError}
        </div>
      )}

      <div className="form-grid">
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-input ${errors.name ? 'form-input--error' : ''}`}
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-input ${errors.email ? 'form-input--error' : ''}`}
            value={form.email}
            onChange={handleChange}
            placeholder="jane@example.com"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="form-input"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1-555-0100"
          />
        </div>

        {/* Position */}
        <div className="form-group">
          <label htmlFor="position" className="form-label">Position</label>
          <input
            id="position"
            name="position"
            type="text"
            className="form-input"
            value={form.position}
            onChange={handleChange}
            placeholder="Frontend Developer"
          />
        </div>

        {/* Experience */}
        <div className="form-group">
          <label htmlFor="experience" className="form-label">Experience (years)</label>
          <input
            id="experience"
            name="experience"
            type="number"
            min="0"
            step="0.5"
            className={`form-input ${errors.experience ? 'form-input--error' : ''}`}
            value={form.experience}
            onChange={handleChange}
            placeholder="3"
          />
          {errors.experience && <p className="form-error">{errors.experience}</p>}
        </div>

        {/* Stage */}
        <div className="form-group">
          <label htmlFor="stage" className="form-label">Stage</label>
          <select
            id="stage"
            name="stage"
            className="form-input"
            value={form.stage}
            onChange={handleChange}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Skills – full width */}
        <div className="form-group form-group--full">
          <label htmlFor="skills" className="form-label">
            Skills <span className="form-hint">(comma-separated)</span>
          </label>
          <input
            id="skills"
            name="skills"
            type="text"
            className="form-input"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
          />
        </div>

        {/* Notes – full width */}
        <div className="form-group form-group--full">
          <label htmlFor="notes" className="form-label">Notes</label>
          <textarea
            id="notes"
            name="notes"
            className="form-input form-textarea"
            value={form.notes}
            onChange={handleChange}
            placeholder="Anything notable about this candidate..."
            rows={4}
          />
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn--primary"
          disabled={submitting}
          id="submit-candidate-btn"
        >
          {submitting ? 'Saving...' : isEditMode ? 'Update Candidate' : 'Add Candidate'}
        </button>
      </div>
    </form>
  );
};

export default CandidateForm;
