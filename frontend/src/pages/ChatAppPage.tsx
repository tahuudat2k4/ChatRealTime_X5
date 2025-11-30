import Signout from "@/components/auth/signout";
import { useAuthStore } from "@/stores/useAuthStore";

const ChatAppPage = () => {
  const user =  useAuthStore(s => s.user);
  return (
    <div>
      {user && <div>Welcome, {user.displayName} !</div>}
      <Signout/>
    </div>
  )
}

export default ChatAppPage;
