import kaboom from "kaboom";

// initialise constants
const FLOOR_HEIGHT = 120;
const JUMP_FORCE = 1000;
const SPEED = 500;

// initialise context
kaboom();

// load assets
loadSprite("player", "sprites/player.png");
loadSprite("cactus", "sprites/cactus.png")

// main game scene
scene("game", () => {
    setBackground(color(0,0,0))


    // define gravity
    setGravity(1600);


    // add a game object to screen
    const player = add([
        // list of components
        sprite("player"),
        pos(80, 40),
        area(),
        body(),
    ]);

    // floor
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(212, 216, 129),
    ]);

    // jump function
    function jump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }

    // jump when user press space
    onKeyPress("space", jump);
    onClick(jump);

    function spawnCactus() {
        add([ // add tree object
            sprite("cactus"),
            area(),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            move(LEFT, SPEED),
            "cactus",
        ]);

        wait(rand(1.00, 3.25), spawnCactus); // wait a random amount of time to spawn next cactus
    }

    // start spawning cactus
    spawnCactus();

    // lose if player collides with any game obj with tag "cactus"
    player.onCollide("cactus", () => {
        // go to "lose" scene and pass the score
        go("lose", score);
        burp();
        addKaboom(player.pos);
    });

    // keep track of score
    let score = 0;

    const scoreLabel = add([
        text(score),
        pos(24, 24),
    ]);

    // increment score every frame
    onUpdate(() => {
        score++;
        scoreLabel.text = `Your score: ${score}`;
    });
});

scene("lose", (score) => { //lose scene
    add([
        sprite("player"),
        pos(width() / 2, height() / 2 - 80),
        scale(2),
        anchor("center"),
    ]);

    add([ // display score
        text(`Your score: ${score}`),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);

    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));
});

go("game");
