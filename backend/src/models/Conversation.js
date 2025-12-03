import mongoose from "mongoose";
// Subdocument schema for participants in a conversation
const participantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });
// Placeholder for future group-specific fields
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { _id: false });
// Subdocument schema for the last message in a conversation
const lastMessageSchema = new mongoose.Schema({
    _id: { type: String },
    content: { type: String, default: null },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });
// Main conversation schema
const conversationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["direct", "group"],
            required: true
        },
        participants: {
            type: [participantSchema],
            required: true,
        },
        group: {
            type: groupSchema,

        },
        lastMessageAt: {
            type: Date,
        },
        seenBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        lastMessage: {
            type: lastMessageSchema,
            default: null
        },
        unreadCounts: {
            type: Map,
            of: Number,
            default: {}
        }
    }, { timestamps: true }
);
conversationSchema.index({ "participant.userId": 1, lastMessageAt: -1 });
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;