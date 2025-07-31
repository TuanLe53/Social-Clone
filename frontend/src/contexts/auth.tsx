import { privateAPI } from "@/api";
import { refreshToken } from "@/api/auth";
import { getCurrentUser } from "@/api/user";
import type { UserProfile } from "@/types/user";
import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";


export interface AuthContext{
    currentUser: UserProfile | null;
    isAuthenticated: boolean;
    token: string | null;
    handleLogin: (token: string) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | null>(null);

export const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return authContext;
}

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState < UserProfile | null > (null);
    const [token, setToken] = useState<string | null>(null);

    const getUser = async () => {
        try {
            const response = await getCurrentUser();
            setCurrentUser(response.data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'An error occurred';
            console.log(errorMessage);
            logout();
            return;
        }
    }

    const logout = async () => {
        setIsAuthenticated(false);
        setToken(null);
    }

    const handleLogin = (token: string) => {
        setIsAuthenticated(true);
        setToken(token);
    }

    useEffect(() => {
        getUser();
    }, [token])

    useLayoutEffect(() => {
        const authInterceptor = privateAPI.interceptors.request.use((config) => {
            config.headers.Authorization = !config._retry && token ? `Bearer ${token}` : config.headers.Authorization;

            return config;
        });

        return () => {
            privateAPI.interceptors.request.eject(authInterceptor);
        }
    }, [token]);

    useLayoutEffect(() => {
        const refreshInterceptor = privateAPI.interceptors.response.use(
            (response) => response,
            
            async (error) => {
                const originalRequest = error.config;

                if (error.response.status === 401 && error.response.data.message === 'Token has expired') {
                    try {
                        const response = await refreshToken();
                        handleLogin(response.data.access_token);
                        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                        originalRequest._retry = true;

                        return privateAPI(originalRequest);
                    } catch (error: any) {
                        const errorMessage = error.response?.data?.detail || 'An error occurred';
                        console.log(errorMessage);
                        logout();
                    }
                }

                return Promise.reject(error);
            }
    )

    return () => {
        privateAPI.interceptors.response.eject(refreshInterceptor)
    }
    }, [])

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, token, handleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    )
}