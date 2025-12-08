import type { Conversation } from '@/types/chat';
import ChatCard from './ChatCard';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStore';
import { cn } from '@/lib/utils';
import StatusBadge from './StatusBadge';
import UnreadCountBadge from './UnreadCountBadge';
import UserAvatar from './UserAvatar';
import { useSocketStore } from '@/stores/useSocketStore';



const DirectMessageCard = ({c}: {c: Conversation}) => {
  const {user} = useAuthStore();
  const {activeConversationId, setActiveConversation, messages, fetchMessages} = useChatStore();
  const {onlineUsers} = useSocketStore();
  
  if(!user) return null;
  const otherUser = c.participants.find((p)=> p._id !== user._id);
  if(!otherUser) return null; 
  const unreadCount = c.unreadCounts[user._id];
  const lastMessage = c.lastMessage?.content ?? "";

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if(!messages[id]) {
      await fetchMessages();
    }
  }
  return (
    <ChatCard
      convoId={c._id}
      name={otherUser.displayName ?? ""}
      timestamp={
        c.lastMessage ?. createdAt ?  new Date(c.lastMessage.createdAt): undefined
      }
      isActive = {activeConversationId === c._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      leftSection={
        <>
          <UserAvatar type="sidebar" name={otherUser.displayName ?? ""} avatarUrl={otherUser.avatarUrl ?? undefined}/>
          <StatusBadge status={onlineUsers.includes(otherUser?._id?? "")? "online":"offline"} />
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount}/> }
        </>
      }
      subtitle={
        <p className={cn(
          "text-sm truncate", unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"
        )}>{lastMessage}</p>
      }
    />
  )
}

export default DirectMessageCard;
