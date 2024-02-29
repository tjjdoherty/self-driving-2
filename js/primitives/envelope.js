class Envelope {
    constructor(skeleton, width) {
        this.skeleton = skeleton; // this is called storing as an attribute
        this.poly = this.#generatePolygon(width);
    }

    #generatePolygon(width) {
        const { p1, p2 } = this.skeleton; // this is the destructuring assignment - i don't have to say "this.skeleton.p1" or p2 now, just p1 or p2 for shorthand

        const radius = width / 2;
        const alpha = angle(subtract(p1, p2)) // this is the arc tangent method to find the angle between p1 and p2, I put it in utils as I have subtract there already
        const alpha_cw = alpha + Math.PI / 2;
        const alpha_ccw = alpha - Math.PI / 2; // these are points that are offset by 90 degrees clockwide and counter-clockwise from the original point
        const p1_ccw = translate(p1, alpha_ccw, radius); // take p1, offset it by rotation and multiply by the radius of the road size you want.
        const p2_ccw = translate(p2, alpha_ccw, radius);
        const p1_cw = translate(p1, alpha_cw, radius);
        const p2_cw = translate(p2, alpha_cw, radius);

        // the points above with a thin single segment between p1 and p2 into a road with two sides by multiplying the angle out by the radius - get a rectangle instead of a straight line

        return new Polygon([p1_ccw, p2_ccw, p2_cw, p1_cw]); // this order is important - otherwise you make strange shapes around p1 p2
    }

    draw(ctx) {
        this.poly.draw(ctx);
    }
}