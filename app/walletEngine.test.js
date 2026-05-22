import {
  generateTransactionHistory,
  calculateNetBalance,
  calculateCashbackPoints
} from "./walletEngine";

describe("Wallet Engine", () => {

  test("Debe generar exactamente 50 transacciones", () => {
    const data = generateTransactionHistory(50);

    expect(data.length).toBe(50);
  });

  test("El amount siempre debe ser positivo", () => {
    const data = generateTransactionHistory(50);

    data.forEach((tx) => {
      expect(tx.amount).toBeGreaterThan(0);
    });
  });

  test("No debe haber campos undefined", () => {
    const data = generateTransactionHistory(20);

    data.forEach((tx) => {
      Object.values(tx).forEach((value) => {
        expect(value).not.toBeUndefined();
      });
    });
  });

  test("Debe calcular correctamente el saldo neto", () => {
    const mockTransactions = [
      {
        type: "Ingreso",
        amount: 100000,
        status: "Completado"
      },

      {
        type: "Retiro",
        amount: 50000,
        status: "Completado"
      }
    ];

    const result =
      calculateNetBalance(
        mockTransactions
      );

    expect(result).toBe(50000);
  });

  test(
    "Transacciones menores a 50 mil no generan puntos",
    () => {
      const transactions = [
        {
          amount: 40000,
          status: "Completado"
        }
      ];

      const result =
        calculateCashbackPoints(
          transactions
        );

      expect(result).toBe(0);
    }
  );

  test(
    "Transacciones rechazadas no generan puntos",
    () => {
      const transactions = [
        {
          amount: 100000,
          status: "Rechazado"
        }
      ];

      const result =
        calculateCashbackPoints(
          transactions
        );

      expect(result).toBe(0);
    }
  );

  test(
    "Debe calcular correctamente el cashback",
    () => {
      const transactions = [
        {
          amount: 100000,
          status: "Completado"
        }
      ];

      const result =
        calculateCashbackPoints(
          transactions
        );

      expect(result).toBe(1000);
    }
  );

  test(
    "Debe acumular puntos de varias transacciones válidas",
    () => {
      const transactions = [
        {
          amount: 100000,
          status: "Completado"
        },

        {
          amount: 200000,
          status: "Completado"
        }
      ];

      const result =
        calculateCashbackPoints(
          transactions
        );

      expect(result).toBe(3000);
    }
  );

  test(
    "Solo transacciones válidas deben generar cashback",
    () => {
      const transactions = [
        {
          amount: 100000,
          status: "Completado"
        },

        {
          amount: 30000,
          status: "Completado"
        },

        {
          amount: 90000,
          status: "Rechazado"
        }
      ];

      const result =
        calculateCashbackPoints(
          transactions
        );

      expect(result).toBe(1000);
    }
  );

  test(
    "Lista vacía no debe generar puntos",
    () => {
      const result =
        calculateCashbackPoints([]);

      expect(result).toBe(0);
    }
  );

});