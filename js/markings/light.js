class Light extends Marking { // stop is going to be a polygon that sits on top of the road
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.border = this.poly.segments[2]; // this is the top border of the polygon drawn - the stopping line cars must stop before!
    }

    draw(ctx) {
        this.border.draw(ctx, { width: 5, color: "white" });
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI / 2); // subtract half Pi = 90 degrees rotation, for driving on the RHS. Make it + for driving on LHS :)
        ctx.scale(1, 3); // ctx scale takes x and y coords - y is 3 to stretch it vertically like the stop writing you see on roads in real life

        ctx.beginPath();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "bold " + this.height * 0.3 + "px Arial";
        ctx.fillText("L", 0, 1); // 0,1 are coordinates of where to put the fill text but we translate/rotate/scaled above, so nothing here just 1 in y for very slight adjustment/offset.

        ctx.restore();
    }

}