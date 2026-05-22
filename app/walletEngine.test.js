import {
  generateTransactionHistory,
  calculateNetBalance,
  calculateCashbackPoints,
  transferToSavingsGoal,
  generateDollarRate,
  buyUSDT
} from "./walletEngine";

describe("Wallet Engine", () => {

  test(
    "Debe generar exactamente 50 transacciones",
    () => {

      const data =
        generateTransactionHistory(50);

      expect(data.length)
        .toBe(50);

    }
  );

  test(
    "El amount siempre debe ser positivo",
    () => {

      const data =
        generateTransactionHistory(50);

      data.forEach((tx) => {

        expect(tx.amount)
          .toBeGreaterThan(0);

      });

    }
  );

  test(
    "No debe haber campos undefined",
    () => {

      const data =
        generateTransactionHistory(20);

      data.forEach((tx) => {

        Object.values(tx)
          .forEach((value) => {

            expect(value)
              .not
              .toBeUndefined();

          });

      });

    }
  );

  test(
    "Debe calcular correctamente el saldo neto",
    () => {

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

      expect(result)
        .toBe(50000);

    }
  );

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

      expect(result)
        .toBe(0);

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

      expect(result)
        .toBe(0);

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

      expect(result)
        .toBe(1000);

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

      expect(result)
        .toBe(3000);

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
          amount: 40000,
          status: "Completado"
        },

        {
          amount: 200000,
          status: "Rechazado"
        }

      ];

      const result =
        calculateCashbackPoints(
          transactions
        );

      expect(result)
        .toBe(1000);

    }
  );

  test(
    "Lista vacía no debe generar puntos",
    () => {

      const result =
        calculateCashbackPoints([]);

      expect(result)
        .toBe(0);

    }
  );

  test(
    "Debe transferir dinero correctamente a una meta",
    () => {

      const result =
        transferToSavingsGoal(
          500000,
          200000
        );

      expect(result.savedAmount)
        .toBe(200000);

      expect(result.remainingBalance)
        .toBe(300000);

    }
  );

  test(
    "No debe permitir transferir más dinero del disponible",
    () => {

      const result =
        transferToSavingsGoal(
          100000,
          200000
        );

      expect(result.status)
        .toBe("Rechazado");

    }
  );

  test(
    "La tasa del dólar debe estar entre 3900 y 4300",
    () => {

      const rate =
        generateDollarRate();

      expect(rate)
        .toBeGreaterThanOrEqual(
          3900
        );

      expect(rate)
        .toBeLessThanOrEqual(
          4300
        );

    }
  );

  test(
    "Debe comprar USDT correctamente",
    () => {

      const result =
        buyUSDT(
          500000,
          200000
        );

      expect(result.status)
        .toBe("Completado");

      expect(
        result.usdtBought
      ).toBeGreaterThan(0);

    }
  );

  test(
    "Debe rechazar compra por saldo insuficiente",
    () => {

      const result =
        buyUSDT(
          100000,
          500000
        );

      expect(result.status)
        .toBe("Rechazado");

    }
  );

  test(
    "La conversión COP a USDT debe ser correcta",
    () => {

      const result =
        buyUSDT(
          500000,
          400000
        );

      const expected =
        Number(
          (
            result.copSpent /
            result.rate
          ).toFixed(4)
        );

      expect(
        result.usdtBought
      ).toBe(expected);

    }
  );

});