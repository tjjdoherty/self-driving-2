class Marking { // stop is going to be a polygon that sits on top of the road
    constructor(center, directionVector, width, height) {
        this.center = center;
        this.directionVector = directionVector;
        this.width = width;
        this.height = height;

        this.support = new Segment(
            translate(center, angle(directionVector), height / 2),
            translate(center, angle(directionVector), -height / 2)
        )

        this.poly = new Envelope(this.support, width, 0).poly;

        // refactored stop and crossing using Marking - the border property is removed because each marking needs different borders, so the individual
    }

    draw(ctx) {
        this.poly.draw(ctx); // marking is the parent class so right now just draw the vanilla poly - styling will be unique to crossing and Stop so let those child classes customize there
    }

}