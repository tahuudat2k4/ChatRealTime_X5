import { SidebarInset } from "../ui/sidebar"
import ChatWindowHeader from "./ChatWindowHeader"
const ChatWelcomeScreen = () => {
    return (
        <SidebarInset className="flex w-full h-full bg-transparent">
            <ChatWindowHeader />
            <div className="flex bg-primary-foreground rounded-2xl flex-1 items-center justify-center">
                <div className="text-center ">
                    <div className="size-24 mx-auto mb-6 bg-primary  rounded-full 
                flex items-center justify-center shadow-glow pulse-ring">
                        <span className="text-5xl text-white">
                            🗪
                        </span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-primary">
                        Chào mừng bạn đến với X5 !
                    </h2>
                    <p className="text-m font-normal text-muted-foreground">Chọn một cuộc hội thoại để bắt đầu trò chuyện ✨</p>

                </div>
            </div>

        </SidebarInset>
    )
}

export default ChatWelcomeScreen
