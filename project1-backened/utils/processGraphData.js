const moment = require('moment');

/**
 * Processes transactions and buckets them by timeframe.
 * @param {Array} deposits - Array of deposit objects.
 * @param {Array} withdrawals - Array of withdrawal objects.
 * @param {string} timeframe - 'day', 'week', 'month'.
 * @param {string} startDate - Optional start date (ISO string).
 * @param {string} endDate - Optional end date (ISO string).
 * @returns {Object} { labels: [], deposits: [], withdrawals: [], totalDeposit: 0, totalWithdrawal: 0 }
 */
const processGraphData = (deposits, withdrawals, timeframe = 'month', startDate, endDate) => {
    let labels = [];
    let depositSeries = [];
    let withdrawSeries = [];
    let totalDeposit = 0;
    let totalWithdrawal = 0;

    let start, end;
    if (startDate && endDate) {
        start = moment(startDate).startOf('day');
        end = moment(endDate).endOf('day');
    } else {
        if (timeframe === 'day') {
            start = moment().subtract(29, 'days').startOf('day');
            end = moment().endOf('day');
        } else if (timeframe === 'week') {
            start = moment().subtract(11, 'weeks').startOf('week');
            end = moment().endOf('day');
        } else {
            // Default: last 12 months
            start = moment().subtract(11, 'months').startOf('month');
            end = moment().endOf('day');
        }
    }

    const format = timeframe === 'day' ? 'MMM DD' : timeframe === 'week' ? '[Week] WW' : 'MMM YYYY';
    const interval = timeframe === 'day' ? 'days' : timeframe === 'week' ? 'weeks' : 'months';

    let current = moment(start);
    while (current.isBefore(end) || current.isSame(end, interval)) {
        labels.push(current.format(format));

        const periodStart = moment(current).startOf(interval);
        const periodEnd = moment(current).endOf(interval);

        const periodDeposits = deposits.filter(d => {
            const date = moment(d.initiated_at);
            return date.isBetween(periodStart, periodEnd, null, '[]');
        });
        const periodWithdrawals = withdrawals.filter(w => {
            const date = moment(w.initiated_at);
            return date.isBetween(periodStart, periodEnd, null, '[]');
        });

        const dSum = periodDeposits.reduce((sum, d) => sum + (d.deposit_amount || 0), 0);
        const wSum = periodWithdrawals.reduce((sum, w) => sum + (w.withdraw_amount || 0), 0);

        depositSeries.push(dSum);
        withdrawSeries.push(wSum);

        current.add(1, interval);
    }

    // Calculate totals for the entire period
    totalDeposit = deposits.filter(d => moment(d.initiated_at).isBetween(start, end, null, '[]'))
        .reduce((sum, d) => sum + (d.deposit_amount || 0), 0);
    totalWithdrawal = withdrawals.filter(w => moment(w.initiated_at).isBetween(start, end, null, '[]'))
        .reduce((sum, w) => sum + (w.withdraw_amount || 0), 0);

    return {
        labels,
        deposits: depositSeries,
        withdrawals: withdrawSeries,
        totalDeposit,
        totalWithdrawal
    };
};

module.exports = processGraphData;
