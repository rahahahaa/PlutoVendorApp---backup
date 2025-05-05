import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing } from "../styles/theme";

export default function BookingCard({ booking }) {
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [elevation] = useState(new Animated.Value(1));

    const handleAccept = () => {
        console.log("Booking accepted:", booking.id);
        // Add API call to update status to "accepted"
    };

    const handleReject = () => {
        setRejectModalVisible(true);
    };

    const submitRejection = () => {
        console.log("Rejection reason:", rejectionReason);
        // Add API call to update status to "rejected" with reason
        setRejectModalVisible(false);
        setRejectionReason("");
    };

    const onPressIn = () => {
        Animated.timing(elevation, {
            toValue: 6,
            duration: 150,
            useNativeDriver: false,
        }).start();
    };

    const onPressOut = () => {
        Animated.timing(elevation, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
        }).start();
    };

    // Determine left border color based on booking status
    let statusColor = colors.primary; // blue for pending
    if (booking.status === "accepted") {
        statusColor = colors.success; // green
    } else if (booking.status === "rejected") {
        statusColor = colors.danger; // red
    }

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    borderLeftColor: statusColor,
                    elevation: elevation,
                    shadowOpacity: elevation.interpolate({
                        inputRange: [1, 6],
                        outputRange: [0.05, 0.15],
                    }),
                },
            ]}
        >
            {/* Booking ID */}
            <Text style={styles.bookingId}>Booking ID: {booking.id}</Text>

            <View style={styles.divider} />

            {/* Transfer Details */}
            {booking.transfer ? (
                <>
                    <Text style={styles.detail}>
                        Cab Name: {booking.transfer.details?.cabName || "N/A"}
                    </Text>
                    <Text style={styles.detail}>
                        Cab Type: {booking.transfer.details?.cabType || "N/A"}
                    </Text>
                    <Text style={styles.detail}>
                        Seats: {booking.transfer.details?.cabSeatingCapacity || "N/A"}
                    </Text>
                    <View style={styles.divider} />
                    <Text style={styles.price}>
                        Price: ₹{booking.transfer.totalCost || "N/A"}
                    </Text>
                </>
            ) : (
                <Text style={styles.noData}>No transfer details available.</Text>
            )}

            <View style={styles.divider} />

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={handleAccept}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    activeOpacity={0.8}
                >
                    <Ionicons name="checkmark" size={20} color={colors.cardBackground} />
                    <Text style={styles.acceptButtonText}> Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={handleReject}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    activeOpacity={0.8}
                >
                    <Ionicons name="close" size={20} color={colors.danger} />
                    <Text style={styles.rejectButtonText}> Reject</Text>
                </TouchableOpacity>
            </View>

            {/* Rejection Modal */}
            <Modal visible={rejectModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Why are you rejecting this booking?</Text>
                        <TextInput
                            style={styles.input}
                            value={rejectionReason}
                            onChangeText={setRejectionReason}
                            placeholder="Enter reason"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={submitRejection}>
                                <Text style={styles.modalButtonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRejectModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: spacing.medium,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        marginBottom: spacing.medium,
        backgroundColor: colors.cardBackground,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        shadowOpacity: 0.05,
        borderLeftWidth: 4,
    },
    bookingId: {
        fontSize: fonts.sizeSmall,
        fontWeight: "500",
        marginBottom: spacing.small,
        color: colors.textPrimary,
        fontFamily: fonts.monospace,
        lineHeight: 21,
        letterSpacing: 0.5,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.small,
    },
    detail: {
        fontSize: fonts.sizeMedium,
        color: colors.textSecondary,
        marginBottom: spacing.tiny,
        fontFamily: fonts.regular,
        lineHeight: 24,
        letterSpacing: 0.25,
    },
    price: {
        fontSize: fonts.sizeLarge,
        fontWeight: "bold",
        color: colors.primary,
        marginTop: spacing.small,
        fontFamily: fonts.medium,
        lineHeight: 28,
        letterSpacing: 0.5,
    },
    noData: {
        fontSize: fonts.sizeMedium,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: spacing.small,
        fontFamily: fonts.regular,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: spacing.medium,
    },
    acceptButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.small,
        paddingHorizontal: spacing.large,
        borderRadius: 8,
        backgroundColor: colors.primary, // fallback solid color
    },
    acceptButtonText: {
        color: colors.cardBackground,
        fontFamily: fonts.medium,
        fontSize: fonts.sizeMedium,
        marginLeft: 8,
    },
    rejectButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.small,
        paddingHorizontal: spacing.large,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.danger,
        backgroundColor: "transparent",
    },
    rejectButtonText: {
        color: colors.danger,
        fontFamily: fonts.medium,
        fontSize: fonts.sizeMedium,
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        padding: spacing.large,
        backgroundColor: colors.cardBackground,
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.small,
        marginTop: spacing.small,
        marginBottom: spacing.medium,
        borderRadius: 5,
        fontFamily: fonts.regular,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    modalButtonText: {
        color: colors.primary,
        fontWeight: "bold",
        fontFamily: fonts.medium,
        fontSize: fonts.sizeMedium,
    },
});
