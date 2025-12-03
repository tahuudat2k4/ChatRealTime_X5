import express from 'express';
import { 
    sendFriendRequest, 
    acceptFriendRequest, 
    declineFriendRequest, 
    getAllFriends, 
    getFriendRequests 
} from '../controllers/friendController.js';

const router = express.Router();
// Add new friend
router.post("/requests", sendFriendRequest);
// Accept friend request
router.post("/requests/:requestId/accept", acceptFriendRequest);
// Decline friend request
router.post("/requests/:requestId/decline", declineFriendRequest);
// Get all friends of a user
router.get("/", getAllFriends);
// Get all friend requests of a user
router.get("/requests", getFriendRequests);

export default router;