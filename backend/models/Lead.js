const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [50, 'City name cannot exceed 50 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [50, 'State name cannot exceed 50 characters']
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
    enum: {
      values: ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'],
      message: 'Source must be one of: website, facebook_ads, google_ads, referral, events, other'
    }
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['new', 'contacted', 'qualified', 'lost', 'won'],
      message: 'Status must be one of: new, contacted, qualified, lost, won'
    },
    default: 'new'
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be less than 0'],
    max: [100, 'Score cannot exceed 100'],
    default: 0
  },
  leadValue: {
    type: Number,
    required: [true, 'Lead value is required'],
    min: [0, 'Lead value cannot be negative'],
    default: 0
  },
  lastActivityAt: {
    type: Date,
    default: null
  },
  isQualified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdBy: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ lastActivityAt: -1 });
leadSchema.index({ score: -1 });
leadSchema.index({ leadValue: -1 });

// Compound indexes for filtering
leadSchema.index({ status: 1, source: 1 });
leadSchema.index({ createdBy: 1, status: 1 });
leadSchema.index({ company: 'text', firstName: 'text', lastName: 'text', email: 'text' });

// Virtual for full name
leadSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
leadSchema.set('toJSON', { virtuals: true });
leadSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update lastActivityAt
leadSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastActivityAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Lead', leadSchema);
