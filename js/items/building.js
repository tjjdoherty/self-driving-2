class Building {
    constructor(poly, heightCoef = 0.4) {
        this.base = poly;
        this.heightCoef = heightCoef;
    }

    draw(ctx, viewPoint) {
        const topPoints = this.base.points.map((point) => 
            add(point, scale(subtract(point, viewPoint), this.heightCoef)) // topPoints just defining the rooftop corners by adding new points, scaled/offset from the viewpoint for the 3d effect
        );
        const ceiling = new Polygon(topPoints); // then we just create a new polygon with those four points added in the map method

        const sides = []; // each sides will be a four sided polygon made up of two points from the base and two from the ceiling
        for (let i = 0; i < this.base.points.length; i++) {
            const nextI = (i + 1) % this.base.points.length; // the modulo % length of an array just lets you loop around to the first point using the last one
            const poly = new Polygon([
                this.base.points[i], this.base.points[nextI], // the two points of the base
                ceiling.points[nextI], ceiling.points[i] // the two points of the ceiling, it should go base i -> i + 1 -> ceiling i + 1 -> i
            ]);
            sides.push(poly);
        }

        this.base.draw(ctx, { fill: "white", stroke: "#AAA" });
        for (const side of sides) {
            side.draw(ctx, { fill: "white", stroke: "#AAA" }) // NOTICE - it's ceiling.points and side.draw not THIS.side.draw because side isn't in the constructor / props
        }
        ceiling.draw(ctx, { fill: "white", stroke: "#AAA" });
    }
}