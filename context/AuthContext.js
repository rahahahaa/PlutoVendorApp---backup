import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateCabUser } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTokenAndProfile = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const profileString = await AsyncStorage.getItem("userProfile");
                if (token) {
                    setUserToken(token);
                }
                if (profileString) {
                    setUserProfile(JSON.parse(profileString));
                }
            } catch (e) {
                console.error("Failed to load token or profile", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadTokenAndProfile();
    }, []);

    const login = async (token, userData = null) => {
        try {
            await AsyncStorage.setItem("token", token);
            setUserToken(token);

            if (userData) {
                const profileData = {
                    id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone || userData.mobile,
                    drivingLicense: userData.drivingLicense || "",
                    vehicles: (userData.vehicles || []).map(v => ({
                        vehicleName: v.vehicleName || "",
                        rcNumber: v.RC || ""
                    })),
                    selectedStates: userData.states || [],
                    profileComplete: true,
                    lastUpdated: new Date().toISOString()
                };

                await AsyncStorage.setItem("userProfile", JSON.stringify(profileData));
                setUserProfile(profileData);
            } else {
                const storedProfileString = await AsyncStorage.getItem("userProfile");
                if (storedProfileString) {
                    const storedProfile = JSON.parse(storedProfileString);
                    setUserProfile(storedProfile);
                }
            }
        } catch (e) {
            console.error("Failed to save token or profile", e);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("userProfile");
            setUserToken(null);
            setUserProfile(null);
        } catch (e) {
            console.error("Failed to remove token or profile", e);
        }
    };

    const updateProfile = async (updatedProfile) => {
        if (!userToken || !updatedProfile || !updatedProfile.id) {
            throw new Error("Missing token or profile id for update");
        }

        console.log("Sending to backend:", updatedProfile);

        try {
            const response = await updateCabUser(updatedProfile.id, updatedProfile, userToken);

            console.log("Backend response:", response);

            if (response && response.data?.user) {
                const backendData = response.data.user;

                // Ensure required fields exist
                const completeProfile = {
                    name: backendData.name,
                    email: backendData.email,
                    phone: backendData.mobile,
                    drivingLicense: backendData.drivingLicense,
                    vehicles: backendData.vehicles || [],
                    selectedStates: backendData.states || [],
                    profileComplete: true,
                    lastUpdated: new Date().toISOString()
                };

                console.log("Saving complete profile:", completeProfile);

                // Save updated profile to AsyncStorage
                await AsyncStorage.setItem("userProfile", JSON.stringify(completeProfile));
                setUserProfile(completeProfile);
                return completeProfile;
            } else {
                throw new Error("Invalid response from update API");
            }
        } catch (error) {
            console.error("Failed to update profile", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, userProfile, isLoading, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
