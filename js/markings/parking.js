class Parking extends Marking { // stop is going to be a polygon that sits on top of the road
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.borders = [this.poly.segments[0], this.poly.segments[2]]; // this is the top border of the polygon drawn - the stopping line cars must stop before!
    }

    draw(ctx) {
        for (const border of this.borders) {
            border.draw(ctx, { width: 5, color: "white" });
        }
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector));

        ctx.beginPath();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "bold " + this.height * 0.9 + "px Arial";
        ctx.fillText("P", 0, 3); // 0,1 are coordinates of where to put the fill text but we translate/rotate/scaled above, so nothing here just 1 in y for very slight adjustment/offset.

        ctx.restore();
    }

}