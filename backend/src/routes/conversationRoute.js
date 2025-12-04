import express from 'express';
import { createConversation, getConversations, getMessages } from '../controllers/conversationController.js';
import { checkFriendship } from '../middlewares/friendMiddleware.js';

const router = express.Router();

// Create a new conversation
router.post('/', checkFriendship , createConversation);
// Get all conversations for a user
router.get('/', getConversations);
// Get messages for a conversation
router.get('/:conversationId/messages', getMessages);

export default router;