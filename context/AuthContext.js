import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    setUserToken(token);
                }
            } catch (e) {
                console.error("Failed to load token", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (token) => {
        try {
            await AsyncStorage.setItem("token", token);
            setUserToken(token);
        } catch (e) {
            console.error("Failed to save token", e);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("token");
            setUserToken(null);
        } catch (e) {
            console.error("Failed to remove token", e);
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
