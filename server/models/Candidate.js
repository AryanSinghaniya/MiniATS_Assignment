const mongoose = require('mongoose');

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
    },
    notes: {
      type: String,
      trim: true,
    },
    stage: {
      type: String,
      enum: {
        values: STAGES,
        message: `Stage must be one of: ${STAGES.join(', ')}`,
      },
      default: 'Applied',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Text index for full-text search on name, email, and skills
candidateSchema.index({ name: 'text', email: 'text', skills: 'text' });

// Export the stage values so other modules can reference them
candidateSchema.statics.STAGES = STAGES;

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
