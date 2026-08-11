const SETTLEMENT_STORAGE_KEY = "monthSettlements";

let settlementsByMonth = {};

export const loadSettlements = () => {
    const storedSettlements = localStorage.getItem(SETTLEMENT_STORAGE_KEY);

    settlementsByMonth = storedSettlements
        ? JSON.parse(storedSettlements)
        : {};
};

const saveSettlements = () => {
    localStorage.setItem(
        SETTLEMENT_STORAGE_KEY,
        JSON.stringify(settlementsByMonth),
    );
};

export const getMonthSettlement = (monthKey) => {
    return settlementsByMonth[monthKey] || null;
};

export const settleMonth = (monthKey, settlement) => {
    settlementsByMonth[monthKey] = {
        monthKey,
        ...settlement,
        settled: true,
        settledAt: new Date().toISOString(),
    };

    saveSettlements();
};

export const markMonthUnsettled = (monthKey) => {
    const settlement = getMonthSettlement(monthKey);

    if (!settlement || !settlement.settled) return;

    settlement.settled = false;
    saveSettlements();
};

export const clearMonthSettlement = (monthKey) => {
    if (!getMonthSettlement(monthKey)) return;

    delete settlementsByMonth[monthKey];
    saveSettlements();
};
