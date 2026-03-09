const CalculateAmount = (transactions, key) => {
    const currentDate = new Date();
    const lastTwelveMonthsAmount = [];
  
    for (let i = 0; i < 12; i++) {
      const month = currentDate.getMonth() - i;
      const year = currentDate.getFullYear();
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.initiated_at);
        return (
          transactionDate.getMonth() === month &&
          transactionDate.getFullYear() === year
        );
      });
      const monthAmount = monthTransactions.reduce(
        (total, transaction) => total + transaction[key],
        0
      );
      lastTwelveMonthsAmount.push(monthAmount);
    }
  
    return lastTwelveMonthsAmount;
  };
  
  
  module.exports = {
    CalculateAmount,
  };
  