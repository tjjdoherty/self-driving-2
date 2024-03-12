class Crossing { // stop is going to be a polygon that sits on top of the road
    constructor(centre, directionVector, width, height) {
        this.centre = centre;
        this.directionVector = directionVector;
        this.width = width;
        this.height = height;

        this.support = new Segment(
            translate(centre, angle(directionVector), height / 2),
            translate(centre, angle(directionVector), -height / 2)
        )

        this.poly = new Envelope(this.support, width, 0).poly;

        this.borders = [this.poly.segments[2], this.poly.segments[0]];
    }

    draw(ctx) {
        const perp = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.centre, scale(perp, this.width / 2)),
            add(this.centre, scale(perp, -this.width / 2))
        );
        line.draw(ctx, { // these are the draw methods of the segment Class
            width: this.height,
            color: "white",
            dash: [10,10]
        });
    }

}