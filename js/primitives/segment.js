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

    draw(ctx, { width = 2, color = "black", dash = []} = {}) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.setLineDash(dash); // this is for showing the user the projected segment they're about to make as a dashed line 
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
        ctx.setLineDash([]); // reset dash to default solid line
    }
}