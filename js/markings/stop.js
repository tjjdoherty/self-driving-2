class Stop { // stop is going to be a polygon that sits on top of the road
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
    }

    draw(ctx) {
        this.poly.draw(ctx);
    }

}