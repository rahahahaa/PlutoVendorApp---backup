import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { colors, fonts, spacing } from "../styles/theme";

export default function Sidebar() {
    const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);

    if (!isSidebarOpen) return null; // Hide sidebar if closed

    return (
        <View style={styles.sidebar}>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsSidebarOpen(false)}
            >
                <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="book" size={20} color={colors.primary} />
                <Text style={styles.menuText}> New Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="time" size={20} color={colors.primary} />
                <Text style={styles.menuText}> Pending Bookings</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: 260,
        backgroundColor: colors.cardBackground,
        padding: spacing.large,
        zIndex: 1000,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        borderRightWidth: 1,
        borderRightColor: colors.border,
    },
    closeButton: {
        alignSelf: "flex-end",
        marginBottom: spacing.large,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuText: {
        fontSize: fonts.sizeMedium,
        fontWeight: "bold",
        color: colors.textPrimary,
        marginLeft: spacing.small,
        fontFamily: fonts.medium,
    },
});
