class Building {
    constructor(poly, heightCoef = 0.4) {
        this.base = poly;
        this.heightCoef = heightCoef;
    }

    draw(ctx, viewPoint) {
        const topPoints = this.base.points.map((point) => 
            add(point, scale(subtract(point, viewPoint), this.heightCoef * 0.6)) // topPoints just defining the rooftop corners by adding new points, scaled/offset from the viewpoint for the 3d effect
        );                                                                     // multiplied heightCoef by 0.6 because this is just the top of the side walls, we are adding pointed roofs now (topMidpoints)

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
        sides.sort(
            (a, b) =>
            b.distanceToPoint(viewPoint) - // take two polygons (the sides) subtracting the first from the second = reverse order. so the closest ones will be the last ones to draw (overwriting first ones)
            a.distanceToPoint(viewPoint)
        );

        const baseMidpoints = [
            average(this.base.points[0], this.base.points[1]), // find the average point between the two opposing sides of the base polygon
            average(this.base.points[2], this.base.points[3])
        ];

        const topMidpoints = baseMidpoints.map((point) => 
            add(point, scale(subtract(point, viewPoint), this.heightCoef)) // heightCoef is the top of the pointed roofs so the actual highest point now
        );

        const roofPolys = [
            new Polygon([
                ceiling.points[0], ceiling.points[3],
                topMidpoints[1], topMidpoints[0]
            ]),
            new Polygon([
                ceiling.points[2], ceiling.points[1],
                topMidpoints[0], topMidpoints[1]
            ])
        ]
        roofPolys.sort(
            (a, b) =>
            b.distanceToPoint(viewPoint) - // sometimes the roof poly tile at the back was being drawn second - we want the front one drawn last as it's the foreground
            a.distanceToPoint(viewPoint)
        );

        this.base.draw(ctx, { fill: "white", stroke: "rgba(0,0,0,0.2)", lineWidth: 18 });
        for (const side of sides) {
            side.draw(ctx, { fill: "white", stroke: "#AAA", lineWidth: 4 }) // NOTICE - it's ceiling.points and side.draw not THIS.side.draw because side isn't in the constructor / props
        }
        ceiling.draw(ctx, { fill: "white", stroke: "white", lineWidth: 6 });
        for (const poly of roofPolys) {
            poly.draw(ctx, { fill: "#D44", stroke: "#C44", lineWidth: 8, join: "round" }) 
        }
        // LEARNING - roofPolys.draw didn't work, because you tried to call a draw method on a one-off array just defined above which didn't have a draw method
        // you needed to for loop through the roofPolys because that lets you access each individual element in the array, which are polygons with a draw method defined (polygon.js).
    }
}