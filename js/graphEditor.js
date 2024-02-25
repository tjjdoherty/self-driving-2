class GraphEditor {
    constructor(canvas, graph) {
        this.canvas = canvas;
        this.graph = graph;

        this.ctx = this.canvas.getContext("2d");

        this.selected = null; // if no new point has been clicked onto the graph then by default no point is selected, null
        this.hovered = null;

        this.#addEventListeners();
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", (event) => {
            const mouse = new Point(event.offsetX, event.offsetY); // this is the X and Y coordinates of the mouse click. offsetX and offsetY are specific properties of the MouseEvent object in JavaScript
            this.hovered = getNearestPoint(mouse, this.graph.points, 14); // if I click on the map to highlight a given point, the method needs the mouse click event and all existing points
            if (this.hovered) {
                this.selected = this.hovered;
                return; // return stops the following lines addPoint and this.selected = mouse just overwriting this if statement
            }
            this.graph.addPoint(mouse);
            this.selected = mouse;
        });

        this.canvas.addEventListener("mousemove", (event) => {
            const mouse = new Point(event.offsetX, event.offsetY); // mousemove event is used to hover over points without any click, same x/y coordinate logic as mousedown
            this.hovered = getNearestPoint(mouse, this.graph.points, 14); // so you'll know if you click here whether it'll create a new point or highlight an existing one
        });
    }

    display() {
        this.graph.draw(this.ctx);
        if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true });
        }
        if (this.selected) {
            this.selected.draw(this.ctx, { outline: true }); // pass properties in an object, see point.js
        }
    }
}