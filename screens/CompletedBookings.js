import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { colors, fonts, spacing } from "../styles/theme";
import { AuthContext } from "../context/AuthContext";
import BookingCard from "../components/BookingCard";
import { fetchBookingsByStates } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

export default function CompletedBookings() {
  const { userToken } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter bookings with status 'completed'
  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchBookingsByStates([], userToken);
      const completed = data.filter((booking) => booking.status === "completed");
      setBookings(completed);
    } catch (error) {
      console.error("Failed to fetch completed bookings:", error);
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

  const renderItem = ({ item }) => <BookingCard booking={item} />;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading completed bookings...</Text>
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No completed bookings available.</Text>
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
