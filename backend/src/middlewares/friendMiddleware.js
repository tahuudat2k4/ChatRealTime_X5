import Conversation from '../models/Conversation.js';
import Friend from '../models/Friend.js';

const pair = (a,b) =>(a<b)? [a, b]: [b, a];
// Middleware to check if users are friends before allowing messaging
export const checkFriendship = async (req, res, next) => {
    try {
        const me = req.user._id.toString();
        const recipientId = req.body?.recipientId ?? null; 
        const memberIds = req.body?.memberIds ?? [];

        if(!recipientId && memberIds.length === 0){
            return res.status(400).json({
                success: false,
                message: 'recipientId is required'
            })
        }
        if(recipientId){
            const [userA, userB] = pair(me, recipientId);

            const isFriend = await Friend.findOne({userA, userB});
            
            if(!isFriend){
                return res.status(403).json({
                    success: false,
                    message: 'You can only send messages to your friends'
                });
            }
            return next();
        }
        const friendChecks = memberIds.map(async (memberId) =>{
            const [userA, userB] = pair(me, memberId);
            const friend = await Friend.findOne({userA, userB});
            return friend ? null : memberId;
        })

        const results = await Promise.all(friendChecks);
        const notFriends = results.filter(Boolean);
        if(notFriends.length > 0){
            return res.status(403).json({
                success: false,
                message: `You can only add your friends to the conversation. Not friends with user IDs: ${notFriends.join(', ')}`
            })
        }
        next();
    } catch (error) {
        console.error('Error checking friendship:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
// Middleware to check if user is a member of the group conversation
export const checkGroupMembership = async (req, res, next) => {
    try {
        const {conversationId} = req.body;
        const userId = req.user._id;
        const conversation = await Conversation.findById(conversationId);
        if(!conversation){
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }
        const isMember = conversation.participants.some(
            (p) => p.userId.toString() === userId.toString());
        if(!isMember){
            return res.status(403).json({
                success: false,
                message: 'You are not a member of this conversation'
            });
        }
        req.conversation = conversation;
        next();
    } catch (error) {
        console.error('Error checking group membership:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}