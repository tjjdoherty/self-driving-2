class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph;

        this.ctx = this.canvas.getContext("2d");

        this.selected = null; // default hovered / selected points are null
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;

        this.#addEventListeners();
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this)); // bind(this) helps keep 'this' in the right place - this refers to the graph editor. without bind here, this refers to myCanvas
        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));

        this.canvas.addEventListener("contextmenu", (event) => event.preventDefault()); // stops the browser right click menu popping up
        this.canvas.addEventListener("mouseup", () => this.dragging = false); // release the left click button to stop dragging
    }

    #handleMouseMove(event) {
        this.mouse = this.viewport.getMouse(event);
            this.hovered = getNearestPoint(this.mouse, this.graph.points, 14 * this.viewport.zoom);
            if (this.dragging == true) {
                this.selected.x = this.mouse.x;
                this.selected.y = this.mouse.y;
            }
    }

    #handleMouseDown(event) {
        if (event.button == 2) { // mousedown button 2 is right click
            if (this.selected) {
                this.selected = null;
            } else if (this.hovered) {
                this.#removePoint(this.hovered);
            }
            // right click logic priority: if you have a point selected, this is deselected first, only when no point is selected will you delete a point being hovered over.
        }
        if (event.button == 0) { // button 0 is left click
            if (this.hovered) {
                this.#select(this.hovered);
                this.dragging = true;
                return;
            }
            this.graph.addPoint(this.mouse);
            this.#select(this.mouse);
            this.hovered = this.mouse; // we only remove points with hover over so we need this initialized here e.g. clicking to create a new point then immediately deleting it
        }
    }

    #select(point) {
        if (this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }

    #removePoint(point) { // this calls removePoint as standard but also wipes seletced and hovered - point will disappear immediately once right clicked
        this.graph.removePoint(point);
        this.hovered = null;
        if (this.selected == point) { // this just helps if you have a point selected and one hovered, only the hovered one is deleted and you still have your selected highlighted, saves a user click
            this.selected = null;
        }
    }

    display() {
        this.graph.draw(this.ctx);
        if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true });
        }
        if (this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse; // intent will make the segment snap to existing points if hovering nearby - cleaner UI
            new Segment(this.selected, intent).draw(ctx, { dash: [4, 3] }); // Show the user the projected segment as a DASHED LINE, 3px for 3px space
            this.selected.draw(this.ctx, { outline: true }); // pass properties in an object, see point.js
        }
    }
}