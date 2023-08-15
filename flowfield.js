const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Canvas settings
// ctx.fillStyle = 'black';
// ctx.strokeStyle = 'black';
// ctx.lineWidth = 4;
// ctx.fillRect(x, y, 2, 2);


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
        this.speedX;
        this.speedY;
        this.speedModifier = Math.floor(Math.random() * 3 + 1)
        this.history = [{x: this.x, y: this.y}];
        this.maxLength = Math.floor(Math.random()* 200 + 10);
        this.angle = 0
        this.timer = this.maxLength;
        this.colors = ['#4c026b','#4bfac5','#f786d3', '#4c046b','#4bfac6','#f986d3'];
        // this.colors = ['#182b6e', '#253469', '#8a1313', '#691010','#2c700c','#224f0d'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
        this.lineWidths = [0.5,2,3,9]
        // this.lineWidths = [0.1,0.2,0.6,0.9,0.19,0.24,0.5] //for fur effect; also change number of particles
        // this.lineWidths = [0.4,0.8,1.6,3.6]
        this.lineWidth = this.lineWidths[Math.floor(Math.random() * this.colors.length)]
    }
    //each particle will have a public draw method that expects context to specify the canvas we want to draw on
    draw(context) {
        // context.fillRect(this.x, this.y, 10, 10);
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y);
        }
        context.lineWidth = this.lineWidth
        context.strokeStyle = this.color
        context.stroke();
    }
    update() {
        this.timer--;
        if (this.timer >= 1) {
            let x = Math.floor(this.x / this.effect.cellSize);
            let y = Math.floor(this.y / this.effect.cellSize);
            let index = y * this.effect.cols + x;
            this.angle = this.effect.flowField[index];
    
            this.speedX = Math.cos(this.angle) * this.speedModifier;
            this.speedY = Math.sin(this.angle) * this.speedModifier;
            this.x += this.speedX;
            this.y += this.speedY;
            
            this.history.push({x: this.x, y: this.y}) //push adds a new element to the end of an array
            if (this.history.length > this.maxLength) {
                this.history.shift(); //shift removes one element from beginning of array
            }
        }
    }
    reset(){
        this.x = Math.floor(Math.random() * this.effect.width)
        this.y = Math.floor(Math.random() * this.effect.height)
        this.history = [{x: this.x, y: this.y}]
    }
}

//Main brain of this code base - one effect and many particles
//We'll use this effect class to manage the effect; all particles at once
class Effect {
    constructor(width, height) {
        // this.color = ctx.strokeStyle
        this.width = width;
        this.height = height;
        this.particles = []; //array that holds all initialized particles in array
        this.numberOfParticles = 800; //changes number of particles
        // this.numberOfParticles = 50000; //changes number of particles (almost like fur)
        // this.numberOfParticles = 15000; //changes number of particles
        this.cellSize = 15;
        this.rows;
        this.cols;
        this.flowField = [];
        // this.curve = 1.5 //changes curve of flow field pattern
        this.curve = 1.5 //changes curve of flow field pattern
        this.zoom = 0.07; //changes zoom of flow field pattern
        this.init();  //pushes new particle into array
    }
    init() {
        //create flow field
        this.rows = Math.floor(this.height/this.cellSize);
        this.cols = Math.floor(this.width/this.cellSize);
        this.flowField = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++){
                let angle = (Math.cos(x*this.zoom ) + Math.sin(y*this.zoom ))*this.curve;// * this.curve);
                this.flowField.push(angle);
            }
            console.log(this.flowField)
        }

        //create particles
        for (let i = 0; i < this.numberOfParticles; i++)
            this.particles.push(new Particle(this)); //pushes new particle into array; this refers to entire effect class
    }
    render(context) {
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        })
    }
}

//creating an instance of effect class
const effect = new Effect(canvas.width, canvas.height);

console.log(effect);

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    effect.render(ctx);
    requestAnimationFrame(animate);
}

animate();