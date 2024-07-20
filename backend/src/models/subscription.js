const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subscriptionType: { type: String, enum: ['HypeMode', 'Studio'], required: true },
  startDate: { type: Date, default: Date.now },
  // Add more fields as needed (e.g., endDate, isActive)
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
