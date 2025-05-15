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
                    amount: 0,
                    reason: "",
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

    // Format currency value
    const formatCurrency = (value) => {
        if (!value || isNaN(value)) return "N/A";
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
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
                            <Ionicons name="map" size={20} color={colors.primary} />
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
                        {itinerary.map((item, index) => {
                            const selected = item.selectedItinerary || {};
                            return (
                                <View key={index} style={styles.itineraryItem}>
                                    <View style={styles.itineraryHeader}>
                                        <View style={styles.itineraryDayBadge}>
                                            <Text style={styles.itineraryDayText}>Day {index + 1}</Text>
                                        </View>
                                        <Text style={styles.itineraryTitle}>{selected.itineraryTitle || "No Title"}</Text>
                                    </View>

                                    <Text style={styles.itineraryDescription}>{selected.itineraryDescription || "No Description"}</Text>

                                    <View style={styles.itineraryDetailsContainer}>
                                        {selected.cityName && (
                                            <View style={styles.itineraryDetailItem}>
                                                <Ionicons name="location" size={14} color={colors.primary} />
                                                <Text style={styles.itineraryDetailText}>{selected.cityName}</Text>
                                            </View>
                                        )}

                                        {selected.totalHours && (
                                            <View style={styles.itineraryDetailItem}>
                                                <Ionicons name="time" size={14} color={colors.primary} />
                                                <Text style={styles.itineraryDetailText}>{selected.totalHours} hours</Text>
                                            </View>
                                        )}

                                        {selected.distance && (
                                            <View style={styles.itineraryDetailItem}>
                                                <Ionicons name="navigate" size={14} color={colors.primary} />
                                                <Text style={styles.itineraryDetailText}>{selected.distance} km</Text>
                                            </View>
                                        )}
                                    </View>

                                    {selected.cityArea && selected.cityArea.length > 0 && (
                                        <View style={styles.itineraryCityAreaContainer}>
                                            <Text style={styles.itineraryCityAreaLabel}>Areas:</Text>
                                            <View style={styles.itineraryCityAreaBadges}>
                                                {selected.cityArea.map((area, idx) => (
                                                    <View key={idx} style={styles.itineraryCityAreaBadge}>
                                                        <Text style={styles.itineraryCityAreaBadgeText}>{area}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )}

                                    {selected.additionalInfo && (
                                        <View style={styles.itineraryAdditionalInfoContainer}>
                                            <Ionicons name="information-circle" size={14} color={colors.primary} />
                                            <Text style={styles.itineraryAdditionalInfo}>{selected.additionalInfo}</Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>
                ) : (
                    <Text style={styles.noData}>No itinerary details available.</Text>
                )
            )}

            <View style={styles.divider} />

            {/* Price Summary Section */}
            <View style={styles.priceSummaryContainer}>
                <View style={styles.priceSummaryHeader}>
                    <Ionicons name="pricetag" size={20} color={colors.primary} />
                    <Text style={styles.priceSummaryTitle}>Price Summary</Text>
                </View>

                <View style={styles.priceDetailsContainer}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Base Price</Text>
                        <Text style={styles.priceValue}>{formatCurrency(booking.cost)}</Text>
                    </View>
                    {booking.taxes && (
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Taxes & Fees</Text>
                            <Text style={styles.priceValue}>{formatCurrency(booking.taxes)}</Text>
                        </View>
                    )}
                    <View style={styles.totalPriceRow}>
                        <Text style={styles.totalPriceLabel}>Total Price</Text>
                        <Text style={styles.totalPriceValue}>{formatCurrency(booking.cost)}</Text>
                    </View>
                </View>
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
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Reject Booking</Text>
                            <TouchableOpacity
                                onPress={() => setRejectModalVisible(false)}
                                style={styles.modalCloseButton}
                            >
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalDivider} />

                        <Text style={styles.modalSectionTitle}>Rejection Reason</Text>
                        <TextInput
                            style={styles.reasonInput}
                            value={rejectionReason}
                            onChangeText={setRejectionReason}
                            placeholder="Please specify why you're rejecting this booking"
                            multiline={true}
                            numberOfLines={4}
                        />

                        <View style={styles.bidPriceContainer}>
                            <Text style={styles.modalSectionTitle}>Bid Your Price (Optional)</Text>
                            <View style={styles.bidInputContainer}>
                                <Text style={styles.currencySymbol}>₹</Text>
                                <TextInput
                                    style={styles.bidInput}
                                    value={bidPrice}
                                    onChangeText={setBidPrice}
                                    placeholder="Enter your bid price"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

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

    // Enhanced Itinerary Styles
    itineraryContainer: {
        maxHeight: 300,
        paddingHorizontal: spacing.small,
    },
    itineraryItem: {
        marginBottom: spacing.medium,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: spacing.medium,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
    },
    itineraryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.small,
    },
    itineraryDayBadge: {
        backgroundColor: colors.primary,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginRight: spacing.small,
    },
    itineraryDayText: {
        color: colors.cardBackground,
        fontSize: fonts.sizeXSmall,
        fontFamily: fonts.medium,
        fontWeight: '600',
    },
    itineraryTitle: {
        fontSize: fonts.sizeMedium,
        fontWeight: "600",
        color: colors.textPrimary,
        fontFamily: fonts.medium,
        flex: 1,
    },
    itineraryDescription: {
        fontSize: fonts.sizeSmall,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
        marginBottom: spacing.small,
        lineHeight: 20,
    },
    itineraryDetailsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.small,
    },
    itineraryDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.medium,
        marginBottom: spacing.tiny,
    },
    itineraryDetailText: {
        fontSize: fonts.sizeXSmall,
        color: colors.textPrimary,
        fontFamily: fonts.regular,
        marginLeft: 4,
    },
    itineraryCityAreaContainer: {
        marginBottom: spacing.small,
    },
    itineraryCityAreaLabel: {
        fontSize: fonts.sizeXSmall,
        color: colors.textSecondary,
        fontFamily: fonts.medium,
        marginBottom: 4,
    },
    itineraryCityAreaBadges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    itineraryCityAreaBadge: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginRight: 6,
        marginBottom: 6,
    },
    itineraryCityAreaBadgeText: {
        fontSize: fonts.sizeXSmall,
        color: colors.textPrimary,
        fontFamily: fonts.regular,
    },
    itineraryAdditionalInfoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        padding: spacing.small,
        borderRadius: 6,
    },
    itineraryAdditionalInfo: {
        fontSize: fonts.sizeXSmall,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
        marginLeft: 6,
        flex: 1,
        lineHeight: 18,
    },

    // Enhanced Price Summary Styles
    priceSummaryContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: spacing.medium,
        marginVertical: spacing.small,
    },
    priceSummaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.small,
    },
    priceSummaryTitle: {
        fontSize: fonts.sizeMedium,
        fontWeight: "600",
        color: colors.textPrimary,
        marginLeft: spacing.small,
        fontFamily: fonts.medium,
    },
    priceDetailsContainer: {
        marginLeft: spacing.large,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.tiny,
    },
    priceLabel: {
        fontSize: fonts.sizeSmall,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
    },
    priceValue: {
        fontSize: fonts.sizeSmall,
        color: colors.textPrimary,
        fontFamily: fonts.regular,
    },
    totalPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.small,
        paddingTop: spacing.small,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    totalPriceLabel: {
        fontSize: fonts.sizeMedium,
        fontWeight: "600",
        color: colors.textPrimary,
        fontFamily: fonts.medium,
    },
    totalPriceValue: {
        fontSize: fonts.sizeMedium,
        fontWeight: "600",
        color: colors.primary,
        fontFamily: fonts.medium,
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

    // Enhanced Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
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
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.medium,
        backgroundColor: '#f9f9f9',
    },
    modalTitle: {
        fontSize: fonts.sizeLarge,
        fontWeight: '600',
        color: colors.textPrimary,
        fontFamily: fonts.medium,
    },
    modalCloseButton: {
        padding: 4,
    },
    modalDivider: {
        height: 1,
        backgroundColor: colors.border,
    },
    modalSectionTitle: {
        fontSize: fonts.sizeMedium,
        fontWeight: '600',
        color: colors.textPrimary,
        fontFamily: fonts.medium,
        marginBottom: spacing.small,
        marginTop: spacing.medium,
    },
    reasonInput: {
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.medium,
        borderRadius: 8,
        fontFamily: fonts.regular,
        backgroundColor: '#f9f9f9',
        textAlignVertical: 'top',
        minHeight: 100,
        fontSize: fonts.sizeSmall,
    },
    bidPriceContainer: {
        marginTop: spacing.medium,
    },
    bidInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
    },
    currencySymbol: {
        paddingHorizontal: spacing.medium,
        fontSize: fonts.sizeMedium,
        fontWeight: '600',
        color: colors.textSecondary,
        backgroundColor: '#f0f0f0',
        paddingVertical: spacing.medium,
    },
    bidInput: {
        flex: 1,
        padding: spacing.medium,
        fontSize: fonts.sizeMedium,
        fontFamily: fonts.regular,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacing.medium,
        marginTop: spacing.medium,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    modalSubmitButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.medium,
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
        paddingVertical: spacing.medium,
        paddingHorizontal: spacing.medium,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginRight: spacing.small,
        backgroundColor: '#f9f9f9',
    },
    modalCancelText: {
        color: colors.textSecondary,
        fontWeight: '600',
        fontFamily: fonts.medium,
        fontSize: fonts.sizeMedium,
    },
});