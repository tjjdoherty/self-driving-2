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
        return guides;
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