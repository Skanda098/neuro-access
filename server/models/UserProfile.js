import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, default: 'default-user' },
    fontSize: { type: Number, default: 18 },
    fontFamily: { type: String, default: 'sans-serif' },
    lineSpacing: { type: Number, default: 1.6 },
    contrastMode: {
      type: String,
      enum: ['standard', 'dark', 'high-contrast', 'sepia'],
      default: 'standard'
    },
    speechRate: { type: Number, default: 1.0 }
  },
  { timestamps: true }
);

export default mongoose.model('UserProfile', userProfileSchema);