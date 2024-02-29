class Envelope {
    constructor(skeleton, width, roundness = 10) {
        this.skeleton = skeleton; // this is called storing as an attribute
        this.poly = this.#generatePolygon(width, roundness);
    }

    #generatePolygon(width, roundness) {
        const { p1, p2 } = this.skeleton; // this is the destructuring assignment - i don't have to say "this.skeleton.p1" or p2 now, just p1 or p2 for shorthand

        const radius = width / 2;
        const alpha = angle(subtract(p1, p2)) // this is the arc tangent method to find the angle between p1 and p2, I put it in utils as I have subtract there already
        const alpha_cw = alpha + Math.PI / 2;
        const alpha_ccw = alpha - Math.PI / 2; // these are points that are offset by 90 degrees clockwide and counter-clockwise from the original point

        const points = [];
        const step = Math.PI / Math.max(1, roundness); // roundness is how many points around the end of the point we will make to round the road off
        for (let i = alpha_ccw; i <= alpha_cw; i += step) {
            points.push(translate(p1, i, radius)); // we are creating additional points around the ends of the points to round off the roads, PI is for the semi circular arc
        }
        for (let i = alpha_ccw; i <= alpha_cw; i += step) {
            points.push(translate(p2, Math.PI + i, radius)); // for p2 its on the other side of the polygon so 180 degrees different (PI + i)
        }

        // the points above with a thin single segment between p1 and p2 into a road with two sides by multiplying the angle out by the radius - get a rectangle instead of a straight line

        return new Polygon(points); // this order is important - otherwise you make strange shapes around p1 p2
    }

    draw(ctx) {
        this.poly.draw(ctx);
    }
}