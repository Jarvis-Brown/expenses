// .5) Event Listeners

import { showModal, hideModal } from "./modal.js";
import {
    removeExpense,
    updateSelectedExpense,
    renderMonthExpenses,
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
} from "./dom.js";
import { expenseArray, editMode } from "./state.js";
import { saveExpenses, loadExpenses } from "./storage.js";
import {
    currentMonthKey,
    populateYearOption,
    availableMonthsForYear,
    populateMonthOption,
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

    hideModal();
});

monthYearSelect.addEventListener("click", function () {
    // show the month and year selector after pressing month year button
    monthYearPicker.classList.remove("hidden");
});

yearSelect.addEventListener("change", () => {
    const selectedYear = yearSelect.value;

    monthSelect.innerHTML = "";

    populateMonthOption(selectedYear);
});

// .6) Page load

loadExpenses(); // loads the page after code at the top has run

populateYearOption();
