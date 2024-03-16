class Target extends Marking { // stop is going to be a polygon that sits on top of the road
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

    }

    draw(ctx) {
        this.center.draw(ctx, { color: "red", size: 40 });
        this.center.draw(ctx, { color: "white", size: 30 });
        this.center.draw(ctx, { color: "red", size: 20 });
        this.center.draw(ctx, { color: "white", size: 10 });
    }

}