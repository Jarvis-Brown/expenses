// Expense Transaction BG

const transactionGroupBg = document.querySelector(".transaction-group-bg");

// nav bar

const userImg = document.querySelector(".user-image");

const userNavImg = document.querySelector(".user-nav-image");

const hamburger = document.querySelector(".hamburger");

// money and images display

const userLeftImg = document.querySelector(".user-left-img");
const userRightImg = document.querySelector(".user-right-img");

const transactionAllNum = document.querySelector(".transaction-final-total");

const transactionNum = document.querySelector(".transactions-num");

const totalSpentNum = document.querySelector(".total-spent-num");
//const month;

// add expenses

const addTransactionBtn = document.querySelector(".add-transaction-btn");

const closeBtn = document.querySelector(".close-btn");

const modalTransaction = document.querySelector(".modal");

const overlay = document.querySelector(".overlay");

addTransactionBtn.addEventListener("click", function () {
    modalTransaction.classList.remove("hidden");
    overlay.classList.remove("hidden");
});

closeBtn.addEventListener("click", function () {
    modalTransaction.classList.add("hidden");
    overlay.classList.add("hidden");
});

// values of the form

const titleForm = document.getElementById("form-title");
const userNameForm = document.getElementById("user-name-select");
const amountForm = document.getElementById("form-amount");
const dateForm = document.getElementById("form-expense-date");
const expenseForm = document.getElementById("expense-form");

let dateNow = new Date();
let formattedDate = dateNow.toISOString().split("T")[0];
dateForm.value = formattedDate;

let expenseArray = [];

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

const storageData = localStorage.getItem("storeExpense"); // converts string to object so i can get the data and use it
if (storageData) {
    expenseArray = JSON.parse(storageData);
}

const createExpenseElement = (expense) => {
    // create and append expense-group dom
    const expenseTitle = document.createElement("h5");
    const expenseDate = document.createElement("h6");
    const expenseUserPaid = document.createElement("h6");
    const expenseCost = document.createElement("h6");
    const expenseGroup = document.createElement("div");
    const expenseLeft = document.createElement("div");

    expenseGroup.classList.add("expense-group");
    transactionGroupBg.appendChild(expenseGroup);

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

    console.log(expense);
};

expenseArray.forEach((expense) => {
    createExpenseElement(expense);
});

expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const addExpense = {
        title: titleForm.value,
        paid: userNameForm.value,
        amount: Number(amountForm.value),
        date: dateForm.value,
    };

    expenseArray.push(addExpense);

    localStorage.setItem("storeExpense", JSON.stringify(expenseArray)); // local storage needs to be converted to string to be stored

    modalTransaction.classList.add("hidden");
    overlay.classList.add("hidden");

    createExpenseElement(addExpense);
});

let groupedExpenses = {};

expenseArray.forEach((expense) => {
    const dateSplit = expense.date.split("-");
    const dateYear = dateSplit[0];
    const dateMonth = dateSplit[1];
    const dateDay = dateSplit[2];
    const monthIndex = Number(dateMonth) - 1; //
    const dateMonthName = monthsArray[monthIndex];

    const monthYear = `${dateMonthName} ${dateYear}`;

    if (!groupedExpenses[monthYear]) {
        // creates a monthYear folder array if it doesnt exist in groupExpenses
        groupedExpenses[monthYear] = []; // creates the empty array
    }

    groupedExpenses[monthYear].push(expense); // pushes empty array to groupExpenses object

    console.log(`${dateMonthName} ${dateYear}`);
});

// const groupedExpenseLength = groupedExpenses[monthYear].length;
console.log(groupedExpenses);

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
