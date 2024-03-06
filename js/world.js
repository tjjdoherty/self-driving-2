class World {
    constructor(graph, 
        roadWidth = 100,
        roadRoundness = 10,
        buildingWidth = 150,
        buildingMinLength = 150,
        spacing = 50,
        treeSize = 40
    ) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;
        this.treeSize = treeSize;

        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = [];
        this.trees = [];

        this.generate();
    }

    generate() {
        this.envelopes.length = 0; // we always start by clearing the envelopes because we are running World in an animation loop that reoccurs 60 fps
        for (const seg of this.graph.segments) {
            this.envelopes.push(
                new Envelope(seg, this.roadWidth, this.roadRoundness)
            );
        }

        this.roadBorders = Polygon.union(this.envelopes.map((envelope) => envelope.poly));
        this.buildings = this.#generateBuildings();
        this.trees = this.#generateTrees();
    }

    #generateTrees() {
        const points = [
            ...this.roadBorders.map((segment) => [segment.p1, segment.p2]).flat(), 
            ...this.buildings.map((building) => building.points).flat() // we are using array.map and flat() on segments and buildings to get one giant array of individual points for x and y coordinates
        ];
        const left = Math.min(...points.map((point) => point.x)); // left, right, top and bottom are just finding the absolute max and min x and y values to create a zone where trees...
        const right = Math.max(...points.map((point) => point.x)); // can be randomly placed using the lerp function in the next block (while tryCount) below
        const top = Math.min(...points.map((point) => point.y));
        const bottom = Math.max(...points.map((point) => point.y));

        const illegalPolys = [
            ...this.buildings,
            ...this.envelopes.map((envelope) => envelope.poly)
        ];

        const trees = [];
        let tryCount = 0;

        while (tryCount < 50) {
            const p = new Point(
                lerp(left, right, Math.random()), // placement of tree coordinates is random within a specified region using lerp - lerp will return somewhere between the top and bottom for the tree to go
                lerp(top, bottom, Math.random())  // do this with top & bottom, and left & right, and you have your x and y coordinates within a specific zone for the tree point
            );

            let keep = true;
            for (const poly of illegalPolys) {
                if (poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize / 2) { // checking that a tree isn't inside a road / building polygon
                    keep = false;
                    break;
                }
            }

            if (keep) {
                for (const tree of trees) {
                    if (distance(tree.center, p) < this.treeSize) { // basically, if this current tree centre point is within the treeSize radius of an existing tree...
                        keep = false;
                        break;
                    }
                }
            }

            // we are checking if the tree is nearby a building or road before placing it - don't waste memory on a tree far away from everything
            if (keep) {
                let closeToSomething = false;
                for (const poly of illegalPolys) {
                    if (poly.distanceToPoint(p) < this.treeSize * 4) {
                        closeToSomething = true;
                        break;
                    }
                }
                keep = closeToSomething;
            }

            if (keep) {
                trees.push(new Tree(p, this.treeSize));
                tryCount = 0;
            }
            tryCount++;
        }
        return trees;
    }

    #generateBuildings() {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(
                    seg,
                    this.roadWidth + this.buildingWidth + this.spacing * 2, // making a much larger envelope to place buildings inside, alongside the roads
                    this.roadRoundness
                )
            );
        }

        const guides = Polygon.union(tmpEnvelopes.map((envelope) => envelope.poly))
        
        for (let i = 0; i < guides.length; i++) {
            const seg = guides[i];
            if (seg.length() < this.buildingMinLength) {
                guides.splice(i, 1); // if this segment is smaller than the building minimum length to place something, remove it from the guides array
                i--; // push i back one because we've removed an item, it will i++ when we re-loop and we'll have the new element in the same index
            }
        }

        const supports = [];
        for (let seg of guides) {
            const len = seg.length() + this.spacing;
            const buildingCount = Math.floor(
                len / (this.buildingMinLength + this.spacing) // how many buildings can we fit along this support line, given we will take spacing between buildings too?
            );
            const buildingLength = len / buildingCount - this.spacing; // the actual length of one building when taking the spacing out

            const dir = seg.directionVector();

            let q1 = seg.p1;
            let q2 = add(q1, scale(dir, buildingLength)); // to create q2 (the end point of the building length, we need dir (just a +1 or -1) and buildingLength)
            supports.push(new Segment(q1, q2));

            for (let i = 2; i <= buildingCount; i++) {
                q1 = add(q2, scale(dir, this.spacing)); // this is adding the space between two buildings
                q2 = add(q1, scale(dir, buildingLength));
                supports.push(new Segment(q1, q2));
            }
        }

        const bases = [];
        for (const seg of supports) {
            bases.push(new Envelope(seg, this.buildingWidth).poly);
        }

        const eps = 0.001; // some floating point imprecision with spacing that was leaving valid sites for buildings out
        for (let i = 0; i < bases.length; i++) {
            for (let j = i + 1; j < bases.length; j++) {
                if (
                    bases[i].intersectsPoly(bases[j]) || 
                    bases[i].distanceToPoly(bases[j]) < this.spacing - eps // see const eps a few lines above
                ) { // checking if base i and j clash with one another, intersectsPoly is in polygon.js
                    bases.splice(j, 1);
                    j--;
                }
            }
        }

        return bases;
    }

    draw(ctx, viewPoint) {
        for (const env of this.envelopes) {
            env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
        }
        for (const seg of this.graph.segments) {
            seg.draw(ctx, { color: "white", width: 4, dash: [10, 10]}) // dashed lines in middle of roads
        }
        for (const seg of this.roadBorders) {
            seg.draw(ctx, {color: "white", width: 4 });
        }
        for (const tree of this.trees) {
            tree.draw(ctx, viewPoint); // we don't need the styles for the tree draw anymore as it's stored within the tree.js file
        }
        for (const building of this.buildings) {
            building.draw(ctx);
        }
    }
}