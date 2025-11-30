import express from 'express';
import { authMe } from '../controllers/userController.js';

const router = express.Router();

// Define the route to get authenticated user info
router.get('/me', authMe);
export default router;