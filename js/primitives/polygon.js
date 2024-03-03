class Polygon {
    constructor(points) {
        this.points = points;
        this.segments = [];
        for (let i = 1; i <= points.length; i++) {
            this.segments.push(
                new Segment(points[i - 1], points[i % points.length]) // when i = length, i % points.length will let the segment loop back to the beginning of the array of points - it returns 0;
            )
        }
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