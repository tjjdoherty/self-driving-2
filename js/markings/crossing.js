class Crossing extends Marking { // stop is going to be a polygon that sits on top of the road
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);
        
        this.borders = [this.poly.segments[2], this.poly.segments[0]];
    }

    draw(ctx) {
        const perp = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2))
        );
        line.draw(ctx, { // these are the draw methods of the segment Class
            width: this.height,
            color: "white",
            dash: [10,10]
        });
    }

}