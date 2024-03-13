class Start extends Marking { // stop is going to be a polygon that sits on top of the road
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.img = new Image();
        this.img.src = "car.png";
    }

    draw(ctx) {
        const scale = 0.7;
        
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI / 2); // subtract half Pi = 90 degrees rotation, for driving on the RHS. Make it + for driving on LHS :)

        ctx.drawImage(this.img, -this.width / 2 * scale, -this.height / 2 * scale, this.width * scale, this.height * scale); // default canvas sets image start at top left corner so we offset by half its' width and height to go down the centre of the img
        ctx.restore();
    }

}