import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { colors, fonts, spacing } from "../styles/theme";
import { AuthContext } from "../context/AuthContext";
import BookingCard from "../components/BookingCard";
import { fetchBookingsByStates } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

export default function PendingBookings() {
  const { userToken } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchBookingsByStates([], userToken);
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const pending = data.filter((booking) => {
        const createdAt = new Date(booking.createdAt);
        // Include only bookings with bookingStatus 'unresponded' or 'pending' and exclude 'accepted'
        return (
          (booking.bookingStatus === "unresponded" || booking.bookingStatus === "pending") &&
          createdAt >= twentyFourHoursAgo
        );
      });
      setBookings(pending);
    } catch (error) {
      console.error("Failed to fetch pending bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadBookings();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <BookingCard
      booking={item}
      onAccept={loadBookings}
      onReject={loadBookings}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading pending bookings...</Text>
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No pending bookings available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.medium,
    color: colors.textSecondary,
    fontSize: fonts.sizeRegular,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fonts.sizeRegular,
  },
  listContainer: {
    padding: spacing.medium,
    backgroundColor: colors.background,
  },
});
