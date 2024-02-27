class Viewport {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.zoom = 1;
        
        this.#addEventListeners();
    }

    getMouse(event) {
        return new Point(
            event.offsetX * this.zoom,
            event.offsetY * this.zoom
        );
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousewheel", this.#handleMouseWheel.bind(this));
    }

    #handleMouseWheel(event) {
        const dir = Math.sign(event.deltaY); // did you zoom in or out?
        const step = 0.1;
        this.zoom += dir * step; // we want low mouse sensitivity, or atleast values that we can control - defined step above to add with direction of mouse wheel movement
        this.zoom = Math.max(1, Math.min(5, this.zoom)); // keeps zoom between 1 and 5
    }
}