import ChatWelcomeScreen from "./ChatWelcomeScreen";
import ChatWindowSkeleton from "./ChatWindowSkeleton";
import { useChatStore } from "../../stores/useChatStore";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatWindowBody from "./ChatWindowBody";
import MessageInput from "./MessageInput";

const ChatWindowLayout = () => {
  const { activeConversationId, conversations, messageLoading: loading, messages } = useChatStore();

  const selectedConvo = conversations.find((c) => c._id === activeConversationId);

  if (!selectedConvo) {
    return (<ChatWelcomeScreen />);
  }

  if (loading) {
    return (<ChatWindowSkeleton />);
  }
  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      {/* Chat Header */}
      <ChatWindowHeader  chat={selectedConvo}/>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-primary-foreground">
        <ChatWindowBody />
      </div>
      {/* Chat Footer */}
        <MessageInput selectedConvo={selectedConvo}/> 
    </SidebarInset>
  )
}

export default ChatWindowLayout;
