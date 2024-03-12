class CrossingEditor { // this is nearly a copy of the StopEditor with some important differences
    constructor(viewport, world) {
        this.viewport = viewport;
        this.world = world;

        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext("2d");

        this.mouse = null;
        this.intent = null;

        this.markings = world.markings;
    }

    enable() {
        this.#addEventListeners();
    }

    disable() {
        this.#removeEventListeners();
    }

    #addEventListeners() {
        this.boundMouseDown = this.#handleMouseDown.bind(this); // need to store the binds as attributes, otherwise in remove listener, this.#method.bind(this) creates a unique copy, doesn't remove
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.boundContextMenu = (event) => event.preventDefault();

        this.canvas.addEventListener("mousedown", this.boundMouseDown); // bind(this) helps keep 'this' in the right place - this refers to the graph editor. without bind here, this refers to myCanvas
        this.canvas.addEventListener("mousemove", this.boundMouseMove);
        this.canvas.addEventListener("contextmenu", this.boundContextMenu);
    }

    #removeEventListeners() {
        this.canvas.removeEventListener("mousedown", this.boundMouseDown);
        this.canvas.removeEventListener("mousemove", this.boundMouseMove);
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
    }

    #handleMouseMove(event) { // snap a crossing to the road segment
        this.mouse = this.viewport.getMouse(event);
        const seg = getNearestSegment(
            this.mouse,
            this.world.graph.segments,
            15 * this.viewport.zoom // 15 is the threshold - a larger value will make it snap onto something from further away
        );
        if (seg) {
            const proj = seg.projectPoint(this.mouse);
            if (proj.offset >= 0 && proj.offset <= 1) {
                this.intent = new Crossing(
                    proj.point,
                    seg.directionVector(),
                    world.roadWidth, // for crossings, the entire roadwidth is needed - not only half like stop signs
                    world.roadWidth / 2 // this is height of the polygon
                );
            }
            } else {
                this.intent = null;
            }
        }

    #handleMouseDown(event) {
        if (event.button == 0) { // click button 0 is left click
            if (this.intent) {
                this.markings.push(this.intent);
                this.intent = null;
            }
        }
        if (event.button == 2) { // right click
            for (let i = 0; i < this.markings.length; i++) {
                const poly = this.markings[i].poly; // because markings comes from this.intent which is from stop which is from the poly method of an envelope (create a polygon)
                if (poly.containsPoint(this.mouse)) {
                    this.markings.splice(i, 1);
                    return;
                }
            }
        }
    }

    display() {
        if (this.intent) {
            this.intent.draw(this.ctx);
        }
    }

}