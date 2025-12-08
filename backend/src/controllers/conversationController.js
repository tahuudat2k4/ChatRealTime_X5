import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// Create a new conversation
export const createConversation = async (req, res) => {
    try {
        const {type, name, memberIds} = req.body;
        const userId = req.user._id;
        // Check required fields
        if(!type || (type === 'group' && !name) || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0){
            return res.status(400).json({
                success: false,
                message: 'Group name and memberIds are required for group conversations'
            });
        }
        
        let conversation ;
        // For direct conversations, check if one already exists between the two users
        if(type === 'direct'){
            const participantId = memberIds[0];
            conversation = await Conversation.findOne({
                type: 'direct',
                "participants.userId": {$all: [userId, participantId]}
            });
            // If conversation doesn't exist, create a new one
            if(!conversation){
                conversation = new Conversation({
                    type: 'direct',
                    participants: [{userId}, {userId: participantId}], 
                    lastMessageAt: new Date()
                });
                await conversation.save();
            }
        }
        // For group conversations
        if(type === 'group'){
            conversation = new Conversation({
                type: 'group',
                participants: [
                    {userId},
                    ...memberIds.map((id) => ({userId: id}))
                ],
                group: {
                    name,
                    createdBy: userId
                },
                lastqMessageAt: new Date()
            });
            await conversation.save();
        }
        // Check if conversation was created successfully
        if(!conversation){
            return res.status(400).json({
                success: false,
                message: 'Conversation type is not valid'
            });
        }
        await conversation.populate([
            {path: 'participants.userId', select: 'displayName avatarUrl'},
            {
                path: "seenBy",
                select: "displayName avatarUrl"
            },
            {
                path: "lastMessage.senderId", select: "displayName avatarUrl"
            }
        ])
        return res.status(201).json({
            success: true,
            conversation
        });
    } catch (error) {
        console.error('Error creating conversation:', error);
        return res.status(500).json({ message: 'Internal server error' });  
    }
}
// Get all conversations for a user
export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({
            'participants.userId': userId
        }).sort({lastMessageAt: -1, updatedAt: -1})
          .populate({
             path: 'participants.userId',
             select: 'displayName avatarUrl'
          })
          .populate({
            path: 'lastMessage.senderId',
            select: 'displayName avatarUrl'
          })
          .populate({
            path: 'seenBy',
            select: 'displayName avatarUrl'
          });
          const formatted = conversations.map((conv) => {
            const participants = (conv.participants || []).map((p) => ({
                _id: p.userId?._id,
                displayName: p.userId?.displayName,
                avatarUrl: p.userId?.avatarUrl ?? null,
                joinedAt: p.joinedAt 
            }))
            return {
                ...conv.toObject(),
                unreadCounts: conv.unreadCounts || {},
                participants
            }
          });
        return res.status(200).json({
            success: true,
            conversations: formatted
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
// Get messages for a conversation
export const getMessages = async (req, res) => {
    try {
         const {conversationId} = req.params;
         const {limit = 50, cursor} = req.query;
         const query = {conversationId};

         if(cursor){
            query._id = {$lt: new Date(cursor)}
         }
         let messages = await Message.find(query)
            .sort({createdAt: -1})
            .limit(Number(limit) + 1);

         let nextCursor = null;
         if(messages.length > Number(limit)){
            const nextMessage = messages[messages.length -1];
            nextCursor = nextMessage.createdAt.toISOString();
            messages.pop();
         }
         messages = messages.reverse();
         return res.status(200).json({
            success: true,
            messages,
            nextCursor
         });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
// Helper function to get conversation IDs for a user (for Socket.IO)
export const getUserConversationsForSocketIO = async (userId) => {
    try {
        const conversations = await Conversation.find(
           {"participants.userId": userId},
           {_id: 1}, 
        );
        return conversations.map((c) => c._id.toString());
    } catch (error) {
        console.error('Error fetching user conversations for Socket.IO:', error);
        return [];
    }
}