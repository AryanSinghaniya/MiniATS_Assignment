const express = require('express');
const { body } = require('express-validator');
const {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  updateStage,
  deleteCandidate,
  exportCandidatesCSV,
} = require('../controllers/candidateController');

const router = express.Router();

// Shared validation rules for create and update
const candidateValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim(),
  body('experience')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Experience must be a non-negative number'),
  body('stage')
    .optional()
    .isIn(['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'])
    .withMessage('Invalid stage value'),
];

router.route('/').get(getCandidates).post(candidateValidation, createCandidate);

// Export CSV route (MUST be defined before /:id so 'export' is not treated as an id parameter)
router.route('/export').get(exportCandidatesCSV);

router
  .route('/:id')
  .get(getCandidateById)
  .put(candidateValidation, updateCandidate)
  .delete(deleteCandidate);

router.route('/:id/stage').patch(updateStage);

module.exports = router;
