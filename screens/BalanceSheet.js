import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { colors, fonts, spacing } from "../styles/theme";

const sampleData = [
  { id: "1", date: "2024-06-01", description: "Initial Credit", amount: 10000, type: "credit" },
  { id: "2", date: "2024-06-05", description: "Debit for Supplies", amount: -2500, type: "debit" },
  { id: "3", date: "2024-06-10", description: "Credit from Client", amount: 5000, type: "credit" },
  { id: "4", date: "2024-06-15", description: "Debit for Maintenance", amount: -1500, type: "debit" },
];

export default function BalanceSheet() {
  const [entries, setEntries] = useState(sampleData);

  const renderItem = ({ item }) => {
    const isCredit = item.type === "credit";
    return (
      <View style={styles.entryContainer}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={[styles.amount, isCredit ? styles.credit : styles.debit]}>
          {isCredit ? "+" : "-"}₹{Math.abs(item.amount)}
        </Text>
      </View>
    );
  };

  const calculateBalance = () => {
    return entries.reduce((acc, entry) => acc + entry.amount, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Balance Sheet</Text>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Current Balance:</Text>
        <Text style={styles.balanceValue}>₹{calculateBalance()}</Text>
      </View>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.medium,
  },
  title: {
    fontSize: fonts.sizeLarge,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.large,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.large,
    padding: spacing.medium,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: fonts.sizeMedium,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  balanceValue: {
    fontSize: fonts.sizeMedium,
    fontWeight: "700",
    color: colors.primary,
  },
  listContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: spacing.medium,
  },
  entryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  date: {
    flex: 1,
    fontSize: fonts.sizeSmall,
    color: colors.textSecondary,
  },
  description: {
    flex: 3,
    fontSize: fonts.sizeRegular,
    color: colors.textPrimary,
  },
  amount: {
    flex: 1,
    fontSize: fonts.sizeRegular,
    fontWeight: "600",
    textAlign: "right",
  },
  credit: {
    color: "green",
  },
  debit: {
    color: "red",
  },
});
