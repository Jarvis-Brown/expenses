import { expenseArray, selectedExpenseId } from "./state.js";
import {
    amountInput,
    dateInput,
    expenseList,
    titleInput,
    userNameSelect,
} from "./dom.js";
import { openEditExpenseModal } from "./modal.js";
import { saveExpenses } from "./storage.js";

export const groupExpenseYearMonth = () => {
    // groups the expenses by month and year. cuts off the day
    // Returns an object where each key is a month (YYYY-MM)
    // and the value is an array of expenses for that month.
    const expenseMonth = Object.groupBy(expenseArray, (expense) => {
        return expense.date.slice(0, 7);
    });

    return expenseMonth;
};

export const renderMonthExpenses = (monthKey) => {
    // renders the month expense list
    const groupedExpenses = groupExpenseYearMonth();
    const monthExpenses = groupedExpenses[monthKey] || [];

    expenseList.innerHTML = ""; // Clear the current expense list before rendering.

    monthExpenses.forEach((expense) => {
        createExpenseElement(expense);
    });
};

const createExpenseElement = (expense) => {
    // creates the expense and append expense-group dom

    const expenseTitle = document.createElement("h5");
    const expenseDate = document.createElement("h6");
    const expenseUserPaid = document.createElement("h6");
    const expenseCost = document.createElement("h6");
    const expenseGroup = document.createElement("div");
    const expenseLeft = document.createElement("div");

    expenseGroup.classList.add("expense-group");
    expenseList.appendChild(expenseGroup);

    expenseLeft.classList.add("expense-left");
    expenseGroup.appendChild(expenseLeft);

    expenseTitle.classList.add("expense-title");
    expenseTitle.innerText = expense.title;
    expenseLeft.appendChild(expenseTitle);

    expenseDate.classList.add("expense-date", "expense-info");
    expenseDate.innerText = expense.date;
    expenseLeft.appendChild(expenseDate);

    expenseUserPaid.classList.add("expense-user-name", "expense-info");
    expenseUserPaid.innerText = `paid by ${expense.paid}`;
    expenseLeft.appendChild(expenseUserPaid);

    expenseCost.classList.add("expense-cost");
    expenseCost.innerText = `$${expense.amount}`;
    expenseGroup.appendChild(expenseCost);

    expenseGroup.addEventListener("click", function () {
        openEditExpenseModal(expense);
    });

    console.log(expense);
};

export const updateSelectedExpense = (monthKey) => {
    // updates a selected expense
    const expenseToEdit = expenseArray.find((expense) => {
        return expense.id === selectedExpenseId;
    });

    if (!expenseToEdit) return;

    expenseToEdit.title = titleInput.value;
    expenseToEdit.date = dateInput.value;
    expenseToEdit.paid = userNameSelect.value;
    expenseToEdit.amount = Number(amountInput.value);

    saveExpenses(); // updates local storage expense data

    renderMonthExpenses(monthKey);
};

export const removeExpense = (monthKey) => {
    // deletes the expense
    const expenseIndex = expenseArray.findIndex((expense) => {
        return expense.id === selectedExpenseId;
    });

    if (expenseIndex !== -1) {
        expenseArray.splice(expenseIndex, 1);
    }

    saveExpenses();

    renderMonthExpenses(monthKey); // renders the current time
};

export const calculateTotalMonthlyExpenses = (monthKey) => {
    const groupExpenses = groupExpenseYearMonth();
    const monthExpenses = groupExpenses[monthKey] || [];
    return monthExpenses.length;
};

export const calculateTotalMonthlyAmount = (monthKey) => {
    const groupExpenses = groupExpenseYearMonth();
    const monthExpenses = groupExpenses[monthKey] || [];

    const totalMonthExpense = monthExpenses.reduce((acc, expense) => {
        return acc + expense.amount;
    }, 0);
    return totalMonthExpense;
};

export const calculateAllExpensesAmount = () => {
    const totalExpenseAmount = expenseArray.reduce((acc, expense) => {
        return acc + expense.amount;
    }, 0);
    return totalExpenseAmount;
};

export const calculateAllExpenses = () => expenseArray.length; // returns the total expenses in the array
