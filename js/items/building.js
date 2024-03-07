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
        this.base.draw(ctx, { fill: "white", stroke: "#AAA" });
        ceiling.draw(ctx, { fill: "white", stroke: "#AAA" });
    }
}