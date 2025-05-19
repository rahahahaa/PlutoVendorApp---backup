import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchNewBookings } from "../services/api";
import BookingCard from "../components/BookingCard";
import Sidebar from "../screens/Sidebar";
import { SidebarContext } from "../context/SidebarContext";
import { colors, fonts, spacing } from "../styles/theme";
import LoaderMomentum from "../components/LoaderMomentum";

export default function HomeScreen() {
    const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const responseData = await fetchNewBookings();
            setBookings(responseData);
        } catch (error) {
            console.error("Error fetching bookings:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-refresh every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshing(true);
            fetchData().then(() => setRefreshing(false));
        }, 60000); // 60000 ms = 60 seconds

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <LoaderMomentum />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Sidebar />
            <View style={styles.content}>
                <View style={styles.headerBox}>
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Ionicons name="menu" size={28} color={colors.primary} />
                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require("../assets/Pluto.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>Pluto Vendor App</Text>
                    </View>
                    <View style={styles.profileContainer}></View>
                </View>
                {bookings.length === 0 ? (
                    <Text style={styles.emptyMessage}>No bookings found.</Text>
                ) : (
                    <FlatList
                        data={bookings}
                        keyExtractor={(item, index) => item._id || item.id || index.toString()}
                        renderItem={({ item }) => <BookingCard booking={item} />}
                        ListEmptyComponent={<Text style={styles.emptyMessage}>No bookings available.</Text>}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={async () => {
                                setRefreshing(true);
                                await fetchData();
                                setRefreshing(false);
                            }} />
                        }
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: spacing.large,
    },
    headerBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.medium,
        paddingVertical: spacing.small,
        backgroundColor: colors.cardBackground,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.large,
    },
    toggleButton: {
        marginRight: spacing.medium,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    logo: {
        width: 40,
        borderRadius: 10,
        height: 40,
        marginRight: spacing.small,
    },
    title: {
        fontSize: fonts.sizeXLarge,
        fontWeight: "bold",
        color: colors.textPrimary,
        fontFamily: fonts.medium,
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    emptyMessage: {
        textAlign: "center",
        marginTop: spacing.medium,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
