// Modal Functions

import {
    modalTransaction,
    overlay,
    deleteTransactionBtn,
    saveTransactionBtn,
    titleInput,
    dateInput,
    userNameSelect,
    amountInput,
    expenseForm,
} from "./dom.js";

import { setEditMode, setSelectedExpenseId } from "./state.js";

export const showModal = () => {
    // Displays the add/edit expense modal.
    // Always start in "add" mode. openEditExpenseModal fills the form and
    // switches the state back to edit mode immediately after this call.
    expenseForm.reset();
    dateInput.value = new Date().toLocaleDateString("en-CA");
    deleteTransactionBtn.classList.add("hidden");
    saveTransactionBtn.innerText = "Save Transaction";
    setEditMode(false);
    setSelectedExpenseId(null);

    modalTransaction.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

export const openEditExpenseModal = (expense) => {
    // open edit modal screen version
    showModal();
    deleteTransactionBtn.classList.remove("hidden");

    titleInput.value = expense.title;
    dateInput.value = expense.date;
    userNameSelect.value = expense.paid;
    amountInput.value = expense.amount;

    setEditMode(true);
    setSelectedExpenseId(expense.id); // edit this specific expense

    saveTransactionBtn.innerText = "Edit Transaction";
};

export const hideModal = () => {
    // Hides the add/edit expense modal off
    modalTransaction.classList.add("hidden");
    overlay.classList.add("hidden");
};
