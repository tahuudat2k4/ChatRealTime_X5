import express from 'express';
import {sendDirectMessage, sendGroupMessage} from '../controllers/messageController.js';
import { checkFriendship, checkGroupMembership } from '../middlewares/friendMiddleware.js';

const router = express.Router();
// Send a direct message
router.post('/direct', checkFriendship , sendDirectMessage);
// Send a group message
router.post('/group',checkGroupMembership, sendGroupMessage);

export default router;