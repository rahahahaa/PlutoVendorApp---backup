import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { colors, fonts, spacing } from "../styles/theme";
import { AuthContext } from "../context/AuthContext";
import BookingCard from "../components/BookingCard";
import { fetchNewBookings } from "../services/api";

export default function NewBookings() {
  const { userToken } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchNewBookings(userToken);
      // Filter bookings within last 24 hours
      const now = new Date();
      const filtered = data.filter((booking) => {
        if (!booking.createdAt) return false;
        const createdAt = new Date(booking.createdAt);
        const diffHours = (now - createdAt) / (1000 * 60 * 60);
        return diffHours <= 24;
      });
      setBookings(filtered);
    } catch (error) {
      console.error("Failed to fetch new bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

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
        <Text style={styles.loadingText}>Loading new bookings...</Text>
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No new bookings available.</Text>
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
