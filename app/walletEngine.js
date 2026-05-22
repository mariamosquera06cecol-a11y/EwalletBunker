import { faker } from "@faker-js/faker";

faker.locale = "es";

const transactionTypes = [
  "Ingreso",
  "Retiro"
];

const statusOptions = [
  "Completado",
  "Pendiente",
  "Rechazado"
];





/* TRANSACCIONES */

export const generateTransactionHistory = (
  count
) => {

  return Array.from(
    { length: count },
    () => ({

      id: faker.string.uuid(),

      accountNumber:
        faker.finance.accountNumber(
          10
        ),

      type:
        faker.helpers.arrayElement(
          transactionTypes
        ),

      amount: Number(
        faker.finance.amount({
          min: 10000,
          max: 500000,
          dec: 2
        })
      ),

      date:
        faker.date.recent({
          days: 30
        }),

      status:
        faker.helpers.arrayElement(
          statusOptions
        )

    })
  );

};





/* SALDO */

export const calculateNetBalance = (
  transactions
) => {

  return transactions.reduce(
    (acc, tx) => {

      if (
        tx.status !== "Completado"
      ) {
        return acc;
      }

      if (
        tx.type === "Ingreso"
      ) {
        return acc + tx.amount;
      }

      return acc - tx.amount;

    },
    0
  );

};





/* APRENDIZ 1 - USDT */

export function generateDollarRate() {

  return faker.number.int({
    min: 3900,
    max: 4300
  });

}

export function buyUSDT(
  copBalance,
  copAmount
) {

  const rate =
    generateDollarRate();

  if (copAmount > copBalance) {

    return {
      status: "Rechazado",
      message:
        "Saldo insuficiente"
    };

  }

  const usdt =
    copAmount / rate;

  return {
    status: "Completado",
    rate,
    copSpent: copAmount,
    usdtBought:
      Number(usdt.toFixed(4))
  };

}





/* APRENDIZ 2 - CASHBACK */

export function calculateCashbackPoints(
  transactions
) {

  let points = 0;

  transactions.forEach((tx) => {

    if (
      tx.status === "Completado" &&
      tx.amount >= 50000
    ) {

      points +=
        tx.amount * 0.01;

    }

  });

  return Number(
    points.toFixed(2)
  );

}





/* APRENDIZ 3 - METAS */

export function generateSavingsGoals() {

  return [

    {
      id: "1",
      name: "PC Gamer",
      targetAmount: 4000000,
      savedAmount: 1200000
    },

    {
      id: "2",
      name: "Moto",
      targetAmount: 8000000,
      savedAmount: 2500000
    },

    {
      id: "3",
      name: "Viaje",
      targetAmount: 3000000,
      savedAmount: 900000
    }

  ];

}
/* TRANSFERIR A META */

export function transferToSavingsGoal(
  currentBalance,
  transferAmount
) {

  if (
    transferAmount > currentBalance
  ) {

    return {
      status: "Rechazado",
      message:
        "Fondos insuficientes"
    };

  }

  return {
    status: "Completado",
    remainingBalance:
      currentBalance -
      transferAmount,
    savedAmount:
      transferAmount
  };

}