function formatCurrency(amount) {
    if (!amount) return "";    
    if (isNaN(amount)) return "";
    
    if (amount >= 1000000000) {
        return "$" + (amount / 1000000000).toFixed(2) + "B";
    } else if (amount >= 1000000) {
        return "$" + (amount / 1000000).toFixed(2) + "M";
    } else if (amount >= 1000) {
        return "$" + (amount / 1000).toFixed(2) + "k";
    } else {
        return "$" + amount;
    }
}