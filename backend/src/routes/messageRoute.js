import express from 'express';
import {sendDirectMessage, sendGroupMessage} from '../controllers/messageController.js';

const router = express.Router();
// Send a direct message
router.post('/direct', sendDirectMessage);
// Send a group message
router.post('/group', sendGroupMessage);

export default router;