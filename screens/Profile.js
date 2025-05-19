import React, { useState, useEffect } from "react";
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
    Image,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

// List of Indian states for checkboxes
const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Puducherry"
];

// Component for vehicle item in edit mode
const VehicleItem = ({ item, index, onUpdate, onRemove }) => {
    return (
        <View style={styles.vehicleItem}>
            <View style={styles.vehicleItemHeader}>
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
                    value={item.rcNumber}
                    onChangeText={(value) => onUpdate(index, "rcNumber", value)}
                    autoCapitalize="characters"
                />
            </View>
        </View>
    );
};

// Component for vehicle display in view mode
const VehicleDisplayItem = ({ item, index }) => {
    return (
        <View style={styles.vehicleDisplayItem}>
            <View style={styles.vehicleIconContainer}>
                <FontAwesome5 name="truck" size={24} color="#007bff" />
            </View>
            <View style={styles.vehicleDetails}>
                <Text style={styles.vehicleDisplayTitle}>{item.vehicleName}</Text>
                <Text style={styles.vehicleDisplaySubtitle}>RC: {item.rcNumber}</Text>
            </View>
        </View>
    );
};

// Component for state checkbox in edit mode
const StateCheckbox = ({ state, selected, onToggle }) => {
    return (
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => onToggle(state)}>
            <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                {selected && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>{state}</Text>
        </TouchableOpacity>
    );
};

// Component for state display in view mode
const StateChip = ({ state }) => {
    return (
        <View style={styles.stateChip}>
            <Text style={styles.stateChipText}>{state}</Text>
        </View>
    );
};

export default function Profile() {
    const [profile, setProfile] = useState({
        drivingLicense: "",
        vehicles: [{ vehicleName: "", rcNumber: "" }],
        selectedStates: [],
        profileComplete: false,
        lastUpdated: null
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [stateSearchQuery, setStateSearchQuery] = useState("");

    const navigation = useNavigation();

    // Load profile data when component mounts or when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadProfile();
        }, [])
    );

    const loadProfile = async () => {
        setFetchingProfile(true);
        try {
            const profileString = await AsyncStorage.getItem('userProfile');
            if (profileString) {
                const loadedProfile = JSON.parse(profileString);
                setProfile({
                    drivingLicense: loadedProfile.drivingLicense || "",
                    vehicles: loadedProfile.vehicles && loadedProfile.vehicles.length > 0
                        ? loadedProfile.vehicles
                        : [{ vehicleName: "", rcNumber: "" }],
                    selectedStates: loadedProfile.selectedStates || [],
                    profileComplete: loadedProfile.profileComplete || false,
                    lastUpdated: loadedProfile.lastUpdated || null
                });

                // If profile is not complete, automatically go to edit mode
                setIsEditMode(!loadedProfile.profileComplete);
            } else {
                // No profile found, go to edit mode by default
                setIsEditMode(true);
            }
        } catch (error) {
            console.error("Failed to load profile from local storage:", error);
            setIsEditMode(true);
        } finally {
            setFetchingProfile(false);
        }
    };

    const saveProfile = async (updatedProfile) => {
        try {
            const completeProfile = {
                ...updatedProfile,
                profileComplete: true,
                lastUpdated: new Date().toISOString()
            };
            await AsyncStorage.setItem('userProfile', JSON.stringify(completeProfile));
            return completeProfile;
        } catch (error) {
            console.error("Failed to save profile to local storage:", error);
            throw error;
        }
    };

    const handleAddVehicle = () => {
        setProfile(prev => ({
            ...prev,
            vehicles: [...prev.vehicles, { vehicleName: "", rcNumber: "" }]
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
                vehicles: [{ vehicleName: "", rcNumber: "" }]
            }));
            return;
        }

        const updatedVehicles = profile.vehicles.filter((_, i) => i !== index);
        setProfile(prev => ({
            ...prev,
            vehicles: updatedVehicles
        }));
    };

    const toggleState = (state) => {
        setProfile(prev => {
            const updatedStates = prev.selectedStates.includes(state)
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

    const filteredStates = INDIAN_STATES.filter((state) =>
        state.toLowerCase().includes(stateSearchQuery.toLowerCase())
    );

    const validateForm = () => {
        const newErrors = {};
        if (!profile.drivingLicense.trim())
            newErrors.drivingLicense = "Driving license is required";

        const hasValidVehicle = profile.vehicles.some(
            (vehicle) => vehicle.vehicleName.trim() && vehicle.rcNumber.trim()
        );

        if (!hasValidVehicle)
            newErrors.vehicles = "At least one vehicle with RC number is required";

        if (profile.selectedStates.length === 0)
            newErrors.states = "At least one state is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        setLoading(true);

        try {
            const savedProfile = await saveProfile(profile);
            setProfile(savedProfile);
            setIsEditMode(false);
            Alert.alert(
                "Success",
                "Your profile has been saved. You can edit it anytime.",
                [{ text: "OK" }]
            );
        } catch (error) {
            Alert.alert("Error", "Failed to save profile locally.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
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

                {/* VIEW MODE */}
                {!isEditMode && profile.profileComplete && (
                    <View style={styles.profileViewContainer}>
                        {/* Profile Header with Avatar */}
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {profile.drivingLicense ? profile.drivingLicense.charAt(0).toUpperCase() : "D"}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.profileHeaderInfo}>
                                <Text style={styles.profileHeaderTitle}>Driver Information</Text>
                                <Text style={styles.updateInfo}>Last updated: {formatDate(profile.lastUpdated)}</Text>
                            </View>
                        </View>

                        {/* License Information */}
                        <View style={styles.profileInfoCard}>
                            <View style={styles.infoCardHeader}>
                                <MaterialIcons name="badge" size={24} color="#007bff" />
                                <Text style={styles.infoCardTitle}>License Information</Text>
                            </View>
                            <View style={styles.infoCardContent}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>License Number:</Text>
                                    <Text style={styles.infoValue}>{profile.drivingLicense}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Vehicles Information */}
                        <View style={styles.profileInfoCard}>
                            <View style={styles.infoCardHeader}>
                                <FontAwesome5 name="truck" size={20} color="#007bff" />
                                <Text style={styles.infoCardTitle}>Registered Vehicles</Text>
                            </View>
                            <View style={styles.infoCardContent}>
                                {profile.vehicles.map((vehicle, index) => (
                                    <VehicleDisplayItem
                                        key={index}
                                        item={vehicle}
                                        index={index}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* States Information */}
                        <View style={styles.profileInfoCard}>
                            <View style={styles.infoCardHeader}>
                                <MaterialIcons name="location-on" size={24} color="#007bff" />
                                <Text style={styles.infoCardTitle}>Operating States</Text>
                            </View>
                            <View style={styles.infoCardContent}>
                                <View style={styles.statesChipContainer}>
                                    {profile.selectedStates.map((state) => (
                                        <StateChip key={state} state={state} />
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* EDIT MODE */}
                {isEditMode && (
                    <View style={styles.formContainer}>
                        {/* Driving License */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Personal Information</Text>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Driving License Number</Text>
                                <TextInput
                                    style={[styles.input, errors.drivingLicense && styles.inputError]}
                                    placeholder="Enter your driving license number"
                                    value={profile.drivingLicense}
                                    onChangeText={(value) => {
                                        setProfile(prev => ({ ...prev, drivingLicense: value }));
                                        if (errors.drivingLicense) {
                                            setErrors((prev) => ({ ...prev, drivingLicense: null }));
                                        }
                                    }}
                                    autoCapitalize="characters"
                                />
                                {errors.drivingLicense && (
                                    <Text style={styles.errorText}>{errors.drivingLicense}</Text>
                                )}
                            </View>
                        </View>

                        {/* Vehicles Section */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Registered Vehicles</Text>
                            {errors.vehicles && (
                                <Text style={styles.errorText}>{errors.vehicles}</Text>
                            )}
                            {profile.vehicles.map((vehicle, index) => (
                                <VehicleItem
                                    key={index}
                                    item={vehicle}
                                    index={index}
                                    onUpdate={handleUpdateVehicle}
                                    onRemove={handleRemoveVehicle}
                                />
                            ))}
                            <TouchableOpacity style={styles.addButton} onPress={handleAddVehicle}>
                                <Ionicons name="add-circle-outline" size={20} color="#007bff" />
                                <Text style={styles.addButtonText}>Add Another Vehicle</Text>
                            </TouchableOpacity>
                        </View>

                        {/* States Section - Scrollable */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>States Operating In</Text>
                            {errors.states && (
                                <Text style={styles.errorText}>{errors.states}</Text>
                            )}
                            <View style={styles.searchContainer}>
                                <Ionicons name="search-outline" size={20} color="#666" />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search states..."
                                    value={stateSearchQuery}
                                    onChangeText={setStateSearchQuery}
                                />
                            </View>

                            {/* Scrollable Container */}
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
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#888",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#333",
    },
    editButton: {
        padding: 10,
    },
    profileViewContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#007bff",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    profileHeaderInfo: {},
    profileHeaderTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
    },
    updateInfo: {
        fontSize: 12,
        color: "#888",
    },
    profileInfoCard: {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    infoCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    infoCardTitle: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    infoCardContent: {
        paddingLeft: 10,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 6,
    },
    infoLabel: {
        fontWeight: "500",
        width: 120,
        color: "#666",
    },
    infoValue: {
        color: "#000",
    },
    vehicleDisplayItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    vehicleIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#e0f0ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    vehicleDetails: {},
    vehicleDisplayTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    vehicleDisplaySubtitle: {
        fontSize: 14,
        color: "#555",
    },
    statesChipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    stateChip: {
        backgroundColor: "#e0f0ff",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    stateChipText: {
        color: "#007bff",
        fontSize: 14,
    },
    formContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingBottom: 6,
        color: "#333",
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        color: "#555",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    inputError: {
        borderColor: "#ff3b30",
    },
    errorText: {
        color: "#ff3b30",
        fontSize: 12,
        marginTop: 4,
    },
    helperText: {
        color: "#888",
        fontSize: 12,
        marginTop: 4,
    },
    vehicleItem: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#f9f9f9",
        marginBottom: 16,
    },
    vehicleItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    vehicleItemTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    removeButton: {
        padding: 6,
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
        borderColor: "#ccc",
    },
    addButtonText: {
        marginLeft: 8,
        color: "#007bff",
        fontWeight: "500",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        backgroundColor: "#fff",
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        marginLeft: 10,
        fontSize: 14,
        color: "#333",
    },
    statesWrapper: {
        maxHeight: 250,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 8,
        backgroundColor: "#fff",
    },
    statesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "50%",
        marginBottom: 12,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#007bff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    checkboxSelected: {
        backgroundColor: "#007bff",
    },
    checkboxLabel: {
        fontSize: 14,
        color: "#333",
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
        elevation: 2,
    },
    disabledButton: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    loadingButtonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
});

