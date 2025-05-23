import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

// Indian states list for checkboxes
const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Puducherry"
];

// Vehicle component for edit mode
const VehicleItem = ({ item, index, onUpdate, onRemove }) => (
    <View style={styles.vehicleItem}>
        <View style={styles.vehicleItemHeader}>
        {console.log(item)}
            <Text style={styles.vehicleItemTitle}>Vehicle {index + 1}</Text>
            <TouchableOpacity onPress={() => onRemove(index)} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={22} color="#ff3b30" />
            </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Type/Model</Text>
            <TextInput
                style={styles.input}
                placeholder="E.g., Toyota Innova"
                value={item.vehicleName}
                onChangeText={(value) => onUpdate(index, "vehicleName", value)}
            />
        </View>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Registration Certificate (RC) Number</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter RC number"
                value={item.RC || ""}
                onChangeText={(value) => onUpdate(index, "RC", value)}
                autoCapitalize="characters"
            />
        </View>
    </View>
);

// Display vehicle in view mode
const VehicleDisplayItem = ({ item, index }) => (
    <View style={styles.vehicleDisplayItem} key={index}>
        <View style={styles.vehicleIconContainer}>
            <FontAwesome5 name="truck" size={24} color="#007bff" />
        </View>
        <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleDisplayTitle}>{item.vehicleName}</Text>
            <Text style={styles.vehicleDisplaySubtitle}>RC: {item.rcNumber}</Text>
        </View>
    </View>
);

// State checkbox component
const StateCheckbox = ({ state, selected, onToggle }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={() => onToggle(state)}>
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
            {selected && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
        <Text style={styles.checkboxLabel}>{state}</Text>
    </TouchableOpacity>
);

// State chip display component
const StateChip = ({ state }) => (
    <View style={styles.stateChip}>
        <Text style={styles.stateChipText}>{state}</Text>
    </View>
);

export default function Profile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        drivingLicense: "",
        vehicles: [{ vehicleName: "", RC: "" }],
        selectedStates: [],
        profileComplete: false,
        lastUpdated: null
    });
console.log(profile)
    const { userProfile, updateProfile, userToken } = useContext(AuthContext);
    const navigation = useNavigation();
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [stateSearchQuery, setStateSearchQuery] = useState("");

    // JWT decoder helper
    const decodeJwt = (token) => {
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("JWT decode failed", e);
            return null;
        }
    };

    // Load saved profile or fallback to AuthContext
    useFocusEffect(
        React.useCallback(() => {
            loadProfile();
        }, [])
    );

    const loadProfile = async () => {
        setFetchingProfile(true);
        try {
            const profileString = await AsyncStorage.getItem("userProfile");

            if (profileString) {
                const loadedProfile = JSON.parse(profileString);
                setProfile(loadedProfile);
                setIsEditMode(!loadedProfile.profileComplete);
            } else if (userProfile) {
                setProfile({
                    name: userProfile.name || "",
                    email: userProfile.email || "",
                    phone: userProfile.phone || "",
                    drivingLicense: userProfile.drivingLicense || "",
                    vehicles: userProfile.vehicles?.length > 0 ? userProfile.vehicles.map(v => ({
                        vehicleName: v.vehicleName || "",
                        rcNumber: v.RC || ""
                    })) : [{ vehicleName: "", rcNumber: "" }],
                    selectedStates: userProfile.selectedStates || [],
                    profileComplete: true,
                    lastUpdated: new Date().toISOString()
                });
                setIsEditMode(false);
            } else {
                setIsEditMode(true);
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
            setIsEditMode(true);
        } finally {
            setFetchingProfile(false);
        }
    };

    // Save profile locally
    const saveProfile = async (updatedProfile) => {
        try {
            const completeProfile = {
                ...updatedProfile,
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                drivingLicense: profile.drivingLicense,
                vehicles: profile.vehicles,
                selectedStates: profile.selectedStates,
                profileComplete: true,
                lastUpdated: new Date().toISOString()
            };

            await AsyncStorage.setItem("userProfile", JSON.stringify(completeProfile));
            return completeProfile;
        } catch (error) {
            console.error("Failed to save profile:", error);
            throw error;
        }
    };

    const handleAddVehicle = () => {
        setProfile(prev => ({
            ...prev,
            vehicles: [...prev.vehicles, { vehicleName: "", RC: "" }]
        }));
    };

    const handleUpdateVehicle = (index, field, value) => {
        const updatedVehicles = [...profile.vehicles];
        updatedVehicles[index][field] = value;
        setProfile(prev => ({
            ...prev,
            vehicles: updatedVehicles
        }));
        if (errors.vehicles) {
            setErrors((prev) => ({ ...prev, vehicles: null }));
        }
    };

    const handleRemoveVehicle = (index) => {
        if (profile.vehicles.length === 1) {
            setProfile(prev => ({
                ...prev,
                vehicles: [{ vehicleName: "", RC: "" }]
            }));
        } else {
            const updatedVehicles = profile.vehicles.filter((_, i) => i !== index);
            setProfile(prev => ({
                ...prev,
                vehicles: updatedVehicles
            }));
        }
    };

    const toggleState = (state) => {
        setProfile(prev => {
            const updatedStates = (prev.selectedStates || []).includes(state)
                ? prev.selectedStates.filter(s => s !== state)
                : [...prev.selectedStates, state];
            return {
                ...prev,
                selectedStates: updatedStates
            };
        });
        if (errors.states) {
            setErrors((prev) => ({ ...prev, states: null }));
        }
    };

    const filteredStates = (INDIAN_STATES || []).filter((state) =>
        state.toLowerCase().includes(stateSearchQuery.toLowerCase())
    );

    const validateForm = () => {
        const newErrors = {};

        if (!profile.name?.trim()) newErrors.name = "Name is required";
        if (!profile.email?.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(profile.email)) newErrors.email = "Email is invalid";
        if (!profile.phone?.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(profile.phone)) newErrors.phone = "Phone must be 10 digits";
        if (!profile.drivingLicense.trim()) newErrors.drivingLicense = "Driving license is required";

        const hasValidVehicle = profile.vehicles.some(
            (vehicle) => vehicle.vehicleName.trim() && vehicle.RC?.trim()
        );
        if (!hasValidVehicle) newErrors.vehicles = "At least one valid vehicle is required";

        if (profile.selectedStates.length === 0) newErrors.states = "Select at least one state";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        const finalProfile = {
            name: profile.name,
            email: profile.email,
            mobile: profile.phone,
            drivingLicense: profile.drivingLicense,
            vehicles: profile.vehicles,
            states: profile.selectedStates,
            profileComplete: true
        };

        const savedProfile = await saveProfile(finalProfile);
        setProfile(savedProfile);
        await handleUpdateProfileToBackend();
    };

    const handleUpdateProfileToBackend = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            // Get token
            let tokenToSend = userToken || await AsyncStorage.getItem("token");
            if (!tokenToSend) {
                throw new Error("Authentication token not found. Please log in again.");
            }

            // Decode token to get ID
            const decoded = decodeJwt(tokenToSend);
            if (!decoded?.id) {
                throw new Error("Failed to decode token or missing id");
            }

            // Build payload that matches backend expectations
            const updatedProfileData = {
                id: decoded.id, // Add id here
                name: profile.name.trim(),
                email: profile.email.trim(),
                mobile: profile.phone.trim(), // 👈 Use mobile instead of phone
                drivingLicense: profile.drivingLicense.trim(),

                vehicles: profile.vehicles.map(vehicle => ({
                    RC: vehicle.RC?.trim() || "",
                    vehicleName: vehicle.vehicleName?.trim() || ""
                })),

                states: profile.selectedStates.length > 0
                    ? profile.selectedStates
                    : ["default"]
            };

            console.log("Sending to backend:", updatedProfileData); // 👈 Critical debug line

            // Send to backend
            await updateProfile(updatedProfileData);

            // Update local state
            setProfile({
                ...profile,
                profileComplete: true,
                lastUpdated: new Date().toISOString()
            });

            setIsEditMode(false);
            Alert.alert("Success", "Your profile has been updated!", [{ text: "OK" }]);
        } catch (error) {
            console.error("Failed to update profile:", error.message);
            Alert.alert("Error", error.message || "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => setIsEditMode(true);

    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (fetchingProfile) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Loading profile data...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Driver Profile</Text>
                    {profile.profileComplete && !isEditMode && (
                        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                            <MaterialIcons name="edit" size={22} color="#007bff" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* View Mode */}
                {!isEditMode && profile.profileComplete && (
                    <View style={styles.profileViewContainer}>
                        {/* Avatar & Name */}
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {profile.drivingLicense.charAt(0).toUpperCase() || "D"}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.profileHeaderInfo}>
                                <Text style={styles.profileHeaderTitle}>Driver Information</Text>
                                <Text style={styles.updateInfo}>Last updated: {formatDate(profile.lastUpdated)}</Text>
                            </View>
                        </View>

                        {/* License Info */}
                        <View style={styles.profileInfoCard}>
                            <View style={styles.infoCardHeader}>
                                <MaterialIcons name="badge" size={24} color="#007bff" />
                                <Text style={styles.infoCardTitle}>License Information</Text>
                            </View>
                            <View style={styles.infoCardContent}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Name:</Text>
                                    <Text style={styles.infoValue}>{profile.name}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Email:</Text>
                                    <Text style={styles.infoValue}>{profile.email}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Phone:</Text>
                                    <Text style={styles.infoValue}>{profile.phone}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>License Number:</Text>
                                    <Text style={styles.infoValue}>{profile.drivingLicense}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Vehicles Info */}
                        <View style={styles.profileInfoCard}>
                            <View style={styles.infoCardHeader}>
                                <FontAwesome5 name="truck" size={20} color="#007bff" />
                                <Text style={styles.infoCardTitle}>Registered Vehicles</Text>
                            </View>
                            <View style={styles.infoCardContent}>
                                {profile.vehicles.map((v, i) => (
                                    <VehicleDisplayItem key={i} item={v} index={i} />
                                ))}
                            </View>
                        </View>

                        {/* States Info */}
                        <View style={styles.profileInfoCard}>
                            <View style={styles.infoCardHeader}>
                                <MaterialIcons name="location-on" size={24} color="#007bff" />
                                <Text style={styles.infoCardTitle}>Operating States</Text>
                            </View>
                            <View style={styles.infoCardContent}>
                                <View style={styles.statesChipContainer}>
                                    {profile.selectedStates.map((s) => (
                                        <StateChip key={s} state={s} />
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Edit Mode */}
                {isEditMode && (
                    <View style={styles.formContainer}>
                        {/* Personal Info Section */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Personal Information</Text>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={[styles.input, errors.name && styles.inputError]}
                                    placeholder="Enter your full name"
                                    value={profile.name}
                                    onChangeText={(value) => {
                                        setProfile(p => ({ ...p, name: value }));
                                        if (errors.name) setErrors(e => ({ ...e, name: null }));
                                    }}
                                    autoCapitalize="words"
                                />
                                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <TextInput
                                    style={[styles.input, errors.email && styles.inputError]}
                                    placeholder="Enter your email address"
                                    keyboardType="email-address"
                                    value={profile.email}
                                    onChangeText={(value) => {
                                        setProfile(p => ({ ...p, email: value }));
                                        if (errors.email) setErrors(e => ({ ...e, email: null }));
                                    }}
                                    autoCapitalize="none"
                                />
                                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Phone Number</Text>
                                <TextInput
                                    style={[styles.input, errors.phone && styles.inputError]}
                                    placeholder="Enter your phone number"
                                    keyboardType="phone-pad"
                                    value={profile.phone}
                                    onChangeText={(value) => {
                                        setProfile(p => ({ ...p, phone: value }));
                                        if (errors.phone) setErrors(e => ({ ...e, phone: null }));
                                    }}
                                />
                                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Driving License Number</Text>
                                <TextInput
                                    style={[styles.input, errors.drivingLicense && styles.inputError]}
                                    placeholder="Enter your driving license number"
                                    value={profile.drivingLicense}
                                    onChangeText={(value) => {
                                        setProfile(p => ({ ...p, drivingLicense: value }));
                                        if (errors.drivingLicense) setErrors(e => ({ ...e, drivingLicense: null }));
                                    }}
                                    autoCapitalize="characters"
                                />
                                {errors.drivingLicense && <Text style={styles.errorText}>{errors.drivingLicense}</Text>}
                            </View>
                        </View>

                        {/* Vehicles Section */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Registered Vehicles</Text>
                            {errors.vehicles && <Text style={styles.errorText}>{errors.vehicles}</Text>}
                            {profile.vehicles.map((v, i) => (
                                <VehicleItem
                                    key={i}
                                    item={v}
                                    index={i}
                                    onUpdate={handleUpdateVehicle}
                                    onRemove={handleRemoveVehicle}
                                />
                            ))}
                            <TouchableOpacity style={styles.addButton} onPress={handleAddVehicle}>
                                <Ionicons name="add-circle-outline" size={20} color="#007bff" />
                                <Text style={styles.addButtonText}>Add Another Vehicle</Text>
                            </TouchableOpacity>
                        </View>

                        {/* States Section */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>States Operating In</Text>
                            {errors.states && <Text style={styles.errorText}>{errors.states}</Text>}
                            <View style={styles.searchContainer}>
                                <Ionicons name="search-outline" size={20} color="#666" />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search states..."
                                    value={stateSearchQuery}
                                    onChangeText={setStateSearchQuery}
                                />
                            </View>
                            <View style={styles.statesWrapper}>
                                <ScrollView contentContainerStyle={styles.statesContainer}>
                                    {filteredStates.map((state) => (
                                        <StateCheckbox
                                            key={state}
                                            state={state}
                                            selected={profile.selectedStates.includes(state)}
                                            onToggle={toggleState}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        </View>

                        {/* Save Button */}
                        <TouchableOpacity
                            style={[styles.saveButton, loading && styles.disabledButton]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <View style={styles.loadingButtonContent}>
                                    <ActivityIndicator size="small" color="#fff" />
                                    <Text style={styles.saveButtonText}>Saving...</Text>
                                </View>
                            ) : (
                                <Text style={styles.saveButtonText}>Save Profile</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f5f5f5",
        padding: 20
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#888"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },
    backButton: {
        padding: 10
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#333"
    },
    editButton: {
        padding: 10
    },
    profileViewContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16
    },
    avatarContainer: {
        marginRight: 12
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#007bff",
        justifyContent: "center",
        alignItems: "center"
    },
    avatarText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold"
    },
    profileHeaderInfo: {},
    profileHeaderTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000"
    },
    updateInfo: {
        fontSize: 12,
        color: "#888"
    },
    profileInfoCard: {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 12,
        marginBottom: 16
    },
    infoCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8
    },
    infoCardTitle: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "600",
        color: "#333"
    },
    infoCardContent: {
        paddingLeft: 10
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 6
    },
    infoLabel: {
        fontWeight: "500",
        width: 120,
        color: "#666"
    },
    infoValue: {
        color: "#000"
    },
    vehicleDisplayItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    vehicleIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#e0f0ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },
    vehicleDetails: {},
    vehicleDisplayTitle: {
        fontSize: 16,
        fontWeight: "600"
    },
    vehicleDisplaySubtitle: {
        fontSize: 14,
        color: "#555"
    },
    formContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2
    },
    sectionContainer: {
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingBottom: 6,
        color: "#333"
    },
    inputGroup: {
        marginBottom: 16
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        color: "#555"
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: "#fff"
    },
    inputError: {
        borderColor: "#ff3b30"
    },
    errorText: {
        color: "#ff3b30",
        fontSize: 12,
        marginTop: 4
    },
    vehicleItem: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#f9f9f9",
        marginBottom: 16
    },
    vehicleItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
    },
    vehicleItemTitle: {
        fontSize: 16,
        fontWeight: "600"
    },
    removeButton: {
        padding: 6
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        marginTop: 8,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#ccc"
    },
    addButtonText: {
        marginLeft: 8,
        color: "#007bff",
        fontWeight: "500"
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        backgroundColor: "#fff"
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        marginLeft: 10,
        fontSize: 14,
        color: "#333"
    },
    statesWrapper: {
        maxHeight: 250,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 8,
        backgroundColor: "#fff"
    },
    statesContainer: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "50%",
        marginBottom: 12
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#007bff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },
    checkboxSelected: {
        backgroundColor: "#007bff"
    },
    checkboxLabel: {
        fontSize: 14,
        color: "#333"
    },
    saveButton: {
        backgroundColor: "#007bff",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    disabledButton: {
        opacity: 0.6
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700"
    },
    loadingButtonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    }
});