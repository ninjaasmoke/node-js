// import { perimeter, area } from "./rect";
var rect = require("./rect")

function solveRect(l, b) {
    console.log("Solving for rectangle: l = " + l + " and b = " + b);

    if (l <= 0 || b <= 0) {
        console.log("Rect dimensions not proper");
    } else {
        console.log("Rect perimeter: " + rect.perimeter(l, b));
        console.log("Rect area: " + rect.area(l, b));
    }
}

solveRect(2, 1);
solveRect(2, 2);
solveRect(0, -12);