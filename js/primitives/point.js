class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // constructor takes x and y parameters so the object knows where it is. simple as that
    
    // x and y are the coordinates of the arc's center, but here 0 and 2*Pi is 360 degrees - a completed circular point. Angle in radians

    draw(ctx, size = 18, color = "black") {
        const rad = size / 2;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);   // arc takes FIVE arguments, sixth optional counterclockwise: x, y, radius, startAngle, endAngle, counterclockwise
        ctx.fill();
    }
}