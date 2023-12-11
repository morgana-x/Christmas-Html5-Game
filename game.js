var red = '#e53429';
var yellow = '#F7B028';
var pink = '#E097C2';
var bg = '#008000';
var white = '#fff';
var blue = '#3000'

const shape1 = '15,0 25,2 36,17 11,34 6,34 0,20 5,8';
const shape2 = '20,8 60,0 93,5 126,52 104,102 62,137 3,102 0,70';
const shape3 = '14,13 41,0 65,18 84,41 88,91 56,125 24,125 0,91 0,56';
const shape4 = '24,0 45,22 35,60 12,54 1,35 0,20';
const shape5 = '19,0 34,0 44,15 44,51 20,53 0,34';
const shape6 = '12,0 29,0 51,9 64,24 64,42 54,59 39,73 7,73 1,59 0,38';
const shape7 = '33,0 95,0 116,14 138,39 154,74 170,114 166,148 125,174 95,190 65,205 18,171 0,125 0,45';
var bg_music = new Audio('snd/bg_music.mp3')

bg_music.loop = true;

var musicplaying = false;
var started = false;
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;

// create an engine
var engine = Engine.create(),
    world = engine.world;

// create a renderer
var render = Render.create({
  element: document.getElementById('container'),
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: true, // need this or various render styles won't take
    background: pink,
    hasBounds: true
  }
});
// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: true
        }
      }
    });
var zoomAmount = 0.103
function updateZoom()
{
    var lookx =  (render.options.width/2);//-(mouse.position.x/2);//render.options.width/2;
    var looky = (render.options.height);//-(mouse.position.y/2);//render.options.height/2;
    if (zoomAmount >= 0.15)
    {
      lookx = render.options.width/2;
      looky = render.options.height;
    }
    Matter.Render.lookAt(render, Bodies.rectangle(lookx,looky, 10000 * zoomAmount, 10000 * zoomAmount))
}
updateZoom();
function onScroll(event)
{
    //event.preventDefault();

  zoomAmount += (event.deltaY/10000) // * -0.10;

  console.log(event.deltaY)
  // Restrict scale
  //zoomAmount =// Math.min(Math.max(0, zoomAmount), 1) / 1
  console.log(zoomAmount);
  if (zoomAmount < 0.005)
  {
    zoomAmount = 0.005
  }
  if (zoomAmount > 0.15)
  {
    zoomAmount = 0.15
  }
  updateZoom();
}



window.onwheel = onScroll;
render.canvas.style.left = "0px";
render.canvas.style.top = "0px";
render.canvas.style.position = "absolute";
var timeLeft = 12
var score = 0

function customShape(x, y, shape, color) {
    let vertices = Matter.Vertices.fromPath(shape);
    return Matter.Bodies.fromVertices(x, y, vertices, {
        // set options if you need them...
      //isStatic: true,
      mass: 500,
      render: { 
        fillStyle: color,
        lineWidth: 0
      }
    });
}

/*
var box1 = customShape(193, 296, shape1, blue);
var box2 = customShape(148, 254, shape2, pink);
var box3 = customShape(44, 251, shape3, yellow);
var box4 = customShape(179, 37, shape4, yellow);
var box5 = customShape(189, 101, shape5, pink);
var box6 = customShape(189, 158, shape6, yellow);
var box7 = customShape(85, 102, shape7, red);*/




// create two boxes and a ground
var ground = Bodies.rectangle(render.options.width/2, render.options.height +50, render.options.width, 100, { 
  isStatic: true,
  render: { fillStyle: white,}
});

/*var wallRight = Bodies.rectangle(render.options.width, render.options.height/2, 100, render.options.height, { 
  isStatic: true,
  render: { fillStyle: white,}
});

var wallLeft = Bodies.rectangle(0, render.options.height/2,100, render.options.height, { 
  isStatic: true,
  render: { fillStyle: white,}
});*/

// add all of the bodies to the world

screamsounds = []

screamsounds.push(new Audio('snd/m_scream_1.mp3'));
screamsounds.push(new Audio('snd/f_scream_1.mp3'));
screamsounds.push(new Audio('snd/wilhelm.mp3'))
deathsounds = []
deathsounds.push(new Audio('snd/splat.mp3'));
deathsounds.push(new Audio('snd/splat2.mp3'));
deathsounds.push(new Audio('snd/crack.mp3'));
World.add(engine.world,  [ground]);//, wallRight, wallLeft]);// [box1, box2, box3, box4, box5, box6, box7, ground, wallRight, wallLeft]);

var people = []
function spawnPerson(x,y,world){
    var boxA = Bodies.rectangle(x, y, 2, 3.5);
    stuff = [boxA]; 
    people.push(boxA)
    World.add(world, stuff);
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getRandomInt(min, max) {
    return Math.floor(getRandomArbitrary(min,max));
  }
function spawnHouse(x,y, world){
    var width = getRandomInt(16,40) //30;
    var height = getRandomInt(10,20);
    var thicknessWall = 4;
    var thicknessRoof = 2.5;
    var boxA = Bodies.rectangle(x + width/2, y, thicknessWall, height);
    var boxB = Bodies.rectangle(x - width/2, y, thicknessWall, height);
    var boxC = Bodies.rectangle(x, y - height - thicknessWall-0.1, width+(thicknessWall*2), thicknessRoof);

    var amountOfPeople = getRandomInt(2, width/4); // 8;
    for (let i = 0; i < amountOfPeople; i++) {
        spawnPerson(x - ( (0.5*amountOfPeople)) + i * 2.5,y, world);
    }
    stuff = [boxA, boxB, boxC];
    World.add(world,  stuff);
}
function spawnPresent(x,y, world){
    var boxA = Bodies.rectangle(x, y, 15, 15);
    stuff = [boxA];
    World.add(world,  stuff);
}
var boxSound = new Audio('snd/box_hit.ogg');

var collisionSounds = []
collisionSounds.push(boxSound)
//collisionSounds.push(new Audio('snd/plastic_hit.ogg'));
collisionSounds.push(new Audio('snd/box_hit_2.mp3'));

var firstScream = true;
function oncollide(stuff){
    if (timeElapsedReal >= timeLeft)
    {
        return;
    }
    var pairs = stuff.pairs
    pairs.forEach(pair => {
        var playSound = false;
        if (people.includes( pair.bodyA, 0 ))
        {
            people.splice(people.indexOf(pair.bodyA), 1);
            score += 1
            playSound = true
        }
        if (people.includes( pair.bodyB, 0 ))
        {
            people.splice(people.indexOf(pair.bodyB), 1);
            playSound = true
            score += 1
        }
        if (playSound)
        {
            if ( firstScream || (Math.random() > 0.9))
            {
                firstScream = false;
                screamsounds[getRandomInt(0,screamsounds.length)].play();
            }
            deathsounds[getRandomInt(0, deathsounds.length)].play();
        }
        else
        {
            collisionSounds[getRandomInt(0, collisionSounds.length)].play();
        }
    });
}
Matter.Events.on(engine, "collisionEnd", oncollide)
//spawnHouse(200,930, engine.world);
for (let i = 0; i < Math.round(render.options.width / (47)); i++) {//20; i++) {
    spawnHouse((50/2) + (i*45), render.options.height, engine.world);
}
// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);




World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;
var lastTime = performance.now();
var timeElapsedReal = 0;
function mouseClickPresent()
{
    if (!musicplaying)
    {
        bg_music.play();
    }
    if (!started)
    {
        started = true;
        lastTime = performance.now();
    }
    if (timeElapsedReal > timeLeft)
    {
        location.reload();
        return;
    }
    if (timeElapsedReal >= timeLeft)
    {
        return;
    }

    if (mouseConstraint.body != null)
    {
        return;
    }
    spawnPresent(mouse.position.x,mouse.position.y, engine.world)
}
window.onclick = mouseClickPresent;


var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d');

canvas.width = render.options.width;
canvas.height = render.options.height;
canvas.style.left = "0px";
canvas.style.top = "0px";
canvas.style.position = "absolute";
canvas.style.zIndex = "100";
canvas.style.pointerEvents = "none"
document.body.appendChild(canvas);

var initialPeople = people.length;
(function render_foreground() {
    requestAnimationFrame(render_foreground);
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw_flakes()
    context.font = "bold 50px serif";
    context.fillStyle = 'white'
    ctx.textAlign = "left";
    context.fillText("SCORE: " + score + "/" + initialPeople, 65, 60)
    var stuff = (timeLeft - timeElapsedReal)
    if (stuff < 0)
    {
        stuff = 0
    }
    context.fillText("TIME LEFT: " + stuff, 65, 60 + 40)
    //context.fillText("PEOPLE LEFT: " + people.length, 70, 60 + 40 + 40)
    if (!started)
    {
        ctx.textAlign = "center";
        context.fillText("Click to begin!", canvas.width/2, canvas.height/2 - 80);
        ctx.fillStyle = 'gold'
        context.fillText("Click to spawn presents",canvas.width/2, canvas.height/2 - 80 + 60)
        context.fillText("Scroll to zoom", canvas.width/2, canvas.height/2 - 80 + 60 + 40)
        ctx.fillStyle = 'white'
        context.fillText("You are santa and a town has been very naughty...", canvas.width/2, canvas.height/2 - 80 + 60 + 40 + 60)
        ctx.fillStyle = 'red'
        context.fillText("Show the residents the true meaning of christmas!", canvas.width/2, canvas.height/2 - 80 + 60 + 40 + 60 + 40)
    }
    if ( started && (timeElapsedReal <= timeLeft))
    {
    var timeElapsed = performance.now() - lastTime;
    timeElapsed /= 1000;
    timeElapsedReal = Math.round(timeElapsed);
    }
    if (timeElapsedReal >= timeLeft)
    {   
        ctx.textAlign = "center";
        context.fillStyle = 'red'
        context.fillText("Times up!", canvas.width/2, canvas.height/2)
        if (timeElapsedReal > timeLeft)
        {
            context.fillText("Click to retry :)", canvas.width/2, (canvas.height/2) + 40)
        }
    }
})();

//snowflake particles
var mp = 50; //max particles
var particles = [];
for(var i = 0; i < mp; i++)
{
    particles.push({
        x: Math.random()*canvas.width, //x-coordinate
        y: Math.random()*canvas.height, //y-coordinate
        r: Math.random()*4+1, //radius
        d: Math.random()*mp //density
    })
}
var W = canvas.width;
var H = canvas.height;


//Lets draw the flakes
function draw_flakes()
{
    //ctx.clearRect(0, 0, W, H);
    ctx = context;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    for(var i = 0; i < mp; i++)
    {
        var p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
    }
    ctx.fill();
    update_flakes();
}

//Function to move the snowflakes
//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
var angle = 0;
function update_flakes()
{
    angle += 0.01;
    for(var i = 0; i < mp; i++)
    {
        var p = particles[i];
        //Updating X and Y coordinates
        //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
        //Every particle has its own density which can be used to make the downward movement different for each flake
        //Lets make it more random by adding in the radius
        p.y += (Math.cos(angle+p.d) + 1 + p.r/2) / 10;
        p.x += (Math.sin(angle) * 2) / 10;
        
        //Sending flakes back from the top when it exits
        //Lets make it a bit more organic and let flakes enter from the left and right also.
        if(p.x > W+5 || p.x < -5 || p.y > H)
        {
            if(i%3 > 0) //66.67% of the flakes
            {
                particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
            }
            else
            {
                //If the flake is exitting from the right
                if(Math.sin(angle) > 0)
                {
                    //Enter from the left
                    particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
                }
                else
                {
                    //Enter from the right
                    particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
                }
            }
        }
    }
}

