class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    addPoint(point) {
        this.points.push(point);
    }

    containsPoint(point) {
        return this.points.find((p) => p.equals(point)); // loops through array of points 'p' and sees if given 'point' equals any point in that array. we don't want 2 points in the same coordinates.
    }

    tryAddPoint(point) {
        if (!this.containsPoint(point)) { // we don't add the point to the graph point array until we check that it isn't the same coordinates as something already there (containsPoint)
            this.addPoint(point);
            return true;
        }
        return false;
    }

    addSegment(seg) {
        this.segments.push(seg);
    }

    draw(ctx) { // simple draw method: loop through each segment in the segments array and draw on the canvas context
        for (const seg of this.segments) {
            seg.draw(ctx);
        }

        for (const point of this.points) {
            point.draw(ctx);
        }
    }
}