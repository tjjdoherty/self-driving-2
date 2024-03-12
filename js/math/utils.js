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

function getNearestSegment(loc, segments, threshold = Number.MAX_SAFE_INTEGER) { // get the point closest to where the mouse click location was, threshold is max by default but overwritten in graphEditor.js
    let minDist = Number.MAX_SAFE_INTEGER; // start by initializing to an extremely large number - just reassign after that
    let nearest = null;
    for (const seg of segments) {
        const dist = seg.distanceToPoint(loc);
        if (dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = seg;
        }
    }
    return nearest;
}

function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y); // pythagorean theorem
}

function average(p1, p2) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
 }

function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

function scale(p, scaler) { // a vector between 0 and 1 in magnitude
    return new Point(p.x * scaler, p.y * scaler);
}

function normalize(p) {
    return scale(p, 1 / magnitude(p)); // look at scale immediately above - normalize determines whether its a + or -  in the x or y axis direction e.g. -50 * 1/50, or 100 * 1/100
}

function magnitude(p) {
    return Math.hypot(p.x, p.y); // using pythagorean theorem to find coordinates without the negative sign
}

function perpendicular(point) {
    return new Point(-point.y, point.x); // try this for 2 coords - original x coord becomes -y and original y becomes x, do it with two points makes the line perpendicular
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

    const eps = 0.001;
    if (Math.abs(bottom) > eps) { // checking if bottom isn't zero sometimes gets bugged by floating point imprecision, instead we check if bottom is > than a very small eps value
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

function lerp2D(A, B, t) { // this uses lerp to create a 3d effect from a 2d object or point
    return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
}

function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ", 100%, 60%)";
}

function getFake3dPoint(point, viewPoint, height) { // get the points for top of building side walls, roofs, or trees
    const dir = normalize(subtract(point, viewPoint)); // we only want the direction of the tree/building relative to viewpoint, so first we normalize
    const dist = distance(point, viewPoint); // we need the distance between centre of object and viewPoint
    const scaler = Math.atan(dist / 300) / (Math.PI / 2); // divide arc tangent (half Pi) by half Pi value between 0 and 1 - How much do we scale between 0 (directly above tree) and 1 (tree far away)?
    
    return add(point, scale(dir, height * scaler)); 
}