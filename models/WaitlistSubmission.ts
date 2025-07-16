import mongoose, { Schema, models } from 'mongoose';

// Regex for international phone numbers
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const WaitlistSubmissionSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [phoneRegex, 'Please enter a valid phone number.'],
  },
  referrer: {
    type: String,
    trim: true,
    default: 'Direct',
  },
}, {
  timestamps: true,
});

const WaitlistSubmission = models.WaitlistSubmission || mongoose.model('WaitlistSubmission', WaitlistSubmissionSchema);

export default WaitlistSubmission;