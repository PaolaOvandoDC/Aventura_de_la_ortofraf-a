const mongoose = require('mongoose');

const weeklyChallengeSchema = new mongoose.Schema({
  text: { type: String, required: true },
  hint: { type: String, default: '' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('WeeklyChallenge', weeklyChallengeSchema);
