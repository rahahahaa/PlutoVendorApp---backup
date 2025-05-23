import React, { useEffect, useRef } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Animated, 
    Dimensions, 
    TouchableWithoutFeedback, 
    Platform,
    StatusBar
} from "react-native";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { SidebarContext } from "../context/SidebarContext";
import { AuthContext } from "../context/AuthContext";
import { colors, fonts, spacing } from "../styles/theme";

const screenWidth = Dimensions.get('window').width;
const SIDEBAR_WIDTH = screenWidth * 0.7; // 70% of screen width

export default function Sidebar() {
    const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();
    
    // Animation values
    const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        if (isSidebarOpen) {
            // Animate sidebar in
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.5,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            // Animate sidebar out
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -SIDEBAR_WIDTH,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isSidebarOpen]);
    
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        closeSidebar();
        logout();
        navigation.navigate("Login");
    };
    
    const handleNavigation = (screenName) => {
        closeSidebar();
        navigation.navigate(screenName);
    };
    
    if (!isSidebarOpen) return null; // Don't render anything if sidebar is closed
    
    // Calculate the status bar height for proper positioning on different devices
    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;
    
    return (
        <View style={styles.container}>
            {/* Semi-transparent overlay to close sidebar when clicked */}
            <TouchableWithoutFeedback onPress={closeSidebar}>
                <Animated.View 
                    style={[
                        styles.overlay,
                        { opacity: opacityAnim }
                    ]}
                />
            </TouchableWithoutFeedback>
            
            {/* Sidebar content */}
            <Animated.View 
                style={[
                    styles.sidebar,
                    { 
                        width: SIDEBAR_WIDTH,
                        transform: [{ translateX: slideAnim }],
                        paddingTop: Platform.OS === 'ios' ? STATUSBAR_HEIGHT + spacing.large : spacing.large
                    }
                ]}
            >
                {/* Header section */}
                <View style={styles.header}>
                    <View style={styles.profile}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={32} color={colors.cardBackground} />
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>User Name</Text>
                            <Text style={styles.userRole}>Admin</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closeSidebar}
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    >
                        <Ionicons name="close" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.divider} />
                
                {/* Navigation Menu */}
                <ScrollView>
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => handleNavigation('Profile')}
                    >
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="person" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.menuText}>Profile</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => handleNavigation('NewBookings')}
                    >
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="book" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.menuText}>New Bookings</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => handleNavigation('PendingBookings')}
                    >
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="time" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.menuText}>Pending Bookings</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => handleNavigation('CompletedBookings')}
                    >
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        </View>
                        <Text style={styles.menuText}>Completed Bookings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => handleNavigation('BalanceSheet')}
                    >
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="document-text" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.menuText}>Balance Sheet</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => handleNavigation('Settings')}
                    >
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="settings" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.menuText}>Settings</Text>
                    </TouchableOpacity>
                </ScrollView>
                
                {/* Bottom section with logout */}
                <View style={styles.bottomSection}>
                    <View style={styles.divider} />
                    
                    <TouchableOpacity 
                        style={styles.logoutButton} 
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out" size={20} color={colors.danger} />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    sidebar: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        backgroundColor: colors.cardBackground,
        zIndex: 1001,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.medium,
        paddingBottom: spacing.medium,
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        marginLeft: spacing.small,
    },
    userName: {
        fontSize: fonts.sizeMedium,
        fontWeight: "600",
        color: colors.textPrimary,
        fontFamily: fonts.medium,
    },
    userRole: {
        fontSize: fonts.sizeSmall,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
    },
    closeButton: {
        padding: spacing.tiny,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.small,
        marginHorizontal: spacing.medium,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.medium,
        paddingHorizontal: spacing.medium,
        borderRadius: 8,
        marginHorizontal: spacing.small,
        marginBottom: spacing.tiny,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: `${colors.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.small,
    },
    menuText: {
        fontSize: fonts.sizeMedium,
        color: colors.textPrimary,
        fontFamily: fonts.regular,
    },
    bottomSection: {
        marginBottom: spacing.large,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.medium,
        paddingHorizontal: spacing.large,
        marginHorizontal: spacing.medium,
        borderRadius: 8,
        backgroundColor: `${colors.danger}15`,
    },
    logoutText: {
        fontSize: fonts.sizeMedium,
        color: colors.danger,
        marginLeft: spacing.small,
        fontFamily: fonts.medium,
    },
    ScrollView: {
        flex: 1,
    }
});
