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

function scale(p, scaler) {
    return new Point(p.x * scaler, p.y * scaler);
}

function translate(location, angle, offset) {
    return new Point(
        location.x + Math.cos(angle) * offset, // this is the trigonometric circle, with x coordinate we use cosine
        location.y + Math.sin(angle) * offset // with y coordinate its the sine
    );
}

function angle(p) {
    return Math.atan2(p.y, p.x); // arc tangent method, used in envelope to subtract p2.x from p1.x and p2.y from p1.y
}

function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <=1 && u >=0 && u <=1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}

function lerp(A,B,t) {
    // t is a percentage between the start point A and endpoint B
    return (A + (B-A) * t);
}