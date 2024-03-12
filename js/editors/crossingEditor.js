class CrossingEditor extends MarkingEditor { // this is nearly a copy of the StopEditor with some important differences
    constructor(viewport, world) {
        super(viewport, world, world.graph.segments)
    }

    createMarking(center, directionVector) {
        return new Crossing(
            center,
            directionVector,
            world.roadWidth,
            world.roadWidth / 2
        );
    }

}