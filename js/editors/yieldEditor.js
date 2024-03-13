class YieldEditor extends MarkingEditor {
    constructor(viewport, world) {
        super(viewport, world, world.laneGuides); 
        /* 
        By adding extends Marking Editor all constructor and methods of StopEditor isn't needed anymore, it's all housed in MarkingEditor and inherited from there
        We just overwrite the create marking that's unique to Stop
        */
    }

    createMarking(center, directionVector) {
        return new Yield(
            center,
            directionVector,
            world.roadWidth / 2,
            world.roadWidth / 2
        );
    }

}