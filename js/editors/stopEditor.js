class StopEditor {
    constructor(viewport, world) {
        this.viewport = viewport;
        this.world = world; // store the viewport and world as object attributes

        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext("2d"); // same constructor stuff as the graph Editor

        this.mouse = null;
        this.intent = null;
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
        this.canvas.addEventListener("contextmenu", this.boundContextMenu); // stops the browser right click menu popping up
    }

    #removeEventListeners() {
        this.canvas.removeEventListener("mousedown", this.boundMouseDown);
        this.canvas.removeEventListener("mousemove", this.boundMouseMove);
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
    }

    #handleMouseMove(event) { // this method will snap a stop sign to the road segments - much easier than trying to manually put it in exact the right angle on the roads
        this.mouse = this.viewport.getMouse(event);
        const seg = getNearestSegment(
            this.mouse,
            this.world.laneGuides,
            15 * this.viewport.zoom // 15 is the threshold - a larger value will make it snap onto something from further away
        );
        if (seg) {
            const proj = seg.projectPoint(this.mouse);
            if (proj.offset >= 0 && proj.offset <= 1) {
                this.intent = new Stop( // the hover over will project a new Stop sign - what does it need?? the point location, the direction vector (which side of the road), road Width
                    proj.point,
                    seg.directionVector(),
                    world.roadWidth / 2,
                    world.roadWidth / 2
                );
            }
            } else {
                this.intent = null;
            }
        }

    #handleMouseDown(event) {

    }

    display() {
        if (this.intent) {
            this.intent.draw(this.ctx);
        }
    }

}