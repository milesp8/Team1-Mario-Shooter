
document.addEventListener('DOMContentLoaded', () => {
    console.log("true")
    var enemyArr = [];
    var projArr = [[], []];
    var groundArr = [];
    var GROUND_WIDTH = 100;
    //$(".game-container").css(({width: window.innerWidth + 'px'}));
    //$(".game-container").css(({height: window.innerHeight + 'px'}));
    var direction = 1  //direction of the character and projectile ( 1 = right, -1 = left)
    var isMoving = 0 //Tracks if the player is moving or not, 0 if still, 10 if moving

    const projSpeed = 40;
    const tickSpeed = 30;
    const playerSpeed = 10;
    groundHeights = [20, 100, 200, 300];

    // groundTop = 0;

    // ground = document.querySelector('.ground')

    // function startGame() {
    //   groundTop = 100;
    /*ground.style.top = groundTop + 'px';*/
    // ground.style.bottom=0+'px';
    //}

    //startGame()
    //console.log(ground.style.bottom);
    setInterval(updateProj, tickSpeed);//Lags the game quite a bit


    var enemyArr = [];
    var projArr = [];

    var character = new Object();
    character.element = "character";
    character.x = 0;
    character.y = 0
    character.width = 30;
    character.height = 50;
    character.AbsoluteX = 0;
    character.AbsoluteLeft = 0;
    console.log(character.AbsoluteX);
    console.log(character.AbsoluteLeft)
    updateCharacter();

    function gravity(){
        if (character.y > groundArr[groundArrayIndex(character)].height && jumpCount == 0){
            character.y -=20;
        }
        $(".character").css(({bottom: character.y + 'px'}))
        setTimeout(gravity, 1000 / frames);
    }
    function createEnemy(health, x, y, width, height) {
        var enemy = new Object();
        enemy.element = "enemy" + Math.floor(Math.random() * 100000);
        enemy.health = health;
        enemy.x = x;
        enemy.y = y;
        enemy.height = height;
        enemy.width = width;
        $("ul.enemyList").append('<li><div class=enemy id=' + enemy.element + '></div></li>')
        $('#' + enemy.element).css(({ bottom: y + 'px', left: x + 'px', width: width + 'px', height: height + 'px' }));
        enemyArr.push(enemy)
        if (enemyArr.length > 10) {
            $("#" + enemyArr.shift().element).parent().remove();
        }
        return enemy;
    }
    function createProjectile(x, y) {
        console.log(character.x);
        console.log(x);
        var proj = new Object();
        proj.element = "proj" + Math.floor(Math.random() * 100000);
        proj.x = x;
        proj.y = y;
        proj.dir = direction;
        $("ul.projList").append('<li><div class=proj id=' + proj.element + '></div></li>')
        $('#' + proj.element).css(({ bottom: y + 'px', left: x + 'px' }));
        if(direction == -1){
            $('#' + proj.element).css(({transform: "scaleX(-1)"}));
        }
        projArr.push(proj, direction);
        if (projArr.length > 10) {
            $("#" + projArr.shift().element).parent().remove()
        }
        return proj;
    }

    function createGround(x, y, width, height) {
        var ground = new Object();
        ground.element = "ground" + Math.floor(Math.random() * 100000);
        ground.x = x;
        ground.y = y;
        ground.AbsoluteX = x;
        ground.height = height;
        ground.width = width;
        $("ul.groundList").append('<li><div class=ground id=' + ground.element + '></div></li>')
        $('#' + ground.element).css(({ bottom: y, left: x, width: width + 'px', height: height + 'px' }));
        groundArr.push(ground)
        return ground;
    }

    function createGroundAuto(width) {
        var ground = new Object();
        ground.element = "ground" + Math.floor(Math.random() * 100000);
        ground.x = groundArr[groundArr.length - 1].x+100;
        ground.AbsoluteX = groundArr[groundArr.length - 1].AbsoluteX + 100;
        ground.y = 0;
        ground.width = width;
        ground.height = groundHeights[Math.floor(Math.random() * groundHeights.length)];
        $("ul.groundList").append('<li><div class=ground id=' + ground.element + '></div></li>')
        $('#' + ground.element).css(({ bottom: ground.y, left: ground.x, width: width + 'px', height: ground.height + 'px' }));
        groundArr.push(ground)
        return ground;
    }

    function updateCharacter() {
        $('#' + character.element).css('left', character.x + 'px');
    }
    function updateGround() {
        groundArr.forEach(e => {
            $('#' + e.element).css('left', e.x + 'px');
        });
    }

    function updateGroundArr() {
        if (groundArr[0].AbsoluteX +groundArr[0].width < character.AbsoluteLeft) {
            groundArr.shift();
        }
        while (groundArr.length < 25) {
            createGroundAuto(100);
        }
        console.log(character.AbsoluteLeft, groundArr[0].AbsoluteX)
    }

    function updateEnemies() {
        enemyArr.forEach(e => {
            $('#' + e.element).css('left', e.x + 'px');
        });
    }

    function updateProj() {
        projArr.forEach(e => {
            e.x += (projSpeed + isMoving) * e.dir; 
            $('#' + e.element).css('left', e.x + 'px');
            if (e.x > window.innerWidth || e.x <= 0) {
                $("#" + projArr.shift().element).parent().remove();
            }
        });
    }

    function groundArrayIndex(xPos) {
        dif = xPos - groundArr[0].AbsoluteX;
        index = Math.floor(dif/100);
        return index;
    }

    function groundArrayIndex(character) {
        dif = character.AbsoluteX - groundArr[0].AbsoluteX;
        index = Math.floor(dif/100);
        return index;
    }

    var controller = new Object();

    const SPACE_KEY = 32; //shooting key.
    const UP_KEY = 87; //double press jump key
    const RIGHT_KEY = 68; //change direction key 
    const DOWN_KEY = 83; //change direction key
    const LEFT_KEY = 65; //Change dir key



    //var gravity = 0.8  //can be used for alternative jumping function
    var isJumping = false;
    var movingTimeout = -1;
    var frames = 60;

    //creates test enemies
    createEnemy(3, 500, 150, 20, 100);
    createEnemy(2, 800, 175, 60, 50);

    createGround(0, 0, 100, 100);
    updateGroundArr();

    //Character jump motion
    gravity();
    character.y = groundArr[groundArrayIndex(character)].height;
    jumpCount = 0;
    function jump() {
        character.y += 15;
        jumpCount++;
        $(".character").css(({bottom: character.y + 'px'}))
        if(jumpCount < 20){
            jumpingTimeout = setTimeout(jump, 1000 / frames);
        }
        else{jumpCount = 0}
    }

    //Right movement
    function moveRight() {

        direction = 1
        $("#character").css(({transform: "scaleX(1)"}));

        if (character.AbsoluteX < character.AbsoluteLeft + 400) {
            character.x += playerSpeed;
        } else {
            
            groundArr.forEach(e => {
                e.x -= playerSpeed;
            });
            // $('div.ground').css('left', (parseInt($('div.ground').css('left')) - 20) + 'px');
            enemyArr.forEach(e => {
                e.x -= playerSpeed;
            });
            projArr.forEach(e => {
                e.x -= playerSpeed;
            });
        }
        character.AbsoluteX += playerSpeed;
        if (character.AbsoluteX == character.AbsoluteLeft + 400 + 20*playerSpeed) {
            character.AbsoluteLeft += playerSpeed;
        }
        movingTimeout = setTimeout(moveRight, 1000 / frames);
        updateCharacter();
        updateEnemies();
        //updateProj();
        updateGround();
        updateGroundArr();
    }


    //Left movement
    function moveLeft() {
        direction = -1
        $("#character").css(({transform: "scaleX(-1)"}));
        if (character.AbsoluteX > character.AbsoluteLeft) {
            console.log("left1");
            if (character.AbsoluteX <= character.AbsoluteLeft + 400) {
                character.AbsoluteX -= playerSpeed;
                character.x -= playerSpeed;
            } else {
                character.AbsoluteX -= playerSpeed;
                groundArr.forEach(e => {
                    e.x += playerSpeed;
                });
                //$('div.ground').css('left', (parseInt($('div.ground').css('left')) + 20) + 'px');
                enemyArr.forEach(e => {
                    e.x += playerSpeed;
                });
                projArr.forEach(e => {
                    e.x += playerSpeed
                });
            }
        }
        movingTimeout = setTimeout(moveLeft, 1000 / frames);

        updateCharacter();
        updateEnemies();
        //updateProj();
        updateGround();
        updateGroundArr();
    }

    //Shooting Functionality
    function shoot() {
        let laserID
        let currLaserID = 0;

        /*xPos=character.style.left; ------> we should write function in terms of characters curr position pixel. 
        createProjectile(character.style.left+450+"px",character.style.bottom+790+'px');*/

        createProjectile(character.x + character.width / 3, character.y + 20);
        //Write function to move lasers
        function moveLasers() {
            //var laserElem = document.getElementById(".character");
            //updateProj;
        }
    }

    //When key is pressed
    $(document).keydown(function (e) {
        switch (e.which) {
            case LEFT_KEY:  //left key
            isMoving = 10;
                if (movingTimeout === -1) {
                    moveLeft();
                }
                break;

            case UP_KEY:  //up key
            
            if (character.y == groundArr[groundArrayIndex(character)].height){
                jump();
            }
                break;

            case RIGHT_KEY:  //right key
            isMoving = 10;
                if (movingTimeout === -1) {
                    moveRight();
                }
                break;

            case DOWN_KEY:  //down key
                break;

            case SPACE_KEY:
                shoot();
                break;

            default: return;
        }
    });

    //When key is released
    $(document).keyup(function (e) {
        switch (e.which) {
            case LEFT_KEY:  //left key
                clearTimeout(movingTimeout);
                movingTimeout = -1;
                isMoving = 0;

                break;

            case UP_KEY:  //up key

                $('div.character').stop(false, true);

                break;

            case RIGHT_KEY:  //right key
                clearTimeout(movingTimeout);
                movingTimeout = -1;
                isMoving = 0;

                break;

            case DOWN_KEY:  //down key
                break;

            default: return;
        }
    });


});
