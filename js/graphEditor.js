class GraphEditor {
    constructor(canvas, graph) {
        this.canvas = canvas;
        this.graph = graph;

        this.ctx = this.canvas.getContext("2d");

        this.selected = null; // default hovered / selected points are null
        this.hovered = null;
        this.dragging = false;

        this.#addEventListeners();
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", (event) => {
            if (event.button == 2) { // mousedown button 2 is right click
                if (this.hovered) {
                    this.#removePoint(this.hovered); // private method used below
                } else {
                    this.selected = null; // DE-SELECT FUNCTION - When I right click whilst not hovering over a point, it will deselect my current point without deleting it
                }
            }
            if (event.button == 0) { // button 0 is left click
                const mouse = new Point(event.offsetX, event.offsetY); // X and Y coordinates of mouse click. offsetX and offsetY are properties of mouseEvent object in JS, when using Canvas
                if (this.hovered) {
                    this.#select(this.hovered);
                    this.dragging = true;
                    return;
                }
                this.graph.addPoint(mouse);
                this.#select(mouse);
                this.hovered = mouse; // we only remove points with hover over so we need this initialized here e.g. clicking to create a new point then immediately deleting it
            }
        });

        this.canvas.addEventListener("mousemove", (event) => {
            const mouse = new Point(event.offsetX, event.offsetY); // capturing the live mouse x and y position and hovered state on existing point triggers with a threshold of 14 px
            this.hovered = getNearestPoint(mouse, this.graph.points, 14);
            if (this.dragging == true) {
                this.selected.x = mouse.x;
                this.selected.y = mouse.y;
            }
        });

        this.canvas.addEventListener("contextmenu", (event) => event.preventDefault()); // stops the browser right click menu popping up
        this.canvas.addEventListener("mouseup", () => this.dragging = false); // release the left click button to stop dragging
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
            this.selected.draw(this.ctx, { outline: true }); // pass properties in an object, see point.js
        }
    }
}