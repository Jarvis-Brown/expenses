// .3) Setup values

import { dateInput } from "./dom.js";
import { groupExpenseYearMonth } from "./expenses.js";

const dateNow = new Date(); // creates a date object for current date
const formattedDate = dateNow.toISOString().split("T")[0]; // converting date
dateInput.value = formattedDate;
export const currentMonthKey = new Date().toISOString().slice(0, 7); // Stores the current month as "YYYY-MM" (this is 7 spots)

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

export const availableMonthKeys = () => {
    const monthAvailable = Object.keys(groupExpenseYearMonth());
    //let monthList = monthAvailable.filter(month);

    //monthAvailable.slice(0, 4);
    return monthAvailable;
};
