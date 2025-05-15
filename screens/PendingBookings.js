import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Text, Image, StyleSheet } from "react-native";
import { fetchNewBookings } from "../services/api";
import BookingCard from "../components/BookingCard";
import { colors, fonts, spacing } from "../styles/themeColors";

export default function PendingBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
const fetchData = async () => {
    try {
        const token = "your-hardcoded-token"; // Replace with dynamic token later
        const responseData = await fetchNewBookings(token);
        setBookings(responseData);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};

        fetchData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color={colors.primary} />;
    }

    if (bookings.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Image
                    source={require("../assets/empty-bookings.png")}
                    style={styles.emptyImage}
                    resizeMode="contain"
                />
                <Text style={styles.emptyText}>No bookings available at the moment.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id || item._id}
                renderItem={({ item }) => <BookingCard booking={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.large,
        backgroundColor: colors.background,
    },
    emptyImage: {
        width: 200,
        height: 200,
        marginBottom: spacing.medium,
    },
    emptyText: {
        fontSize: fonts.sizeLarge,
        color: colors.textSecondary,
        fontFamily: fonts.medium,
        textAlign: "center",
    },
});
