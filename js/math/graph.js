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

    removePoint(point) {
        const segs = this.getSegmentsWithPoint(point);
        for (const seg of segs) {
            this.removeSegment(seg); // this is removing every segment in segs, in which we collected the subset of segments that touch the point being removed
        }        
        this.points.splice(this.points.indexOf(point), 1); // splice method like with remove segment 
    }

    addSegment(seg) {
        this.segments.push(seg);
    }

    containsSegment(seg) {
        return this.segments.find((s) => s.equals(seg)); // stops adding segments between points where there is already a segment with both points
    }

    tryAddSegment(seg) {
        if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
            this.addSegment(seg);
            return true;
        }
        return false;
    }

    removeSegment(seg) {
        this.segments.splice(this.segments.indexOf(seg), 1); // splice is very powerful, with just two arguments it will remove the segment matching the index of seg, and only remove one item 
    }

    getSegmentsWithPoint(point) { // this method is just collecting any segment that touches the point which is being removed in removePoint (above). 
        const segs = []; // creating an empty array to put the segments to be deleted in removePoint
        for (const seg of this.segments) {
            if (seg.includes(point)) {
                segs.push(seg);
            }
        }
        return segs;
    }

    dispose() { // dispose of the graph entirely. Literally the graph will now reaed empty arrays so have nothing to draw on the canvas.
        this.points.length = 0;
        this.segments.length = 0;
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