class Tree {
    constructor(center, size, height = 0.07) {
        this.center = center;
        this.size = size; // size of the base
        this.height = height; // by default its 0.06, i have cacti in a desert setting so they aren't very big
        this.base = this.#generateLevel(center, size); // need the base drawn separately - this is what the car will potentially collide with
    }

    #generateLevel(point, size) {
        const points = [];
        const rad = size / 2;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) { // looping round the entire circle using 2Pi at an angle, 32 points
            const semiRandom = Math.cos(((angle + this.center.x) * size) % 17) ** 2; // cosine is between -1 and 1, **2 is ^2 => val between 0 and 1, angle + center gives variation, from video 6/11 19m00s

            const noisyRadius = rad * lerp(0.5, 1, semiRandom); // make some random deviation in the radius using lerp and random - keeps it between 0.5 and 1
            points.push(translate(point, angle, noisyRadius));
        }
        return new Polygon(points); // drawing a new polygon just needs the points, and the polygon.js will create the segments in that file
    }

    draw(ctx, viewPoint) {
        const diff = subtract(this.center, viewPoint)
        
        const top = add(this.center, scale(diff, this.height)) // adding a segment with an offset for the 3d effect

        const levelCount = 5;
        for (let level = 0; level < levelCount; level++) { // we don't need to draw the center explicitly because the center is just level 0 of this loop
            const t = level / (levelCount - 1);
            const point = lerp2D(this.center, top, t);
            const color = "rgb(85," + lerp(50, 180, t) + ", 30)"; // to make incrementally lighter shades of green, we use lerp on the G in rgb, it will go between 50 and 200 G. R and B are fixed
            const size = lerp(this.size, 30, t);
            const poly = this.#generateLevel(point, size);
            poly.draw(ctx, { fill: color, stroke: "rgba(0,0,0,0)" });
        }
        
    }
}