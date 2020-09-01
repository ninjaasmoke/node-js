import rectangle from './rect';

function solveRect(l, b) {
    console.log("Solving rec: l = " + l + " b = " + b);
    if (l <= 0 || b <= 0) {
        console.log("Wrong dimensions");
    } else {
        console.log("Area of rect  = " + rectangle(l, b));
    }
}

solveRect(2, 8);