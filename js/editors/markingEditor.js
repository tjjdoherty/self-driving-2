class MarkingEditor {
    constructor(viewport, world, targetSegments) {
        this.viewport = viewport;
        this.world = world; // store the viewport and world as object attributes

        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext("2d"); // same constructor stuff as the graph Editor

        this.mouse = null;
        this.intent = null;

        this.targetSegments = targetSegments;

        this.markings = world.markings;
    }

    // to be overwritten
    createMarking(center, directionVector) { // road width etc is supplied by the stop and crossing signs because they differ from each other (stop is 1/2 roadwidth, crossing is roadwidth etc)
        return center;
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
            this.targetSegments,
            15 * this.viewport.zoom // 15 is the threshold - a larger value will make it snap onto something from further away
        );
        if (seg) {
            const proj = seg.projectPoint(this.mouse);
            if (proj.offset >= 0 && proj.offset <= 1) {
                this.intent = this.createMarking( // the hover over will project a new Stop sign - what does it need?? the point location, the direction vector (which side of the road), road Width
                    proj.point,
                    seg.directionVector()
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