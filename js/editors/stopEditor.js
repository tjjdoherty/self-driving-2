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
        this.boundMouseDown = this.#handleMouseDown.bind(this); // need to store the binds as attributes, otherwise this.#method.bind(this) just creates a new copy in the remove listener method
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.boundContextMenu = (event) => event.preventDefault();

        this.canvas.addEventListener("mousedown", this.boundMouseDown); // bind(this) helps keep 'this' in the right place - this refers to the graph editor. without bind here, this refers to myCanvas
        this.canvas.addEventListener("mousemove", this.boundMouseMove);
        this.canvas.addEventListener("contextmenu", this.boundContextMenu); // stops the browser right click menu popping up
    }

    #removeEventListeners() {
        this.canvas.removeEventListener("mousedown", this.boundMouseDown); // bind(this) helps keep 'this' in the right place - this refers to the graph editor. without bind here, this refers to myCanvas
        this.canvas.removeEventListener("mousemove", this.boundMouseMove);
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu); // stops the browser right click menu popping up
    }

    #handleMouseMove(event) { // this method will snap a stop sign to the road segments - much easier than trying to manually put it in exact the right angle on the roads
        this.mouse = this.viewport.getMouse(event);
        const seg = getNearestSegment(
            this.mouse,
            this.world.graph.segments, // segments is in graph which is in world which is supplied to stopEditor constructor
            14 * this.viewport.zoom
        );
        if (seg) {
            this.intent = seg;
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