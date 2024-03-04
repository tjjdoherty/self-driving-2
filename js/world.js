class World {
    constructor(graph, 
        roadWidth = 100,
        roadRoundness = 10,
        buildingWidth = 150,
        buildingMinLength = 150,
        spacing = 50
    ) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;

        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = [];

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
                i--; // have to push i back one because we've removed an item, if we keep i the same and delete an element we'll have the new one in the same space
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

        for (let i = 0; i < bases.length; i++) {
            for (let j = i + 1; j < bases.length; j++) {
                if (bases[i].intersectsPoly(bases[j])) { // checking if base i and j clash with one another, intersectsPoly is in polygon.js
                    bases.splice(j, 1);
                    j--;
                }
            }
        }

        return bases;
    }

    draw(ctx) {
        for (const env of this.envelopes) {
            env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
        }
        for (const seg of this.graph.segments) {
            seg.draw(ctx, { color: "white", width: 4, dash: [10, 10]}) // dashed lines in middle of roads
        }
        for (const seg of this.roadBorders) {
            seg.draw(ctx, {color: "white", width: 4 });
        }
        for (const building of this.buildings) {
            building.draw(ctx);
        }
    }
}