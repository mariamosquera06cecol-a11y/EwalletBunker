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
  calculateNetBalance,
  calculateCashbackPoints,
  generateSavingsGoals,
  generateDollarRate,
  buyUSDT
} from "./walletEngine";

const DATA = generateTransactionHistory(200);

const SAVINGS_GOALS =
  generateSavingsGoals();

export default function WalletScreen() {

  const [filter, setFilter] =
    useState("Todos");

  const dollarRate =
    generateDollarRate();

  const usdtPurchase =
    buyUSDT(
      calculateNetBalance(DATA),
      100000,
      dollarRate
    );

  const filteredData = useMemo(() => {

    if (filter === "Todos") {
      return DATA;
    }

    return DATA.filter(
      (item) =>
        item.type === filter
    );

  }, [filter]);

  const balance = useMemo(() => {
    return calculateNetBalance(DATA);
  }, []);

  const cashbackPoints =
    useMemo(() => {
      return calculateCashbackPoints(
        DATA
      );
    }, []);

  const renderItem = ({ item }) => (

    <View style={styles.card}>

      <View>

        <Text style={styles.account}>
          Cuenta #{item.accountNumber}
        </Text>

        <Text style={styles.date}>
          {new Date(item.date)
            .toLocaleDateString(
              "es-CO"
            )}
        </Text>

      </View>

      <View
        style={{
          alignItems: "flex-end"
        }}
      >

        <Text
          style={[
            styles.amount,
            {
              color:
                item.type ===
                "Ingreso"
                  ? "#22c55e"
                  : "#ef4444"
            }
          ]}
        >

          {item.type ===
          "Ingreso"
            ? "+"
            : "-"}

          {" "}$

          {item.amount.toLocaleString(
            "es-CO"
          )}

        </Text>

        <Text style={styles.status}>
          {item.status}
        </Text>

      </View>

    </View>

  );

  return (

    <SafeAreaView
      style={styles.container}
    >

      <Text style={styles.title}>
        E-Wallet Bunker
      </Text>





      {/* SALDO */}

      <View style={styles.balanceCard}>

        <Text style={styles.balanceLabel}>
          Saldo Neto Total
        </Text>

        <Text style={styles.balance}>
          $
          {balance.toLocaleString(
            "es-CO"
          )}
        </Text>

      </View>





      {/* PUNTOS ADSO */}

      <View style={styles.pointsCard}>

        <Text style={styles.pointsLabel}>
          Puntos ADSO
        </Text>

        <Text style={styles.points}>
          {cashbackPoints.toLocaleString(
            "es-CO"
          )}
        </Text>

      </View>





      {/* USDT */}

      <View style={styles.cryptoCard}>

        <Text style={styles.cryptoTitle}>
          Compra USDT
        </Text>

        <Text style={styles.cryptoText}>
          Tasa actual:
          {" "}
          $
          {dollarRate.toLocaleString(
            "es-CO"
          )}
        </Text>

        <Text style={styles.cryptoText}>
          Compra:
          {" "}
          $
          100.000 COP
        </Text>

        <Text style={styles.cryptoResult}>

          {usdtPurchase.success
            ? `${usdtPurchase.usdt.toFixed(
                2
              )} USDT`
            : "Saldo insuficiente"}

        </Text>

      </View>





      {/* METAS */}

      <Text style={styles.sectionTitle}>
        Metas de ahorro
      </Text>

      {SAVINGS_GOALS
        .slice(0, 2)
        .map((goal) => {

        const progress =
          (
            goal.savedAmount /
            goal.targetAmount
          ) * 100;

        return (

          <View
            key={goal.id}
            style={styles.goalCard}
          >

            <View
              style={styles.goalHeader}
            >

              <Text
                style={styles.goalName}
              >
                {goal.name}
              </Text>

              <Text
                style={
                  styles.goalPercent
                }
              >
                {progress.toFixed(0)}%
              </Text>

            </View>

            <Text
              style={styles.goalAmount}
            >

              $

              {goal.savedAmount
                .toLocaleString(
                  "es-CO"
                )}

            </Text>

            <View
              style={styles.progressBar}
            >

              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      `${progress}%`
                  }
                ]}
              />

            </View>

          </View>

        );

      })}





      {/* FILTROS */}

      <View
        style={styles.filterContainer}
      >

        {[
          "Todos",
          "Ingreso",
          "Retiro"
        ].map((item) => (

          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,

              filter === item &&
              styles.activeFilter
            ]}
            onPress={() =>
              setFilter(item)
            }
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





      {/* LISTA */}

      <FlatList
        style={{ flex: 1 }}
        data={filteredData}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={renderItem}
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={5}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120
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





  /* SALDO */

  balanceCard: {
    backgroundColor: "#1e293b",
    padding: 25,
    borderRadius: 24,
    marginBottom: 20
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





  /* PUNTOS */

  pointsCard: {
    backgroundColor: "#14532d",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20
  },

  pointsLabel: {
    color: "#bbf7d0",
    marginBottom: 8,
    fontSize: 15
  },

  points: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold"
  },





  /* USDT */

  cryptoCard: {
    backgroundColor: "#172554",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20
  },

  cryptoTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  cryptoText: {
    color: "#cbd5e1",
    marginBottom: 5
  },

  cryptoResult: {
    color: "#38bdf8",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10
  },





  /* METAS */

  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },

  goalCard: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10
  },

  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  goalName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600"
  },

  goalPercent: {
    color: "#38bdf8",
    fontWeight: "bold"
  },

  goalAmount: {
    color: "#94a3b8",
    marginTop: 5,
    marginBottom: 8
  },

  progressBar: {
    height: 10,
    backgroundColor: "#334155",
    borderRadius: 10,
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#38bdf8"
  },





  /* FILTROS */

  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 30
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





  /* TARJETAS */

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