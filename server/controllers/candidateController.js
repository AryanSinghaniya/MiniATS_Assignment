const { validationResult } = require('express-validator');
const Candidate = require('../models/Candidate');
const asyncHandler = require('../middleware/asyncHandler');

// Helper: throw a formatted error
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Helper: check express-validator results and throw on failure
const checkValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error(
      errors
        .array()
        .map((e) => e.msg)
        .join(', ')
    );
    err.statusCode = 400;
    throw err;
  }
};

// ─── POST /api/candidates ──────────────────────────────────────────────────
const createCandidate = asyncHandler(async (req, res) => {
  checkValidation(req);

  const candidate = await Candidate.create(req.body);

  res.status(201).json({ success: true, data: candidate });
});

// ─── GET /api/candidates ───────────────────────────────────────────────────
const getCandidates = asyncHandler(async (req, res) => {
  const {
    search = '',
    stage = '',
    page = 1,
    limit = 10,
    sort = '-createdAt',
  } = req.query;

  const filter = {};

  // Stage filter
  if (stage && Candidate.STAGES.includes(stage)) {
    filter.stage = stage;
  }

  // Full-text search on name, email, skills
  if (search.trim()) {
    filter.$text = { $search: search.trim() };
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [candidates, total] = await Promise.all([
    Candidate.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
    Candidate.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: candidates,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// ─── GET /api/candidates/:id ───────────────────────────────────────────────
const getCandidateById = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) throw createError('Candidate not found', 404);

  res.json({ success: true, data: candidate });
});

// ─── PUT /api/candidates/:id ───────────────────────────────────────────────
const updateCandidate = asyncHandler(async (req, res) => {
  checkValidation(req);

  const candidate = await Candidate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!candidate) throw createError('Candidate not found', 404);

  res.json({ success: true, data: candidate });
});

// ─── PATCH /api/candidates/:id/stage ──────────────────────────────────────
const updateStage = asyncHandler(async (req, res) => {
  const { stage } = req.body;

  if (!stage || !Candidate.STAGES.includes(stage)) {
    throw createError(
      `Stage must be one of: ${Candidate.STAGES.join(', ')}`,
      400
    );
  }

  const candidate = await Candidate.findByIdAndUpdate(
    req.params.id,
    { stage },
    { new: true, runValidators: true }
  );

  if (!candidate) throw createError('Candidate not found', 404);

  res.json({ success: true, data: candidate });
});

// ─── DELETE /api/candidates/:id ───────────────────────────────────────────
const deleteCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findByIdAndDelete(req.params.id);
  if (!candidate) throw createError('Candidate not found', 404);

  res.json({ success: true, message: 'Candidate deleted successfully' });
});

module.exports = {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  updateStage,
  deleteCandidate,
};
