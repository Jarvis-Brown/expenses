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
} from "./dom.js";
import { expenseArray, editMode } from "./state.js";
import { saveExpenses, loadExpenses } from "./storage.js";
import {
    currentMonthKey,
    populateYearOption,
    availableMonthsForYear,
    populateMonthOption,
    showSelectedMonthExpenses,
    monthYearSelectName,
} from "./calendar.js";

addTransactionBtn.addEventListener("click", function () {
    // shows transaction modal when button clicked
    showModal();
});

closeBtn.addEventListener("click", function () {
    hideModal(); // closes modal when button clicked
});

deleteTransactionBtn.addEventListener("click", function () {
    //deletes expense when button clicked
    removeExpense(currentMonthKey);
    updateAllExpenseTotals();
    updateMonthlyTotals(currentMonthKey);
    hideModal();
});

expenseForm.addEventListener("submit", function (e) {
    // adds new expense to the array
    e.preventDefault();

    if (editMode) {
        // checks if expense already exists and if so, it updates the existing expense
        updateSelectedExpense(currentMonthKey);
    } else {
        const addExpense = {
            id: Date.now(),
            title: titleInput.value,
            paid: userNameSelect.value,
            amount: Number(amountInput.value),
            date: dateInput.value,
        };
        expenseArray.push(addExpense);
        renderMonthExpenses(currentMonthKey);
    }

    saveExpenses();
    updateAllExpenseTotals();
    updateMonthlyTotals(currentMonthKey);

    hideModal();
});

monthYearSelect.addEventListener("click", function () {
    // show the month and year selector after pressing month year button
    monthYearPicker.classList.toggle("hidden");
});

yearSelect.addEventListener("change", () => {
    const selectedYear = yearSelect.value;

    monthSelect.innerHTML = "";

    populateMonthOption(selectedYear);
});

monthSelect.addEventListener("change", () => {
    const selectedMonth = monthSelect.value;

    const monthlyAmount = calculateTotalMonthlyAmount(selectedMonth);
    const monthlyCount = calculateTotalMonthlyExpenses(selectedMonth);

    showSelectedMonthExpenses();

    transactionTotalMonth.textContent = monthlyAmount;
    totalExpenseMonthNum.textContent = monthlyCount;

    monthYearPicker.classList.add("hidden");
});

// .6) Page load

const updateAllExpenseTotals = () => {
    const totalExpenses = calculateAllExpenses();
    const allExpensesAmount = calculateAllExpensesAmount();

    transactionNumAll.textContent = totalExpenses;
    totalSpentNumAll.textContent = allExpensesAmount;
};

const updateMonthlyTotals = (monthKey) => {
    const monthlyAmount = calculateTotalMonthlyAmount(monthKey);
    const monthlyCount = calculateTotalMonthlyExpenses(monthKey);

    transactionTotalMonth.textContent = monthlyAmount;
    totalExpenseMonthNum.textContent = monthlyCount;
};

loadExpenses(); // loads expenses from localStorage into expenseArray
renderMonthExpenses(currentMonthKey); // displays the current months expenses
monthYearSelectName(currentMonthKey);
updateMonthlyTotals(currentMonthKey);

updateAllExpenseTotals();
populateYearOption();
