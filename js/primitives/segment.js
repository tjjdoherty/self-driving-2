class Segment {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    length() {
        return distance(this.p1, this.p2);
    }

    directionVector() {
        return normalize(subtract(this.p2, this.p1)); // literally just the modulus of the distance between two points - is this a negative or positive value?
    }
    
    equals(seg) {
        return this.includes(seg.p1) && this.includes(seg.p2); // includes helper method below tests if the point is either at p1 or p2 of the arc
    }

    includes(point) {
        return this.p1.equals(point) || this.p2.equals(point); // this helper function clean up the equals function for later. Checks (p1, p2) and (p2, p1) segment match
    }

    distanceToPoint(point) {
        const proj = this.projectPoint(point);
        if (proj.offset > 0 && proj.offset < 1) {
           return distance(point, proj.point);
        }
        const distToP1 = distance(point, this.p1);
        const distToP2 = distance(point, this.p2);
        return Math.min(distToP1, distToP2);
     }
     
    projectPoint(point) {
        const a = subtract(point, this.p1);
        const b = subtract(this.p2, this.p1);
        const normB = normalize(b); // just turns b into a positive (modulus)
        const scaler = dot(a, normB);
        const proj = {
           point: add(this.p1, scale(normB, scaler)),
           offset: scaler / magnitude(b),
        };
        return proj;
    }

    draw(ctx, { width = 2, color = "black", dash = []} = {}) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.setLineDash(dash); // this is for showing the user the projected segment they're about to make as a dashed line 
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
        ctx.setLineDash([]); // reset dash to default solid line
    }
}