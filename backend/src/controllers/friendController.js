import Friend from "../models/Friend.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

// Handle logic adding a new friend
export const sendFriendRequest = async (req, res) => {
    try {
        const { to, message } = req.body;
        const from = req.user._id;
        // Prevent users from sending friend requests to themselves
        if (from === to) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a friend request to yourself"
            });
        }
        const userExists = await User.exists({ _id: to });
        // Check if the user to whom the friend request is being sent exists
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "The user you are trying to add does not exist"
            });
        }
        let userA = from.toString();
        let userB = to.toString();
        // Ensure consistent ordering of user IDs use destructuring instead of temp variable
        if (userA > userB) {
            [userA, userB] = [userB, userA];
        }
        const [alreadyFriends, existingRequest] = await Promise.all([
            Friend.findOne({ userA, userB }),
            FriendRequest.findOne({
                $or: [
                    { from, to },
                    { from: to, to: from }
                ]
            })
        ]);

        if (alreadyFriends) {
            return res.status(400).json({
                success: false,
                message: "You are already friends with this user"
            })
        }
        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "A friend request is already pending between you and this user"
            });
        }
        const request = await FriendRequest.create({
            from,
            to,
            message
        });
        return res.status(201).json({
            success: true,
            message: "Friend request sent successfully",
            request
        });
    } catch (error) {
        console.error("Error adding friend:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
// Handle logic accepting a friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found"
            });
        }
        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept this friend request"
            });
        }
        const friend = await Friend.create({
            userA: request.from,
            userB: request.to
        });
        await FriendRequest.findByIdAndDelete(requestId);

        const from = await User.findById(request.from).select("_id displayName avatarUrl").lean();
        return res.status(200).json({
            success: true,
            message: "Friend request accepted",
            newFriend: {
                _id: from?._id,
                displayName: from?.displayName,
                avatarUrl: from?.avatarUrl
            }
        });

    } catch (error) {
        console.error("Error accept friend request:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
// Handle logic declining a friend request
export const declineFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found"
            })
        }
        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to decline this friend request"
            });
        }
        await FriendRequest.findByIdAndDelete(requestId);
        return res.sendStatus(204);
    } catch (error) {
        console.error("Error decline friend request:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
// Handle logic get all friends of a user
export const getAllFriends = async (req, res) => {
    try {
        // Get the user ID from the authenticated user
        const userId = req.user._id;
        // Find all friendships involving the user
        const friendShips = await Friend.find({
            $or: [{ userA: userId }, { userB: userId }]
        })
            .populate("userA", "_id displayName avatarUrl") // populate userA details
            .populate("userB", "_id displayName avatarUrl") // populate userB details
            .lean(); // Use lean() for better performance
        // If no friendships found, return empty array
        if (!friendShips) {
            return res.status(200).json({ friends: [] });
        }
        // Map through friendships to extract the friend user details
        const friends = friendShips.map((f) => f.userA._id.toString() === userId.toString() ? f.userB : f.userA);
        return res.status(200).json({ friends });
    } catch (error) {
        console.error("Error getting list friend:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
// Handle logic get all friend requests of a user
export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const populateFields = '_id username displayName avatarUrl';

        const [sent, received] = await Promise.all([
            FriendRequest.find({ from: userId }).populate('to', populateFields),
            FriendRequest.find({ to: userId }).populate('from', populateFields)
        ]);
        return res.status(200).json({
            sent, received
        });

    } catch (error) {
        console.error("Error getting all friend request:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};