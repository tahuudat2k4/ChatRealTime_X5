// Controller to handle user authentication
export const authMe = async (req, res) => {
    try {
        const user = req.user; // Retrieved from protectedRoute middleware
        return res.status(200).json({
            success: true,
            message: "User authenticated successfully", 
            user
        });
    
    } catch (error) {
        console.error("Error in authMe controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};