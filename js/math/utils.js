function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER) { // get the point closest to where the mouse click location was, threshold is max by default but overwritten in graphEditor.js
    let minDist = Number.MAX_SAFE_INTEGER; // start by initializing to an extremely large number - just reassign after that
    let nearest = null;
    for (const point of points) {
        const dist = distance(point, loc);
        if (dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = point;
        }
    }
    return nearest;
}

function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y); // pythagorean theorem
}

function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}