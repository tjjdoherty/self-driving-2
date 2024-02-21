class Point {
    constructor(x, y) { // constructor takes x and y parameters so the object knows where it is. simple as that
        this.x = x;
        this.y = y;
    }

    equals(point) {
        return this.x == point.x && this.y == point.y;
    }

    draw(ctx, size = 18, color = "black") { 
        const rad = size / 2;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);   
        ctx.fill();
    }
    /* arc takes FIVE arguments, sixth optional counterclockwise: x, y, radius, startAngle, endAngle, counterclockwise
    x and y are arc centre coordinates, 0 - 2 Pi(radians) is 360 degrees. A complete circular point.
    */
}