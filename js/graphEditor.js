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
            if (event.button == 2) { // button 2 is right click of mousedown
                if (this.hovered) {
                    this.#removePoint(this.hovered); // private method in this graphEditor file, down below
                }
            }
            if (event.button == 0) { // button 0 is left click
                const mouse = new Point(event.offsetX, event.offsetY); // X and Y coordinates of mouse click. offsetX and offsetY are properties of mouseEvent object in JS, when using Canvas
                if (this.hovered) {
                    this.selected = this.hovered;
                    return; // return stops the following lines addPoint and this.selected = mouse just overwriting this if statement
                }
                this.graph.addPoint(mouse);
                this.selected = mouse;
                this.hovered = mouse; // we only remove points with hover over so we need this initialized here e.g. clicking to create a new point then immediately deleting it
            }
        });

        this.canvas.addEventListener("mousemove", (event) => {
            const mouse = new Point(event.offsetX, event.offsetY); // capturing the live mouse x and y position and hovered state triggers with a threshold of 14
            this.hovered = getNearestPoint(mouse, this.graph.points, 14); // so you'll know if you click here whether it'll create a new point or highlight an existing one
        });

        this.canvas.addEventListener("contextmenu", (event) => event.preventDefault()); // stops the browser right click menu popping up when right clicking
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