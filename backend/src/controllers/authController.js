import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';

// Create time for token expiration
const ACCESS_TOKEN_EXPIRES_IN = '30m';
const REFRESH_TOKEN_EXPIRES_IN = 14 * 24 * 60 * 60 * 1000; // 14 days in seconds
// User SignUp Controller 
export const signUp = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        // Validate input
        if (!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "Cannot submit empty fields"
            });
        }
        // Check if user already exists
        const duplicateUser = await User.findOne({username});
        if(duplicateUser) {
            return res.status(409).json({
                success: false,
                message: "Username already taken"
            });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 mean salt rounds
        // Create new user in the database
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${lastName} ${firstName}`
        })
        // Respond with success
        return res.status(204).json({
            success: true,
            message: "User created successfully"
        });
    } catch (error) {
        console.error("Error during user signup:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
// User SignIn Controller
export const signIn = async (req, res) => {

    try {
        // Extract username and password from request body
        const {username, password} = req.body; 
        // Validate input
        if(!username || !password) {
            return res.statuts(400).json({
                success: false,
                message: "Cannot submit empty fields"
            });
        }
        // Find user by username
        const existingUser = await User.findOne({username});
        if(!existingUser) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        // If user exists, compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, existingUser.hashedPassword);
        if(!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        // Create access token with JWT (JSON Web Token)
        const accessToken = jwt.sign({userId: existingUser._id}, process.env.JWT_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRES_IN});
        // Create refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');
        // Save refresh token in the database
        await Session.create({
            userId: existingUser._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN)
        });
        // Return refresh tokens to the client in cookies
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_EXPIRES_IN
        });
        // Respond with access token to the client 
        return res.status(200).json({
            success: true,
            message: `User ${existingUser.displayName} signed in successfully !`,
            accessToken
        })
    } catch (error) {
        console.log("Error during user signin:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};
// User SignOut Controller
export const signOut = async (req, res) => {
    try {
        // Get refresh token from cookies
        const token = req.cookies?.refreshToken;
        if(token) {
            // Delete the refresh token from the database
            await Session.deleteOne({refreshToken: token});
            // Clear the refresh token cookie
            res.clearCookie('refreshToken');
        }
        return res.sendStatus(204) ;
    } catch (error) {
        console.log("Error during user signout:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};
// Token Refresh Controller
export const refreshToken = async (req, res) => {
    try {
        // Get refresh token from cookies
        const token = req.cookies?.refreshToken;
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided"})
        }
        // Compare refresh token with the database
        const existingSession = await Session.findOne({refreshToken: token});
        if(!existingSession) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token or session expired"
            });
        }
        // Check if refresh token is valid
        if(existingSession.expiresAt < new Date()) {
            return res.status(403).json({
                success: false,
                message: "Refresh token expired, please sign in again"
            });
        }
        // Create new access token
        const newAccessToken = jwt.sign({
            userId: existingSession.userId
        }, process.env.JWT_SECRET, 
        {expiresIn: ACCESS_TOKEN_EXPIRES_IN});
        // Return new access token to the client
        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error("Error during token refresh:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
