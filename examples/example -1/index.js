// import { perimeter, area } from "./rect";
// var rect = require("./rect")

// function solveRect(l, b) {
//     console.log("Solving for rectangle: l = " + l + " and b = " + b);

//     if (l <= 0 || b <= 0) {
//         console.log("Rect dimensions not proper");
//     } else {
//         console.log("Rect perimeter: " + rect.perimeter(l, b));
//         console.log("Rect area: " + rect.area(l, b));
//     }
// }

// solveRect(2, 1);
// solveRect(2, 2);
// solveRect(0, -12);


var rect = require("./rect")

function solveRect(l, b) {
    console.log("Solving for rectangle: l = " + l + " and b = " + b);

    rect(l, b, (err, rectangle) => {
        if (err) {
            console.log("\nERROR: ", err.message);
        } else {
            console.log("\nL : " + l + " and B : " + b);
            console.log("Area : " + rectangle.area());
            console.log("Perimeter : " + rectangle.perimeter());
        }
    });

    console.log("\nAfter async call to rect\n");
}

solveRect(2, 1);
solveRect(2, 2);
solveRect(0, -12);