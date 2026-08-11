// .5) Event Listeners

import { showModal, hideModal } from "./modal.js";
import {
    removeExpense,
    updateSelectedExpense,
    renderMonthExpenses,
    calculateTotalMonthlyExpenses,
    calculateTotalMonthlyAmount,
    calculateAllExpensesAmount,
    calculateAllExpenses,
    calculateMonthlyBalance,
    calculateMonthlyNetBalance,
} from "./expenses.js";
import {
    closeBtn,
    deleteTransactionBtn,
    expenseForm,
    monthYearPicker,
    monthYearSelect,
    addTransactionBtn,
    titleInput,
    userNameSelect,
    amountInput,
    dateInput,
    yearSelect,
    monthSelect,
    totalExpenseMonthNum,
    transactionTotalMonth,
    totalSpentNumAll,
    transactionNumAll,
    settledBalanceMessage,
    settleUpBtn,
} from "./dom.js";
import { expenseArray, editMode, selectedExpenseId } from "./state.js";
import { saveExpenses, loadExpenses } from "./storage.js";
import {
    clearMonthSettlement,
    getMonthSettlement,
    loadSettlements,
    markMonthUnsettled,
    settleMonth,
} from "./settlements.js";
import {
    currentMonthKey,
    populateYearOption,
    populateMonthOption,
    monthYearSelectName,
} from "./calendar.js";

const USER_ONE = "Jarvis";
const USER_TWO = "Brittany";
let activeMonthKey = currentMonthKey;

const renderSettlementState = (settlement, balance) => {
    if (settlement?.settled) {
        settledBalanceMessage.textContent = `${settlement.owedBy} owed ${settlement.owedTo} $${settlement.amount.toFixed(2)}.`;
        settledBalanceMessage.classList.remove("hidden");
    } else {
        settledBalanceMessage.textContent = "";
        settledBalanceMessage.classList.add("hidden");
    }

    settleUpBtn.disabled = Math.abs(balance) < 0.005;
};

const showMonth = (monthKey) => {
    if (!monthKey) return;

    const monthlyExpenseCount = calculateTotalMonthlyExpenses(monthKey);
    let settlement = getMonthSettlement(monthKey);

    if (monthlyExpenseCount === 0 && settlement) {
        clearMonthSettlement(monthKey);
        settlement = null;
    }

    const balanceCheckpoint = settlement?.balanceCheckpoint || 0;

    activeMonthKey = monthKey;
    renderMonthExpenses(monthKey);
    monthYearSelectName(monthKey);
    updateMonthlyTotals(monthKey);
    const balance = calculateMonthlyBalance(
        monthKey,
        USER_ONE,
        USER_TWO,
        balanceCheckpoint,
    );
    renderSettlementState(settlement, balance);
};

addTransactionBtn.addEventListener("click", function () {
    // shows transaction modal when button clicked
    showModal();
});

closeBtn.addEventListener("click", function () {
    hideModal(); // closes modal when button clicked
});

deleteTransactionBtn.addEventListener("click", function () {
    //deletes expense when button clicked
    removeExpense(activeMonthKey);
    markMonthUnsettled(activeMonthKey);
    updateAllExpenseTotals();
    populateYearOption();
    showMonth(activeMonthKey);
    hideModal();
});

expenseForm.addEventListener("submit", function (e) {
    // adds new expense to the array
    e.preventDefault();

    const savedMonthKey = dateInput.value.slice(0, 7);
    const expenseBeingEdited = editMode
        ? expenseArray.find((expense) => expense.id === selectedExpenseId)
        : null;
    const originalMonthKey = expenseBeingEdited?.date.slice(0, 7);

    if (editMode) {
        // checks if expense already exists and if so, it updates the existing expense
        updateSelectedExpense(savedMonthKey);
    } else {
        const addExpense = {
            id: Date.now(),
            title: titleInput.value,
            paid: userNameSelect.value,
            amount: Number(amountInput.value),
            date: dateInput.value,
        };
        expenseArray.push(addExpense);
    }

    if (originalMonthKey) markMonthUnsettled(originalMonthKey);
    markMonthUnsettled(savedMonthKey);

    saveExpenses();
    updateAllExpenseTotals();
    populateYearOption();
    showMonth(savedMonthKey);

    hideModal();
});

settleUpBtn.addEventListener("click", () => {
    const previousSettlement = getMonthSettlement(activeMonthKey);
    const previousCheckpoint = previousSettlement?.balanceCheckpoint || 0;
    const currentNetBalance = calculateMonthlyNetBalance(
        activeMonthKey,
        USER_ONE,
        USER_TWO,
    );
    const amountToSettle = currentNetBalance - previousCheckpoint;

    if (Math.abs(amountToSettle) < 0.005) return;

    const owedBy = amountToSettle > 0 ? USER_TWO : USER_ONE;
    const owedTo = amountToSettle > 0 ? USER_ONE : USER_TWO;

    settleMonth(activeMonthKey, {
        balanceCheckpoint: currentNetBalance,
        owedBy,
        owedTo,
        amount: Math.abs(amountToSettle),
    });

    showMonth(activeMonthKey);
});

monthYearSelect.addEventListener("click", function () {
    // Toggle the month and year selector when its button is pressed.
    monthYearPicker.classList.toggle("hidden");
});

document.addEventListener("click", (event) => {
    const monthFilter = monthYearSelect.closest(".month-filter");

    if (!monthFilter.contains(event.target)) {
        monthYearPicker.classList.add("hidden");
    }
});

yearSelect.addEventListener("change", () => {
    const selectedYear = yearSelect.value;

    populateMonthOption(selectedYear);
});

monthSelect.addEventListener("change", () => {
    const selectedMonth = monthSelect.value;

    showMonth(selectedMonth);

    monthYearPicker.classList.add("hidden");
});

// .6) Page load

const updateAllExpenseTotals = () => {
    const totalExpenses = calculateAllExpenses();
    const allExpensesAmount = calculateAllExpensesAmount();

    transactionNumAll.textContent = totalExpenses;
    totalSpentNumAll.textContent = allExpensesAmount.toFixed(2);
};

const updateMonthlyTotals = (monthKey) => {
    const monthlyAmount = calculateTotalMonthlyAmount(monthKey);
    const monthlyCount = calculateTotalMonthlyExpenses(monthKey);

    transactionTotalMonth.textContent = monthlyAmount.toFixed(2);
    totalExpenseMonthNum.textContent = monthlyCount;
};

loadExpenses(); // loads expenses from localStorage into expenseArray
loadSettlements();
showMonth(currentMonthKey); // displays the current month's expenses and totals

updateAllExpenseTotals();
populateYearOption();
