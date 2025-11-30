import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Confirm that the user is authenticated before accessing protected routes
export const protectedRoute = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        // Confirm the token valid and not expired
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied: No Token Provided"
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedUser) => {
            if (err) {
                console.log("JWT Verification Error:", err);
                return res.status(403).json({
                    success: false,
                    message: "Access Denied: Invalid Token"
                });
            }
            // Find the user associated with the token
            const user = await User.findById(decodedUser.userId).select('-hashedPassword');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User Not Found"
                });
            }
            // Attach user to request object for downstream use
            req.user = user;
            next();
        });
    } catch (error) {
        console.log("Error in auth middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}