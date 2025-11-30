import mongoose from 'mongoose';

// Define the Session schema
const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    refreshToken: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true }
},{
    timestamps: true
});
// Delete session after expiration
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Export the Session model
const Session = mongoose.model('Session', sessionSchema);
export default Session;