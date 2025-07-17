import mongoose, { Schema, models } from 'mongoose';

// Regex for international phone numbers
const phoneRegex = /^\+?[1-9]\d{6,14}$/;

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
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  phone: {
    type: String,
    // required: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        // If a phone number is provided it must be valid. Allows empty/null values.
        return !v || phoneRegex.test(v);
      },
      message: 'Please enter a valid phone number.'
    },
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