import { useChatStore } from "@/stores/useChatStore";
import GroupChatCard from "./GroupChatCard";

const GroupChatList = () => {
  const {conversations} = useChatStore();
  if(!conversations) return ;

  const groupchats = conversations.filter(c => c.type === "group");
  return (
    <div className='flex-1 overflow-y-auto p-2 space-y-2'>
      {
        groupchats.map(conversation => (
          <GroupChatCard c = {conversation} key={conversation._id}/>
          
        ))
      }
    </div>
  )
}

export default GroupChatList;
