import api from "../lib/axios";

export const authService = {
    signUp: async (firstName: string, lastName: string, username: string, email: string, password: string) => {
        const response = await api.post("/auth/signup", {
            firstName,
            lastName,
            username,
            email,
            password,
        }, {withCredentials: true});
        return response.data;
    },
    signIn: async (username: string, password: string) => {
        const response = await api.post("/auth/signin", {
            username,
            password,
        }, {withCredentials: true});
        return response.data; // Return user data and access token
    },
    signOut: async () => {
        return api.post("/auth/signout", {}, {withCredentials: true});
    },
    fetchMe: async () =>{
        const response = await api.get("/users/me", {withCredentials: true});
        return response.data.user;
    },
    refresh: async () =>{
        const response = await api.post("/auth/refresh", {}, {withCredentials: true});
        return response.data.accessToken;
    }
};