// 2.) App state / data

export let expenseArray = []; // expenses added to array

// these are used to switch the save transaction button to edit transaction
export let editMode = false; // this is the default status of the button set to save the transaction
export let selectedExpenseId = null; // this is to check if the expense exists. if it doesn't have an ID, it will save the transaction. if it has an id it will edit the existing expense

export const setExpenseArray = (newExpenseArray) => {
    expenseArray = newExpenseArray;
};

export const setEditMode = (newEditMode) => {
    editMode = newEditMode;
};

export const setSelectedExpenseId = (newExpenseId) => {
    selectedExpenseId = newExpenseId;
};
