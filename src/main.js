import kaboom from "kaboom";
const FLOOR_HEIGHT = 120;
const JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom();

// load assets
loadSprite("bean", "sprites/bean.png");

scene("game", () => { //game scene
	setBackground(color(0,0,0))
    // define gravity
    setGravity(1600);
    
    const player = add([ // add a game object to screen
        // list of components
        sprite("bean"),
        pos(80, 40),
        area(),
        body(),
    ]);

    add([ // floor
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
    ]);

    function jump() { //jump function
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }

    // jump when user press space
    onKeyPress("space", jump);
    onClick(jump);

    function spawnTree() {
        add([ // add tree object
            rect(48, rand(32, 96)),
            area(),
            outline(4),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            color(255, 180, 255),
            move(LEFT, SPEED),
            "tree",
        ]);

        wait(rand(0.5, 1.5), spawnTree); // wait a random amount of time to spawn next tree
    }

    // start spawning trees
    spawnTree();

    // lose if player collides with any game obj with tag "tree"
    player.onCollide("tree", () => {
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
        sprite("bean"),
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