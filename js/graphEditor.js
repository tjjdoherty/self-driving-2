class GraphEditor {
    constructor(canvas, graph) {
        this.canvas = canvas;
        this.graph = graph;

        this.ctx = this.canvas.getContext("2d");

        this.selected = null; // if no new point has been clicked onto the graph then by default no point is selected, null

        this.#addEventListeners();
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", (evt) => {
            const mouse = new Point(evt.offsetX, evt.offsetY); // this is the X and Y coordinates of the mouse click. offsetX and offsetY are specific properties of the MouseEvent object in JavaScript
            this.graph.addPoint(mouse);
            this.selected = mouse;
        });
    }

    display() {
        this.graph.draw(this.ctx);
        if (this.selected) {
            this.selected.draw(this.ctx, { outline: true }); // pass properties in an object, see point.js
        }
    }
}