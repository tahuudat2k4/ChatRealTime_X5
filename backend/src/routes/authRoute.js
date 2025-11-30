import express from 'express';
import { signUp, signIn, signOut, refreshToken } from '../controllers/authController.js';
// Create a new router instance
const router = express.Router();

// Define the signup route
router.post('/signup', signUp);
// Define the signin route
router.post('/signin', signIn);
// Define the signout route 
router.post('/signout', signOut);
// Define the token refresh route
router.post('/refresh', refreshToken);


export default router;
