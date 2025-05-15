import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Animated, ScrollView, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing } from "../styles/theme";
import { updateCabBooking } from "../services/api";

export default function BookingCard({ booking }) {
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [bidPrice, setBidPrice] = useState("");
    const [elevation] = useState(new Animated.Value(1));
    const [userDetailsExpanded, setUserDetailsExpanded] = useState(true);
    const [tripDetailsExpanded, setTripDetailsExpanded] = useState(false);
    const [vehicleDetailsExpanded, setVehicleDetailsExpanded] = useState(false);
    const [itineraryExpanded, setItineraryExpanded] = useState(false);

    const handleAccept = async () => {
        try {
            await updateCabBooking(booking._id, {
                bookingStatus: "accepted",
                responseDetails: {
                    status: "accepted",
                    respondedAt: new Date(),
                },
            });
            Alert.alert("Success", "Booking accepted successfully.");
        } catch (error) {
            Alert.alert("Error", "Failed to accept booking. Please try again.");
        }
    };

    const handleReject = () => {
        setRejectModalVisible(true);
    };

    const submitRejection = async () => {
        if (!rejectionReason.trim()) {
            Alert.alert("Validation", "Please enter a rejection reason.");
            return;
        }
        if (bidPrice && isNaN(bidPrice)) {
            Alert.alert("Validation", "Please enter a valid bid price.");
            return;
        }
        try {
            const updateData = {
                bookingStatus: "rejected",
                responseDetails: {
                    status: "rejected",
                    reason: rejectionReason,
                    respondedAt: new Date(),
                    amount: 0,
                    reason: "accept",
                },
            };
            if (bidPrice) {
                updateData.responseDetails.amount = parseFloat(bidPrice);
            }
            await updateCabBooking(booking._id, updateData);
            Alert.alert("Success", "Booking rejected successfully.");
            setRejectModalVisible(false);
            setRejectionReason("");
            setBidPrice("");
        } catch (error) {
            Alert.alert("Error", "Failed to reject booking. Please try again.");
        }
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

    let statusColor = colors.primary;
    if (booking.bookingStatus === "accepted") {
        statusColor = colors.success;
    } else if (booking.bookingStatus === "rejected") {
        statusColor = colors.danger;
    }

    const userInfo = booking.customerInfo || null;
    const tripDetails = booking.tripDetails || null;
    const vehicleDetails = booking.vehicleDetails || null;
    const itinerary = booking.itinerary || [];

    const toggleSection = (section) => {
        if (section === 'user') {
            setUserDetailsExpanded(!userDetailsExpanded);
        } else if (section === 'trip') {
            setTripDetailsExpanded(!tripDetailsExpanded);
        } else if (section === 'vehicle') {
            setVehicleDetailsExpanded(!vehicleDetailsExpanded);
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
                    <Text style={styles.bookingId}>{booking._id}</Text>
                </View>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        {booking.bookingStatus ? booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1) : "Pending"}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Guest Information Section */}
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
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{userInfo.email || "N/A"}</Text>
                        </View>
                    </View>
                    <View style={styles.userInfoRow}>
                        <View style={styles.userInfoItem}>
                            <Text style={styles.infoLabel}>Mobile</Text>
                            <Text style={styles.infoValue}>{userInfo.mobile || "N/A"}</Text>
                        </View>
                        <View style={styles.userInfoItem}>
                            <Text style={styles.infoLabel}>Passengers</Text>
                            <Text style={styles.infoValue}>
                                Adults: {userInfo.passengers?.adults || "0"}, Kids: {userInfo.passengers?.kids || "0"}, Total: {userInfo.passengers?.total || "0"}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {!userInfo && userDetailsExpanded && (
                <Text style={styles.noData}>No guest information available.</Text>
            )}

            <View style={styles.divider} />

            {/* Trip Details Section */}
            {tripDetails && (
                <>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => toggleSection('trip')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.sectionTitleContainer}>
                            <Ionicons name="car" size={20} color={colors.primary} />
                            <Text style={styles.sectionTitle}>Trip Details</Text>
                        </View>
                        <Ionicons
                            name={tripDetailsExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>

                    {tripDetailsExpanded && (
                        <View style={styles.sectionContent}>
                            <View style={styles.cabDetailsRow}>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>From</Text>
                                    <Text style={styles.infoValue}>{tripDetails.from || "N/A"}</Text>
                                </View>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>Destination</Text>
                                    <Text style={styles.infoValue}>{tripDetails.destination || "N/A"}</Text>
                                </View>
                            </View>
                            <View style={styles.cabDetailsRow}>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>Travel Date</Text>
                                    <Text style={styles.infoValue}>{tripDetails.travelDate ? new Date(tripDetails.travelDate).toLocaleDateString() : "N/A"}</Text>
                                </View>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>Package Type</Text>
                                    <Text style={styles.infoValue}>{tripDetails.packageType || "N/A"}</Text>
                                </View>
                            </View>
                            <View style={styles.cabDetailsRow}>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>Package Category</Text>
                                    <Text style={styles.infoValue}>{tripDetails.packageCategory || "N/A"}</Text>
                                </View>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>Duration</Text>
                                    <Text style={styles.infoValue}>
                                        {tripDetails.duration?.days || "N/A"} days, {tripDetails.duration?.nights || "N/A"} nights
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <View style={styles.divider} />
                </>
            )}

            {/* Vehicle Details Section */}
            {vehicleDetails && (
                <>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => toggleSection('vehicle')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.sectionTitleContainer}>
                            <Ionicons name="car" size={20} color={colors.primary} />
                            <Text style={styles.sectionTitle}>Vehicle Details</Text>
                        </View>
                        <Ionicons
                            name={vehicleDetailsExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>

                    {vehicleDetailsExpanded && (
                        <View style={styles.sectionContent}>
                            <View style={styles.cabDetailsRow}>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>Name</Text>
                                    <Text style={styles.infoValue}>{vehicleDetails.name || "N/A"}</Text>
                                </View>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>Type</Text>
                                    <Text style={styles.infoValue}>{vehicleDetails.type || "N/A"}</Text>
                                </View>
                            </View>
                            <View style={styles.cabDetailsRow}>
                                <View style={styles.cabDetailItem}>
                                    <Text style={styles.infoLabel}>Seating Capacity</Text>
                                    <Text style={styles.infoValue}>{vehicleDetails.seatingCapacity || "N/A"}</Text>
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
                itinerary.length > 0 ? (
                    <ScrollView style={styles.itineraryContainer} nestedScrollEnabled={true}>
                        {itinerary.map((item, index) => (
                            <View key={index} style={styles.itineraryItem}>
                                <Text style={styles.itineraryTitle}>{item.itineraryTitle}</Text>
                                <Text style={styles.itineraryDescription}>{item.itineraryDescription}</Text>
                                {item.cityName && <Text style={styles.itineraryCity}>City: {item.cityName}</Text>}
                                {item.totalHours && <Text style={styles.itineraryHours}>Total Hours: {item.totalHours}</Text>}
                                {item.distance && <Text style={styles.itineraryDistance}>Distance: {item.distance} km</Text>}
                                {item.cityArea && item.cityArea.length > 0 && (
                                    <Text style={styles.itineraryCityArea}>Areas: {item.cityArea.join(", ")}</Text>
                                )}
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
                    ₹{booking.cost || "N/A"}
                </Text>
            </View>

            <View style={styles.divider} />

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={handleAccept}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    activeOpacity={0.8}
                >
                    <Ionicons name="checkmark-circle" size={22} color={colors.cardBackground} />
                    <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={handleReject}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    activeOpacity={0.8}
                >
                    <Ionicons name="close-circle" size={22} color={colors.danger} />
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
                        <Text style={{ fontWeight: '600', marginBottom: 8 }}>Bid Your Price (Optional)</Text>
                        <TextInput
                            style={[styles.input, { height: 50 }]}
                            value={bidPrice}
                            onChangeText={setBidPrice}
                            placeholder="Enter your bid price"
                            keyboardType="numeric"
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
    itineraryItem: {
        marginBottom: spacing.small,
    },
    itineraryTitle: {
        fontSize: fonts.sizeSmall,
        fontWeight: "600",
        color: colors.textPrimary,
        fontFamily: fonts.medium,
    },
    itineraryDescription: {
        fontSize: fonts.sizeSmall,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
    },
    itineraryCity: {
        fontSize: fonts.sizeXSmall,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
    },
    itineraryHours: {
        fontSize: fonts.sizeXSmall,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
    },
    itineraryDistance: {
        fontSize: fonts.sizeXSmall,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
    },
    itineraryCityArea: {
        fontSize: fonts.sizeXSmall,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
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
        textAlign: 'center',
        marginVertical: spacing.small,
        fontFamily: fonts.regular,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.small,
        marginBottom: spacing.medium,
    },
    acceptButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: colors.success,
        marginRight: spacing.small,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    acceptButtonText: {
        color: colors.cardBackground,
        fontFamily: fonts.medium,
        fontSize: fonts.sizeMedium,
        marginLeft: 8,
        fontWeight: '600',
    },
    rejectButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.danger,
        backgroundColor: colors.cardBackground,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    rejectButtonText: {
        color: colors.danger,
        fontFamily: fonts.medium,
        fontSize: fonts.sizeMedium,
        marginLeft: 8,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
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
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.medium,
        textAlign: 'center',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        fontWeight: '600',
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
        fontWeight: '600',
        fontFamily: fonts.medium,
        fontSize: fonts.sizeMedium,
    },
});
