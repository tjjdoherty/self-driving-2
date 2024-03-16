class Light extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, 20);

        this.state = "out";

        this.border = this.poly.segments[0]; // we are defining this border, [0] is the bottom border - cars must stop here when they detect it in the simulation!
    }

    draw(ctx) {
        const perp = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2))
        );

        const green = lerp2D(line.p1, line.p2, 0.2); // 0.2 just makes the green light appear at 20% of the way through the polygon
        const yellow = lerp2D(line.p1, line.p2, 0.5);
        const red = lerp2D(line.p1, line.p2, 0.8);


        new Segment(red, green).draw(ctx, { // you can create new instances of primitives eg segment like this, red -> green with lineCap rounds off the traffic lights and doesn't over extend them
            width: this.height,
            cap: "round"
        });

        green.draw(ctx, { size: this.height * 0.6, color: "#060" }); // dark green - light out
        yellow.draw(ctx, { size: this.height * 0.6, color: "#660" }); // dark yellow - light out
        red.draw(ctx, { size: this.height * 0.6, color: "#600" }); // dark red - light out

        switch (this.state) {
            case "green":
                green.draw(ctx, { size: this.height * 0.6, color: "#0F0" });
                break;
            case "yellow":
                yellow.draw(ctx, { size: this.height * 0.6, color: "#FF0" });
                break;
            case "red":
                red.draw(ctx, { size: this.height * 0.6, color: "#F00" });
                break;
        }
    }

}