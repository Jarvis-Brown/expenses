// .3) Setup values

import { dateInput, yearSelect, monthSelect, monthYearSelect } from "./dom.js";
import { groupExpenseYearMonth, renderMonthExpenses } from "./expenses.js";

const dateNow = new Date(); // creates a date object for current date
const formattedDate = dateNow.toLocaleDateString("en-CA"); // local YYYY-MM-DD date
dateInput.value = formattedDate;
export const currentMonthKey = formattedDate.slice(0, 7);

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

export const formatMonthYear = (monthKey) => {
    // cuts off the day to only show the month and year
    const [year, month] = monthKey.split("-");
    const monthName = monthsArray[Number(month) - 1];

    return `${monthName} ${year}`;
};

export const formatMonthName = (monthKey) => {
    const [, month] = monthKey.split("-");
    const monthName = monthsArray[Number(month) - 1];

    return monthName;
};

export const availableMonthKeys = () => {
    // checks if the months have expenses in it
    const monthAvailable = Object.keys(groupExpenseYearMonth());
    return monthAvailable;
};

export const availableYearKeys = () => {
    // checks if the year has months that have expenses in it and makes it into an array. removes duplicate months
    const monthKeys = availableMonthKeys();
    const yearKeysFormat = monthKeys.map((monthKey) => {
        return monthKey.slice(0, 4);
    });
    const uniqueYear = [...new Set(yearKeysFormat)];

    return uniqueYear;
};

export const populateYearOption = () => {
    const years = availableYearKeys();

    yearSelect.innerHTML = '<option value="">Select year</option>';

    years.forEach((year) => {
        const yearOption = document.createElement("option");
        yearOption.value = year;
        yearOption.textContent = year;
        yearSelect.append(yearOption);
    });
};

export const availableMonthsForYear = (selectYear) => {
    const monthKeys = availableMonthKeys();
    const filteredMonths = monthKeys.filter((monthKey) => {
        return monthKey.slice(0, 4) === selectYear;
    });
    return filteredMonths;
};

export const populateMonthOption = (selectedYear) => {
    // creating year options to select
    const months = availableMonthsForYear(selectedYear);

    monthSelect.innerHTML = '<option value="">Select month</option>';

    months.forEach((month) => {
        const monthName = formatMonthName(month);
        const monthOption = document.createElement("option");
        monthOption.value = month;
        monthOption.textContent = monthName;
        monthSelect.append(monthOption);
    });
};

export const monthYearSelectName = (monthKey) => {
    monthYearSelect.textContent = formatMonthYear(monthKey);
};

export const showSelectedMonthExpenses = () => {
    const selectedMonth = monthSelect.value;
    renderMonthExpenses(selectedMonth);
    monthYearSelectName(selectedMonth);
};

// need to attach the selection of the year to the months available.

// need an array of months with expenses in it. need to check if month has an expense in it,
