import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatState } from "../types/store";
import { chatService } from "../services/chatService";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            convoLoading: false, // conversations loading state
            messageLoading: false, // messages loading state
            setActiveConversation: (id) => set({ activeConversationId: id }),
            reset: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                    convoLoading: false,
                    messageLoading: false,
                })
            },
            fetchConversations: async () => {
                try {
                    set({ convoLoading: true });
                    const { conversations } = await chatService.fetchConversations();
                    set({ conversations, convoLoading: false });
                } catch (error) {
                    console.error("Failed to fetch conversations:", error);
                    set({ convoLoading: false });
                }
            },
            fetchMessages: async (conversationId) => {
                const { activeConversationId, messages } = get();
                const { user } = useAuthStore.getState();

                const convoId = conversationId ?? activeConversationId;
                if (!convoId) return;
                const current = messages?.[convoId];
                const nextCursor = current?.nextCursor === undefined ? "" : current?.nextCursor;
                if (nextCursor === null) return; // no more data to load
                set({ messageLoading: true });

                try {
                    const { messages: fetched, cursor } = await chatService.fetchMessages(convoId, nextCursor);

                    const processed = fetched.map((msg) => ({
                        ...msg,
                        isOwn: msg.senderId === user?._id
                    }));
                    set((state) => {
                        const prev = state.messages[convoId]?.items ?? [];
                        const merged = prev.length > 0 ? [...processed, ...prev] : processed;

                        return {
                            messages: {
                                ...state.messages,
                                [convoId]: {
                                    items: merged,
                                    hasMore: !!cursor,
                                    nextCursor: cursor ?? null,
                                }
                            }
                        }
                    })
                } catch (error) {
                    console.error("Failed to fetch messages:", error);

                } finally {
                    set({ messageLoading: false })
                }
            },
            sendDirectMessage: async (recipientId, content, imgUrl) => {
                try {
                    const {activeConversationId} = get();
                    await chatService.sendDirectMessage(recipientId, content, imgUrl, activeConversationId ?? undefined);
                    set((state) => ({
                        conversations: state.conversations.map((c) => c._id === activeConversationId 
                        ? {...c, seenBy: []}
                        : c)
                    }));
                } catch (error) {
                    console.error("Failed to send direct message:", error);
                }
            },
            sendGroupMessage: async (conversationId, content, imgUrl) => {
                try {
                    await chatService.sendGroupMessage(conversationId, content, imgUrl);
                    set((state) => ({
                        conversations: state.conversations.map((c) => c._id === get().activeConversationId
                        ? {...c, seenBy: []}
                        : c )
                    }))
                } catch (error) {
                    console.error("Failed to send group message:", error);
                }
            },
            addMessage: async (message) => {
                try {
                    const {user} = useAuthStore.getState();
                    const {fetchMessages} = get();

                    message.isOwn = message.senderId === user?._id;
                    const convoId = message.conversationId;
                    let prevItems = get().messages[convoId]?.items ?? [];

                    if(prevItems.length === 0 ){
                        await fetchMessages(message.conversationId);
                        prevItems = get().message[convoId]?.items ?? [];
                    }
                    set((state) => {
                        if(prevItems.some((m) => m._id === message._id)){
                            return state;
                        }
                        return {
                             messages: {
                                ...state.messages,
                                [convoId]: {
                                    items: [...prevItems, message],
                                    hasMore: state.messages[convoId].hasMore ,
                                    nextCursor: state.messages[convoId].nextCursor ?? undefined,
                                }
                             }
                        }
                    });
                } catch (error) {
                    console.error("Failed to add message:", error);
                }
            },
            updateConversation: (conversation) => {
                set((state) => ({
                    conversations: state.conversations.map((c) =>c._id === conversation._id ? {...c, ...conversation}: c)
                }));
            },
        }),
        {
            name: "chat-storage",
            partialize: (state) => ({ conversations: state.conversations })
        }
    )
)