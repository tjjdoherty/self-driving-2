class Building {
    constructor(poly, heightCoef = 0.4) {
        this.base = poly;
        this.heightCoef = heightCoef;
    }

    draw(ctx, viewPoint) {
        this.base.draw(ctx, { fill: "white", stroke: "#AAA" });
    }
}