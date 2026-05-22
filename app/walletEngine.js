import { faker } from "@faker-js/faker";

faker.locale = "es";

const transactionTypes = ["Ingreso", "Retiro"];
const statusOptions = ["Completado", "Pendiente", "Rechazado"];

export const generateTransactionHistory = (count) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    accountNumber: faker.finance.accountNumber(10),
    type: faker.helpers.arrayElement(transactionTypes),
    amount: Number(
      faker.finance.amount({
        min: 10000,
        max: 500000,
        dec: 2
      })
    ),
    date: faker.date.recent({ days: 30 }),
    status: faker.helpers.arrayElement(statusOptions)
  }));
};

export const calculateNetBalance = (transactions) => {
  return transactions.reduce((acc, tx) => {
    if (tx.status !== "Completado") return acc;

    if (tx.type === "Ingreso") {
      return acc + tx.amount;
    }

    return acc - tx.amount;
  }, 0);
};
export const calculateCashbackPoints = (
  transactions
) => {
  let points = 0;

  transactions.forEach((tx) => {
    const qualifies =
      tx.status === "Completado" &&
      tx.amount > 50000;

    if (qualifies) {
      points += tx.amount * 0.01;
    }
  });

  return Number(points.toFixed(2));
};