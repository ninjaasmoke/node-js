module.exports = (x, y, callback) => {
    if (x <= 0 || y <= 0) {
        setTimeout(() => {
            callback(new Error("Dimensions can't be less than or equal to zero"), null);
        }, 2000);
    } else {
        setTimeout(() => {
            callback(null, {
                // perimeter: (x, y) => { return 2 * (x + y) }, 
                perimeter: () => { return 2 * (x + y) },  // closure
                // area: (x, y) => { return x * y },
                area: () => { return x * y }, // closure
            });
        }, 2000);
    }
}
