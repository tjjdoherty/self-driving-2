class Polygon {
    constructor(points) {
        this.points = points;
        this.segments = [];
        for (let i = 1; i <= points.length; i++) {
            this.segments.push(
                new Segment(points[i - 1], points[i % points.length]) // when i = length, i % points.length will return 0 so it loops back to connect w the first point;
            )
        }
    }

    static union(polygons) {
        Polygon.multiBreak(polygons);
        const keptSegments = []; // we are now going to isolate the segments that aren't locked inside intersections with other polygons and keep them, removing the overlaps
        for (let i = 0; i < polygons.length; i++) {
            for (const seg of polygons[i].segments) {
                let keep = true;
                for (let j = 0; j < polygons.length; j++) {
                    if (i != j) {
                        if (polygons[j].containsSegment(seg)) {
                            keep = false;
                            this.break;
                        }
                    }
                }
                if (keep) {
                    keptSegments.push(seg)
                }
            }
        }
        return keptSegments;
    }
    
    static multiBreak(polygons) { // going through the array of polygons and finding the intersection breaks between each one.
        for (let i = 0; i < polygons.length - 1; i++) {
            for (let j = i + 1; j < polygons.length; j++) {
                Polygon.break(polygons[i], polygons[j]);
            }
        }
    }

    static break(poly1, poly2) { // this method breaks the segments of each polygon at their intersection points
        const segs1 = poly1.segments;
        const segs2 = poly2.segments;
        for (let i = 0; i < segs1.length; i++) {
            for (let j = 0; j < segs2.length; j++) {
                const int = getIntersection(
                    segs1[i].p1, segs1[i].p2, segs2[j].p1, segs2[j].p2
                );

                if (int && int.offset != 1 && int.offset != 0) {
                    const point = new Point(int.x, int.y);
                    let aux = segs1[i].p2; // this is keeping the original segment end point for making a new segment from where the intersection begins
                    segs1[i].p2 = point;
                    segs1.splice(i + 1, 0, new Segment(point, aux)); // we are just inserting a new segment between where the intersection of poly1 and poly2 is, and the end of old poly2
                    
                    aux = segs2[j].p2; // same with poly2 segments now, we can just re assign aux variable
                    segs2[j].p2 = point;
                    segs2.splice(j + 1, 0, new Segment(point, aux));
                }
            } // removed the return intersections - we don't need to return intersection points, we just need break to break up the overlapping area of the polygons
        }
    }

    containsSegment(seg) {
        const midPoint = average(seg.p1, seg.p2);
        return this.containsPoint(midPoint);
    }

    containsPoint(point) {
        const outerPoint = new Point(-1000, -1000); // a very remote far away point - if the line segment for outerPoint and point intersects the polygon an odd number of times, we're INSIDE the polygon
        let intersectionCount = 0;
        for (const seg of this.segments) {
            const int = getIntersection(outerPoint, point, seg.p1, seg.p2); // does the line segment between outerpoint and point intersect any of the segments of the polygon?
            if (int) {
                intersectionCount++;
            }
        }
        return intersectionCount % 2 == 1; // modulo 2 remainder one is a check for ODD NUMBERS, odd number of intersections means point is inside the polygon

    }

    drawSegments(ctx) {
        for (const seg of this.segments) {
            seg.draw(ctx, { color: getRandomColor(), width: 5 })
        }
    }

    draw(ctx, { stroke = "blue", lineWidth = 2, fill = "rgba(0, 0, 255, 0.3)" } = {}) {
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}