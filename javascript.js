// 1.) Select Elements

// Expense Transaction BG

const transactionGroupBg = document.querySelector(".transaction-group-bg");
const expenseList = document.querySelector(".expense-list");

// nav bar

const userImg = document.querySelector(".user-image");
const userNavImg = document.querySelector(".user-nav-image");
const hamburger = document.querySelector(".hamburger");

// money and images display

const userLeftImg = document.querySelector(".user-left-img");
const userRightImg = document.querySelector(".user-right-img");
const transactionFinalTotal = document.querySelector(
    ".transaction-final-total",
);
const transactionNum = document.querySelector(".transactions-num");
const totalSpentNumAll = document.querySelector(".total-spent-num-all");

// add expenses

const addTransactionBtn = document.querySelector(".add-transaction-btn");
const saveTransactionBtn = document.querySelector(".save-transaction-btn");
const deleteTransactionBtn = document.querySelector(".delete-transaction-btn");
const closeBtn = document.querySelector(".close-btn");
const modalTransaction = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

// values of the form

const titleForm = document.getElementById("form-title");
const userNameForm = document.getElementById("user-name-select");
const amountForm = document.getElementById("form-amount");
const dateForm = document.getElementById("form-expense-date");
const expenseForm = document.getElementById("expense-form");

// calendar
const monthYearSelect = document.querySelector(".month-year-select");
const yearSelect = document.querySelector("#year-select");
const monthSelect = document.querySelector("#month-select");
const monthYearPicker = document.querySelector(".month-year-picker");

// ==========================================================================

// 2.) App state / data

let expenseArray = []; // expenses added to array

// these are used to switch the save transaction button to edit transaction
let editMode = false; // this is the default status of the button set to save the transaction
let selectedExpenseId = null; // this is to check if the expense exists. if it doesn't have an ID, it will save the transaction. if it has an id it will edit the existing expense

// ==========================================================================

// .3) Setup values

let dateNow = new Date(); // creates a date object for current date
let formattedDate = dateNow.toISOString().split("T")[0]; // converting date
dateForm.value = formattedDate;
const currentMonthKey = new Date().toISOString().slice(0, 7); // Stores the current month as "YYYY-MM" (this is 7 spots)

const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// ==========================================================================

// .4) Storage Functions

const loadExpenses = () => {
    // function to load all expenses
    const storageData = localStorage.getItem("storeExpense"); // converts string to object so i can get the data and use it
    if (storageData) {
        // if expenses exist in local storage, convert back to an object and places the expense object into the array
        expenseArray = JSON.parse(storageData);
    }
};

// Modal Functions

const openEditExpenseModal = (expense) => {
    // open edit modal screen version
    showModal();
    deleteTransactionBtn.classList.remove("hidden");

    titleForm.value = expense.title;
    dateForm.value = expense.date;
    userNameForm.value = expense.paid;
    amountForm.value = expense.amount;

    editMode = true;
    selectedExpenseId = expense.id; // edit this specific expense

    saveTransactionBtn.innerText = "Edit Transaction";
};

const showModal = () => {
    // Displays the add/edit expense modal.
    modalTransaction.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const hideModal = () => {
    // Hides the add/edit expense modal off
    modalTransaction.classList.add("hidden");
    overlay.classList.add("hidden");
};

// Render Functions

const groupExpenseYearMonth = () => {
    // groups the expenses by month and year. cuts off the day
    // Returns an object where each key is a month (YYYY-MM)
    // and the value is an array of expenses for that month.
    const expenseMonth = Object.groupBy(expenseArray, (expense) => {
        return expense.date.slice(0, 7);
    });

    return expenseMonth;
};

const formatMonthYear = (monthKey) => {
    // cuts off the day to only show the month and year
    const [year, month] = monthKey.split("-");
    const monthName = monthsArray[Number(month) - 1];

    return `${monthName} ${year}`;
};

const renderMonthExpenses = (monthKey) => {
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

const updateSelectedExpense = () => {
    // updates a selected expense
    const expenseToEdit = expenseArray.find((expense) => {
        return expense.id === selectedExpenseId;
    });

    if (!expenseToEdit) return;

    expenseToEdit.title = titleForm.value;
    expenseToEdit.date = dateForm.value;
    expenseToEdit.paid = userNameForm.value;
    expenseToEdit.amount = Number(amountForm.value);

    localStorage.setItem("storeExpense", JSON.stringify(expenseArray)); // updates local storage expense data

    renderMonthExpenses(currentMonthKey);
};

const removeExpense = () => {
    // deletes the expense
    const expenseIndex = expenseArray.findIndex((expense) => {
        return expense.id === selectedExpenseId;
    });

    if (expenseIndex !== -1) {
        expenseArray.splice(expenseIndex, 1);
    }

    localStorage.setItem("storeExpense", JSON.stringify(expenseArray));

    renderMonthExpenses(currentMonthKey); // renders the current time
};

//  Functions

const calculateMonthExpensesAmount = (totalMonth) => {
    // calculates the monthly expense amount
    const groupedExpenseObject = groupExpenseYearMonth();
    const monthExpensesArray = groupedExpenseObject[totalMonth];
    const totalSpentMonth = monthExpensesArray.reduce((acc, num) => {
        return acc + num;
    }, 0);
    console.log(totalSpentMonth);
};

const calculateTotalExpenses = (monthKey) => {
    // calculates the total number of expenses in the month
    const groupedExpenseObject = groupExpenseYearMonth();
    const monthExpenseArray = groupedExpenseObject[monthKey] || [];
    const totalMonthExpenseArray = monthExpenseArray.length;
    return totalMonthExpenseArray;
};

// always shows the latest month, if previous month was not settled add a reminder to the modal

// need to tie it to the modal

// ==========================================================================

// .5) Event Listeners

addTransactionBtn.addEventListener("click", function () {
    // shows transaction modal when button clicked
    showModal();
});

closeBtn.addEventListener("click", function () {
    hideModal(); // closes modal when button clicked
});

deleteTransactionBtn.addEventListener("click", function () {
    //deletes expense when button clicked
    removeExpense();
    modalTransaction.classList.add("hidden");
    overlay.classList.add("hidden");
});

expenseForm.addEventListener("submit", function (e) {
    // adds new expense to the array
    e.preventDefault();

    if (editMode) {
        // checks if expense already exists and if so, it updates the existing expense
        updateSelectedExpense();
    } else {
        const addExpense = {
            id: Date.now(),
            title: titleForm.value,
            paid: userNameForm.value,
            amount: Number(amountForm.value),
            date: dateForm.value,
        };
        expenseArray.push(addExpense);
        renderMonthExpenses(currentMonthKey);
    }

    localStorage.setItem("storeExpense", JSON.stringify(expenseArray));

    hideModal();
});

monthYearSelect.addEventListener("click", function () {
    // show the month and year selector after pressing month year button
    monthYearPicker.classList.remove("hidden");
});

const availableMonthKeys = () => {
    const monthAvailable = Object.keys(groupExpenseYearMonth());
    //let monthList = monthAvailable.filter(month);

    //monthAvailable.slice(0, 4);
};

// check to see if the year exists in the list
// add those years to the yearSelect
// add it up with the month selected

// yearSelect
// monthSelect

// ==========================================================================

// .6) Page load

loadExpenses(); // loads the page after code at the top has run

//renderMonthExpenses(currentMonthKey);
renderMonthExpenses("2026-02");

// need to calculate all the expenses in the expense group and add it to the main display

/*  - 1.) need to find out what day and month an expense was added
    - 2.) group all expenses to that month
    - 3.) if its a new month, add transaction-top group div to make a new line with total spent and expenses

    - 4.) need a settle up button to clear the top box number and arrows to owe money
    - 5.) find out how much was spent in that month
    - 6.) find out how many expenses are in that month
    - 7.) find the difference in who owes who , i need the paid and amount from th expense array

    - 8.) showcase an an arrow from the person that owes
    - 
*/
