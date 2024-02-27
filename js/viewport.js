class Viewport {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.zoom = 1;
        this.center = new Point(canvas.width / 2, canvas.height / 2); 
        this.offset = scale(this.center, -1); // this just inverts the offset of the middle of the canvas so our points are in view when we start

        this.pan = {
            start: new Point(0,0),
            end: new Point(0,0),
            offset: new Point(0,0),
            active: false
        }
        
        this.#addEventListeners();
    }

    getMouse(event) {
        return new Point(
            (event.offsetX - this.center.x) * this.zoom - this.offset.x, // this.offset.x and y updates the mouse position after panning so the new Point draws are in the right place
            (event.offsetY - this.center.y) * this.zoom - this.offset.y
        );
    }

    getOffset() {
        return add(this.offset, this.pan.offset);
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
        this.canvas.addEventListener("mouseup", this.#handleMouseUp.bind(this));
        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
        this.canvas.addEventListener("mousewheel", this.#handleMouseWheel.bind(this));
    }

    #handleMouseDown(event) {
        if (event.button == 2) {  // I'm implementing panning using right click hold, Left click = 0; middle = 1;
            this.pan.start = this.getMouse(event);
            this.pan.active = true;
        }
    }

    #handleMouseMove(event) {
        if (this.pan.active) {
            this.pan.end = this.getMouse(event); // where is the mouse moving whilst being clicked?
            this.pan.offset = subtract(this.pan.end, this.pan.start); // simple vector calculation to find the net move of the pan
        }
    }

    #handleMouseUp(event) {
        if (this.pan.active) {
            this.offset = add(this.offset, this.pan.offset);
            this.pan = {
                start: new Point(0,0),
                end: new Point(0,0),
                offset: new Point(0,0),
                active: false // we reset the pan to 0 after storing the net offset in this.viewport.offset, which will change the view position
            }
        }
    }

    #handleMouseWheel(event) {
        const dir = Math.sign(event.deltaY); // did you zoom in or out?
        const step = 0.1;
        this.zoom += dir * step; // we want low mouse sensitivity, or atleast values that we can control - defined step above to add with direction of mouse wheel movement
        this.zoom = Math.max(1, Math.min(5, this.zoom)); // keeps zoom between 1 and 5
    }
}