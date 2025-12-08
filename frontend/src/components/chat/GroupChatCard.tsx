import type { Conversation } from "@/types/chat";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import ChatCard from "./ChatCard";
import UnreadCountBadge from "./UnreadCountBadge";
import GroupChatAvatar from "./GroupChatAvatar";

const GroupChatCard = ({c}: {c: Conversation}) => {
  const {user} = useAuthStore();
  const {activeConversationId, setActiveConversation, messages, fetchMessages} = useChatStore();
  if(!user) return null;

  const unreadCount = c.unreadCounts[user._id];
  const name = c.group?.name ?? "";
  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if(!messages[id]) {
      await fetchMessages();
    }
  }
  return (
    <ChatCard 
      convoId={c._id}
      name={name}
      timestamp={
        c.lastMessage?.createdAt ? new Date(c.lastMessage.createdAt) : undefined 
      }
      isActive={activeConversationId === c._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      leftSection={
        <>
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount}/>}
          <GroupChatAvatar participants={c.participants} type="chat"/>
        </>
      }
      subtitle={
        <p className="text-sm truncate text-muted-foreground">{c.participants.length} thành viên</p>
      }
    />
  )
}

export default GroupChatCard;
