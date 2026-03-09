function TransactionIdGenerator() {
    // Generate 5 random uppercase letters
    const letters = [...Array(5)].map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    // Generate 5 random digits
    const digits = [...Array(5)].map(() => Math.floor(Math.random() * 10)).join('');
    // Concatenate "TRAX" with letters and digits
    const transactionId = `TRAX${letters}${digits}`;
    return transactionId;
}

// Example usage:
module.exports=TransactionIdGenerator;
