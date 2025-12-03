import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import {updateConversationAfterCreateMessage} from '../utils/messageHelper.js';

// Send a direct message from one user to another
export const sendDirectMessage = async (req, res) => {
     try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;

    let conversation;

    if (!content) {
      return res.status(400).json({ message: "Lack of information" });
    }

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    return res.status(201).json({ message })
    } catch (error) {
        console.error('Error sending direct message:', error);
        res.status(500).json({ error: 'Internal server error' });     
    }
}
// Send a message to a group conversation
export const sendGroupMessage = async (req, res) => {
    try {
        
    } catch (error) {
        console.error('Error sending group message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}