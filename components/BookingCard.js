import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Animated, ScrollView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing } from "../styles/theme";

export default function BookingCard({ booking }) {
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [elevation] = useState(new Animated.Value(1));
    const [userDetailsExpanded, setUserDetailsExpanded] = useState(true);
    const [cabDetailsExpanded, setCabDetailsExpanded] = useState(false);
    const [itineraryExpanded, setItineraryExpanded] = useState(false);

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

    // Get lead user information (assuming it's in booking.transfer.selectedLead or first hotel's selectedLead)
    const getUserInfo = () => {
        if (booking.transfer && booking.transfer.selectedLead) {
            return booking.transfer.selectedLead;
        } else if (booking.hotels && booking.hotels.length > 0 && booking.hotels[0].selectedLead) {
            return booking.hotels[0].selectedLead;
        }
        return null;
    };

    const userInfo = getUserInfo();

    const toggleSection = (section) => {
        if (section === 'user') {
            setUserDetailsExpanded(!userDetailsExpanded);
        } else if (section === 'cab') {
            setCabDetailsExpanded(!cabDetailsExpanded);
        } else if (section === 'itinerary') {
            setItineraryExpanded(!itineraryExpanded);
        }
    };

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
            {/* Booking Header */}
            <View style={styles.headerContainer}>
                <View style={styles.bookingIdContainer}>
                    <Text style={styles.bookingLabel}>Booking ID</Text>
                    <Text style={styles.bookingId}>{booking.id}</Text>
                </View>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "Pending"}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* User Details Section */}
            <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection('user')}
                activeOpacity={0.7}
            >
                <View style={styles.sectionTitleContainer}>
                    <Ionicons name="person" size={20} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Guest Information</Text>
                </View>
                <Ionicons
                    name={userDetailsExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textSecondary}
                />
            </TouchableOpacity>

            {userDetailsExpanded && userInfo && (
                <View style={styles.sectionContent}>
                    <View style={styles.userInfoRow}>
                        <View style={styles.userInfoItem}>
                            <Text style={styles.infoLabel}>Name</Text>
                            <Text style={styles.infoValue}>{userInfo.name || "N/A"}</Text>
                        </View>
                        <View style={styles.userInfoItem}>
                            <Text style={styles.infoLabel}>Phone</Text>
                            <Text style={styles.infoValue}>{userInfo.mobile || "N/A"}</Text>
                        </View>
                    </View>
                    <View style={styles.userInfoRow}>
                        <View style={styles.userInfoItem}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{userInfo.email || "N/A"}</Text>
                        </View>
                    </View>
                    <View style={styles.userInfoRow}>
                        <View style={styles.userInfoItem}>
                            <Text style={styles.infoLabel}>Adults</Text>
                            <Text style={styles.infoValue}>{userInfo.adults || "0"}</Text>
                        </View>
                        <View style={styles.userInfoItem}>
                            <Text style={styles.infoLabel}>Kids</Text>
                            <Text style={styles.infoValue}>{userInfo.kids || "0"}</Text>
                        </View>
                    </View>
                </View>
            )}

            {!userInfo && userDetailsExpanded && (
                <Text style={styles.noData}>No guest information available.</Text>
            )}

            <View style={styles.divider} />

            {/* Cab Details Section */}
            {booking.transfer && (
                <>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => toggleSection('cab')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.sectionTitleContainer}>
                            <Ionicons name="car" size={20} color={colors.primary} />
                            <Text style={styles.sectionTitle}>Transfer Details</Text>
                        </View>
                        <Ionicons
                            name={cabDetailsExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>

                    {cabDetailsExpanded && (
                        <View style={styles.sectionContent}>
                            <View style={styles.cabDetailsRow}>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>Cab</Text>
                                    <Text style={styles.infoValue}>{booking.transfer.details?.cabName || "N/A"}</Text>
                                </View>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>Type</Text>
                                    <Text style={styles.infoValue}>{booking.transfer.details?.cabType || "N/A"}</Text>
                                </View>
                            </View>
                            <View style={styles.cabDetailsRow}>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>Seats</Text>
                                    <Text style={styles.infoValue}>{booking.transfer.details?.cabSeatingCapacity || "N/A"}</Text>
                                </View>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>Price</Text>
                                    <Text style={styles.priceValue}>₹{booking.transfer.totalCost || "N/A"}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <View style={styles.divider} />
                </>
            )}

            {/* Itinerary Section */}
            <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection('itinerary')}
                activeOpacity={0.7}
            >
                <View style={styles.sectionTitleContainer}>
                    <Ionicons name="calendar" size={20} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Itinerary Details</Text>
                </View>
                <Ionicons
                    name={itineraryExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textSecondary}
                />
            </TouchableOpacity>

            {itineraryExpanded && (
                booking.hotels && booking.hotels.length > 0 ? (
                    <ScrollView style={styles.itineraryContainer} nestedScrollEnabled={true}>
                        {booking.hotels.map((hotel, index) => (
                            <View key={index} style={styles.itineraryDay}>
                                <View style={styles.itineraryDayHeader}>
                                    <Text style={styles.itineraryDayTitle}>Day {hotel.day || index + 1}</Text>
                                    <Text style={styles.itineraryDayLocation}>{hotel.cityName || "N/A"}</Text>
                                </View>

                                <View style={styles.accommodationSection}>
                                    <Text style={styles.accommodationTitle}>Accommodation</Text>
                                    <View style={styles.hotelDetailRow}>
                                        <View style={styles.hotelDetailItem}>
                                            <Text style={styles.infoLabel}>Property</Text>
                                            <Text style={styles.infoValue}>{hotel.propertyName || "N/A"}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.hotelDetailRow}>
                                        <View style={styles.hotelDetailItem}>
                                            <Text style={styles.infoLabel}>Room Type</Text>
                                            <Text style={styles.infoValue}>{hotel.roomName || "N/A"}</Text>
                                        </View>
                                        <View style={styles.hotelDetailItem}>
                                            <Text style={styles.infoLabel}>Meal Plan</Text>
                                            <Text style={styles.infoValue}>{hotel.mealPlan || "N/A"}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.hotelDetailRow}>
                                        <View style={styles.hotelDetailItem}>
                                            <Text style={styles.infoLabel}>Cost</Text>
                                            <Text style={styles.priceValue}>₹{hotel.cost || "N/A"}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.itineraryDivider} />
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={styles.noData}>No itinerary details available.</Text>
                )
            )}

            <View style={styles.divider} />

            {/* Total Price Section */}
            <View style={styles.totalPriceContainer}>
                <Text style={styles.totalPriceLabel}>Total Price</Text>
                <Text style={styles.totalPriceValue}>
                    ₹{calculateTotalPrice(booking)}
                </Text>
            </View>

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
                    <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={handleReject}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    activeOpacity={0.8}
                >
                    <Ionicons name="close" size={20} color={colors.danger} />
                    <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
            </View>

            {/* Rejection Modal */}
            <Modal visible={rejectModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Rejection Reason</Text>
                        <TextInput
                            style={styles.input}
                            value={rejectionReason}
                            onChangeText={setRejectionReason}
                            placeholder="Please specify why you're rejecting this booking"
                            multiline={true}
                            numberOfLines={4}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setRejectModalVisible(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalSubmitButton}
                                onPress={submitRejection}
                            >
                                <Text style={styles.modalSubmitText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Animated.View>
    );
}

// Helper function to calculate total price
const calculateTotalPrice = (booking) => {
    let total = 0;

    // Add transfer cost if available
    if (booking.transfer && booking.transfer.totalCost) {
        total += parseFloat(booking.transfer.totalCost);
    }

    // Add hotel costs if available
    if (booking.hotels && booking.hotels.length > 0) {
        booking.hotels.forEach(hotel => {
            if (hotel.cost) {
                total += parseFloat(hotel.cost);
            }
        });
    }

    return total.toFixed(2);
};

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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bookingIdContainer: {
        flex: 2,
    },
    bookingLabel: {
        fontSize: fonts.sizeXSmall,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
    },
    bookingId: {
        fontSize: fonts.sizeMedium,
        fontWeight: "600",
        color: colors.textPrimary,
        fontFamily: fonts.medium,
    },
    statusContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: spacing.tiny,
    },
    statusText: {
        fontSize: fonts.sizeSmall,
        fontWeight: "500",
        fontFamily: fonts.medium,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.small,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.small,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: fonts.sizeMedium,
        fontWeight: "600",
        color: colors.textPrimary,
        marginLeft: spacing.small,
        fontFamily: fonts.medium,
    },
    sectionContent: {
        paddingHorizontal: spacing.small,
        paddingBottom: spacing.small,
    },
    userInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.small,
    },
    userInfoItem: {
        flex: 1,
        marginRight: spacing.small,
    },
    cabDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.small,
    },
    cabDetailItem: {
        flex: 1,
        marginRight: spacing.small,
    },
    infoLabel: {
        fontSize: fonts.sizeXSmall,
        color: colors.textSecondary,
        marginBottom: 2,
        fontFamily: fonts.regular,
    },
    infoValue: {
        fontSize: fonts.sizeSmall,
        color: colors.textPrimary,
        fontFamily: fonts.regular,
    },
    priceValue: {
        fontSize: fonts.sizeSmall,
        color: colors.primary,
        fontWeight: "600",
        fontFamily: fonts.medium,
    },
    itineraryContainer: {
        maxHeight: 300,
    },
    itineraryDay: {
        marginBottom: spacing.medium,
        backgroundColor: colors.cardBackground,
        borderRadius: 8,
        padding: spacing.small,
        borderWidth: 1,
        borderColor: colors.border,
    },
    itineraryDayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.small,
    },
    itineraryDayTitle: {
        fontSize: fonts.sizeMedium,
        fontWeight: "600",
        color: colors.textPrimary,
        fontFamily: fonts.medium,
    },
    itineraryDayLocation: {
        fontSize: fonts.sizeSmall,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
    },
    accommodationSection: {
        marginTop: spacing.tiny,
    },
    accommodationTitle: {
        fontSize: fonts.sizeSmall,
        fontWeight: "500",
        color: colors.textPrimary,
        marginBottom: spacing.tiny,
        fontFamily: fonts.medium,
    },
    hotelDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.tiny,
    },
    hotelDetailItem: {
        flex: 1,
        marginRight: spacing.small,
    },
    itineraryDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginTop: spacing.small,
    },
    totalPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.small,
    },
    totalPriceLabel: {
        fontSize: fonts.sizeMedium,
        fontWeight: "600",
        color: colors.textPrimary,
        fontFamily: fonts.medium,
    },
    totalPriceValue: {
        fontSize: fonts.sizeLarge,
        fontWeight: "700",
        color: colors.primary,
        fontFamily: fonts.bold,
    },
    noData: {
        fontSize: fonts.sizeSmall,
        color: colors.textSecondary,
        textAlign: "center",
        marginVertical: spacing.small,
        fontFamily: fonts.regular,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: spacing.small,
    },
    acceptButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: spacing.medium,
        paddingHorizontal: spacing.small,
        borderRadius: 8,
        backgroundColor: colors.success,
        marginRight: spacing.small,
    },
    acceptButtonText: {
        color: colors.cardBackground,
        fontFamily: fonts.medium,
        fontSize: fonts.sizeMedium,
        marginLeft: 4,
    },
    rejectButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: spacing.medium,
        paddingHorizontal: spacing.small,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.danger,
        backgroundColor: colors.cardBackground,
    },
    rejectButtonText: {
        color: colors.danger,
        fontFamily: fonts.medium,
        fontSize: fonts.sizeMedium,
        marginLeft: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "85%",
        padding: spacing.large,
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    modalTitle: {
        fontSize: fonts.sizeLarge,
        fontWeight: "600",
        color: colors.textPrimary,
        marginBottom: spacing.medium,
        textAlign: "center",
        fontFamily: fonts.medium,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.medium,
        marginBottom: spacing.medium,
        borderRadius: 8,
        fontFamily: fonts.regular,
        backgroundColor: '#f9f9f9',
        textAlignVertical: 'top',
        minHeight: 100,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalSubmitButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.small,
        paddingHorizontal: spacing.medium,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginLeft: spacing.small,
    },
    modalSubmitText: {
        color: colors.cardBackground,
        fontWeight: "600",
        fontFamily: fonts.medium,
        fontSize: fonts.sizeMedium,
    },
    modalCancelButton: {
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: spacing.small,
        paddingHorizontal: spacing.medium,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginRight: spacing.small,
    },
    modalCancelText: {
        color: colors.textSecondary,
        fontWeight: "600",
        fontFamily: fonts.medium,
        fontSize: fonts.sizeMedium,
    },
});