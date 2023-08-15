const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Canvas settings
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 4;
// ctx.lineCap = 'round';

//These set a path for a line, but don't render anything
// ctx.beginPath();
// ctx.moveTo(100,200); //drawing line from coordinates (100,200)
// ctx.lineTo(400,500); //to coordinates (400,500)

//Stroke draws path
// ctx.stroke();

//We want to create many animated paths that will flow around the canvas
//Each particle moves around and we connect the points with lines
//We'll use this particles class as a blueprint whenever we need to create a new particle object
class Particle {
    constructor(effect) {
        this.effect = effect; //pointing toward main effect object
        this.x = Math.floor(Math.random() * this.effect.width); //accessing effect width
        this.y = Math.floor(Math.random() * this.effect.height); //accessing effect height
    }
    //each particle will have a public draw method that expects context to specify the canvas we want to draw on
    draw(context) {
        context.fillRect(this.x, this.y, 10, 10);
    }
}

//Main brain of this code base - one effect and many particles
//We'll use this effect class to manage the effect; all particles at once
class Effect {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.particles = []; //array that holds all initialized particles in array
        this.numberOfParticles = 50;
        this.init();  //pushes new particle into array
    }
    init() {
        //create particles
        for (let i = 0; i < this.numberOfParticles; i++)
        this.particles.push(new Particle(this)); //pushes new particle into array; this refers to entire effect class
    }
    render(context) {
        this.particles.forEach(particle => {
            particle.draw(context);
        })
    }
}

//creating an instance of effect class
const effect = new Effect(canvas.width, canvas.height);
effect.render(ctx);
console.log(effect);