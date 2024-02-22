class Segment {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    equals(seg) {
        return this.includes(seg.p1) && this.includes(seg.p2); // includes helper method below tests if the point is either at p1 or p2 of the arc
    }

    includes(point) {
        return this.p1.equals(point) || this.p2.equals(point); // this helper function clean up the equals function for later. Checks (p1, p2) and (p2, p1) segment match
    }

    draw(ctx, width = 2, color = "black") {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
    }
}