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
const monthYear = document.querySelector("#year-select");
const MonthSelect = document.querySelector("#month-select");
const monthPicker = document.querySelector(".month-picker");

// ==========================================================================

// 2.) App state / data

let expenseArray = [];

// these are used to switch the save transaction button to edit transaction
let editMode = false; // this is the default status of the button set to save the transaction
let selectedExpenseId = null; // this is to check if the expense exists. if it doesn't have an ID, it will save the transaction. if it has an id it will edit the existing expense

// ==========================================================================

// .3) Setup values

let dateNow = new Date();
let formattedDate = dateNow.toISOString().split("T")[0]; // converting date
dateForm.value = formattedDate;
const currentMonthKey = new Date().toISOString().slice(0, 7);

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
    const storageData = localStorage.getItem("storeExpense"); // converts string to object so i can get the data and use it
    if (storageData) {
        expenseArray = JSON.parse(storageData);
    }
};

// Modal Functions

const openEditExpenseModal = (expense) => {
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
    modalTransaction.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const hideModal = () => {
    modalTransaction.classList.add("hidden");
    overlay.classList.add("hidden");
};

// Render Functions

const groupExpenseYearMonth = () => {
    const expenseMonth = Object.groupBy(expenseArray, (expense) => {
        return expense.date.slice(0, 7);
    });

    return expenseMonth;
};

const formatMonthYear = (monthKey) => {
    const [year, month] = monthKey.split("-");
    const monthName = monthsArray[Number(month) - 1];

    return `${monthName} ${year}`;
};

const renderMonthExpenses = (monthKey) => {
    const groupedExpenses = groupExpenseYearMonth();
    const monthExpenses = groupedExpenses[monthKey] || [];

    expenseList.innerHTML = "";

    monthExpenses.forEach((expense) => {
        createExpenseElement(expense);
    });
};

const createExpenseElement = (expense) => {
    // create and append expense-group dom
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
    const expenseToEdit = expenseArray.find((expense) => {
        return expense.id === selectedExpenseId;
    });

    if (!expenseToEdit) return;

    expenseToEdit.title = titleForm.value;
    expenseToEdit.date = dateForm.value;
    expenseToEdit.paid = userNameForm.value;
    expenseToEdit.amount = Number(amountForm.value);

    localStorage.setItem("storeExpense", JSON.stringify(expenseArray));

    renderMonthExpenses(currentMonthKey);
};

const removeExpense = () => {
    const expenseIndex = expenseArray.findIndex((expense) => {
        return expense.id === selectedExpenseId;
    });

    if (expenseIndex !== -1) {
        expenseArray.splice(expenseIndex, 1);
    }

    localStorage.setItem("storeExpense", JSON.stringify(expenseArray));

    renderMonthExpenses(currentMonthKey);
};

//  Functions

const calculateMonthExpensesAmount = (totalMonth) => {
    const groupedExpenseObject = groupExpenseYearMonth();
    const monthExpensesArray = groupedExpenseObject[totalMonth];
    const totalSpentMonth = monthExpensesArray.reduce((acc, num) => {
        return acc + num;
    }, 0);
    console.log(totalSpentMonth);
};

const calculateTotalExpenses = (monthKey) => {
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
    showModal();
});

closeBtn.addEventListener("click", function () {
    hideModal();
});

deleteTransactionBtn.addEventListener("click", function () {
    removeExpense();
    modalTransaction.classList.add("hidden");
    overlay.classList.add("hidden");
});

expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (editMode) {
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
    monthPicker.classList.remove("hidden");
});

// ==========================================================================

// .6) Page load

loadExpenses();

renderMonthExpenses(currentMonthKey);

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
