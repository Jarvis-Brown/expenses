import { groupExpenseYearMonth } from "./expenses.js";

export const calculateMonthExpensesAmount = (monthKey) => {
    // calculates the monthly expense amount
    const groupedExpenseObject = groupExpenseYearMonth();
    const monthExpensesArray = groupedExpenseObject[monthKey] || [];
    const totalSpentMonth = monthExpensesArray.reduce((acc, num) => {
        return acc + num.amount;
    }, 0);
    return totalSpentMonth;
};

export const calculateTotalExpenses = (monthKey) => {
    // calculates the total number of expenses in the month
    const groupedExpenseObject = groupExpenseYearMonth();
    const monthExpenseArray = groupedExpenseObject[monthKey] || [];
    const totalMonthExpenseArray = monthExpenseArray.length;
    return totalMonthExpenseArray;
};
