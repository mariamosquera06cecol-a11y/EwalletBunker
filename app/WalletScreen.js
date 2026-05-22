import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from "react-native";

import {
  generateTransactionHistory,
  calculateNetBalance
} from "./walletEngine";

const DATA = generateTransactionHistory(200);

export default function WalletScreen() {
  const [filter, setFilter] = useState("Todos");

  const filteredData = useMemo(() => {
    if (filter === "Todos") return DATA;

    return DATA.filter((item) => item.type === filter);
  }, [filter]);

  const balance = useMemo(() => {
    return calculateNetBalance(DATA);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.account}>
          Cuenta #{item.accountNumber}
        </Text>

        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString("es-CO")}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={[
            styles.amount,
            {
              color:
                item.type === "Ingreso"
                  ? "#22c55e"
                  : "#ef4444"
            }
          ]}
        >
          {item.type === "Ingreso" ? "+" : "-"} $
          {item.amount.toLocaleString("es-CO")}
        </Text>

        <Text style={styles.status}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        E-Wallet Bunker
      </Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>
          Saldo Neto Total
        </Text>

        <Text style={styles.balance}>
          $
          {balance.toLocaleString("es-CO")}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        {["Todos", "Ingreso", "Retiro"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              filter === item && styles.activeFilter
            ]}
            onPress={() => setFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && {
                  color: "#fff"
                }
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 20,
    paddingTop: 20
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20
  },

  balanceCard: {
    backgroundColor: "#1e293b",
    padding: 25,
    borderRadius: 24,
    marginBottom: 25
  },

  balanceLabel: {
    color: "#94a3b8",
    fontSize: 16,
    marginBottom: 10
  },

  balance: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold"
  },

  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  filterButton: {
    backgroundColor: "#1e293b",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14
  },

  activeFilter: {
    backgroundColor: "#2563eb"
  },

  filterText: {
    color: "#cbd5e1",
    fontWeight: "600"
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  account: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600"
  },

  date: {
    color: "#94a3b8",
    marginTop: 5
  },

  amount: {
    fontSize: 18,
    fontWeight: "bold"
  },

  status: {
    color: "#94a3b8",
    marginTop: 5
  }
});