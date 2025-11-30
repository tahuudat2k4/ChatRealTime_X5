import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "../services/authService";
import type { AuthState } from "../types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,
    // Set access token
    setAccessToken: (accessToken) => {
        set({ accessToken });
    },
    // Clear auth state
    clearState: () => {
        set({
            accessToken: null,
            user: null,
            loading: false,
        });
    },
    signUp: async (firstName, lastName, username, email, password) => {
        try {
            set({ loading: true });
            // call backend api for signup
            await authService.signUp(firstName, lastName, username, email, password);
            toast.success("Đăng ký thành công! Vui lòng đăng nhập lại.");
        } catch (error) {
            console.error(error);
            toast.error("Đã có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.");
        } finally {
            set({ loading: false });
        }
    },
    signIn: async (username, password) => {
        try {
            set({ loading: true });
            // call backend api for signin
            const { accessToken } = await authService.signIn(username, password);
            get().setAccessToken(accessToken);
            // fetch current user info
            await get().fetchMe();
            toast.success(`Đăng nhập thành công, bắt đầu trò chuyện thôi !`);
        } catch (error) {
            console.error(error);
            toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        } finally {
            set({ loading: false });
        }
    },
    signOut: async () => {
        try {
            // clear auth state first
            get().clearState();
            // call backend api for signout
            await authService.signOut();
            toast.success("Đăng xuất thành công !");
        } catch (error) {
            console.error(error);
            toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
        }
    },
    fetchMe: async () => {
        try {
            set({ loading: true });
            const user = await authService.fetchMe();
            set({ user });
        } catch (error) {
            console.error(error);
            set({ user: null, accessToken: null });
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } finally {
            set({ loading: false });
        }
    },
    refresh: async () => {
        try {
            set({ loading: true });
            const {user, fetchMe, setAccessToken} = get();
            const accessToken = await authService.refresh();
            setAccessToken(accessToken);
            // If user is already fetched, fetch again to update info
            if(!user){
                await fetchMe();
            }
        } catch (error) {
            console.error("Làm mới token thất bại:", error);
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            get().clearState();
        } finally {
            set({ loading: false });
        }
    },
}));
