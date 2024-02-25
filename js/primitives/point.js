class Point {
    constructor(x, y) { // constructor takes x and y parameters so the object knows where it is. simple as that
        this.x = x;
        this.y = y;
    }

    equals(point) {
        return this.x == point.x && this.y == point.y;
    }

    draw(ctx, { size = 18, color = "black", outline = false } = {} ) { // the more props a method has, the harder it is to remember the order... pass them as an object, you just name specific ones you need
        const rad = size / 2;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);   
        ctx.fill();
        if (outline) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "white";
            ctx.arc(this.x, this.y, rad * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    /* arc takes FIVE arguments, sixth optional counterclockwise: x, y, radius, startAngle, endAngle, counterclockwise
    x and y are arc centre coordinates, 0 - 2 Pi(radians) is 360 degrees. A complete circular point.
    */
}