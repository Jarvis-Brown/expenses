// .4) Storage Functions

import { expenseArray, setExpenseArray } from "./state.js";

export const loadExpenses = () => {
    // function to load all expenses
    const storageData = localStorage.getItem("storeExpense"); // gets the saved string data
    if (storageData) {
        /* if expenses exist in local storage, convert back to an object and places 
        the expense object into the array */
        setExpenseArray(
            JSON.parse(storageData),
        ); /* converts string to object so i can 
        get the data and use it and places it in the app state */
    }
};

export const saveExpenses = () => {
    localStorage.setItem("storeExpense", JSON.stringify(expenseArray));
};
