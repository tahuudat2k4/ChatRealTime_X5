import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import chalk from 'chalk';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddleware.js';
import cors from 'cors';
import friendRoute from './routes/friendRoute.js';
import messageRoute from './routes/messageRoute.js';
import conversationRoute from './routes/conversationRoute.js';
import {app, server} from './socket/index.js';

// Load environment variables from .env file
dotenv.config();
// Define a port from environment variables or default to 5001
const PORT = process.env.PORT || 5001;
// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL, // Adjust this to your frontend's origin
    credentials: true, // Allow cookies to be sent
}));
// Public routes
app.use('/api/auth', authRoute);
// Apply authentication middleware to protect subsequent routes
app.use(protectedRoute);
// Private routes
app.use('/api/users', userRoute);
app.use('/api/friends', friendRoute);
app.use('/api/messages', messageRoute);
app.use('/api/conversations', conversationRoute);
// Connect to the database
connectDB().then(() => {
    // Running the server
    server.listen(PORT, () => {
        console.log(chalk.black.bgMagenta(`👽 Server is running on http://localhost: ${PORT} !`));
    })
});
