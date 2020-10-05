
document.addEventListener('DOMContentLoaded', () => {
    var enemyArr = [];
    var projArr = [[], []];
    var groundArr = [];
    var GROUND_WIDTH = 100;
    //$(".game-container").css(({width: window.innerWidth + 'px'}));
    //$(".game-container").css(({height: window.innerHeight + 'px'}));
    var direction = 1  //direction of the character and projectile ( 1 = right, -1 = left)
    var isMoving = 0 //Tracks if the player is moving or not, 0 if still, 10 if moving
    var jumpCount = 0
    var playerHealth = 3;
    document.getElementById('playerHealth').innerHTML = playerHealth; //initialize playerHealth

    var score = 0 //Tracks player score
    const moveScore = 1
    const killScore = 5
    minEnemies = 4;

    const projSpeed = 40;
    const tickSpeed = 30;
    const playerSpeed = 10;
    const ShootingTick = 300;
    const enemySpeed = 10;
    var enemyHealth = 2;

    const spikeHealth = -1
    const spikeHeight = 30
    const tileWidth = 100

    const PIT = 20;
    const LOW = 100;
    const MEDIUM = 200;
    const HIGH = 300;
    groundHeights = [PIT, LOW, MEDIUM, HIGH];
    var enemyCounter = 0;


    currentTerrainCounter = 0;
    const FLAT = 0;
    const BIGHILLUP = 1;
    const FLATBIGHILL = 2;
    const SMALLHILL = 3;
    const SPIKES = 4;
    const BIGHILLDOWN = 5;
    terrainTypes = [FLAT, BIGHILLUP, FLATBIGHILL, SMALLHILL, SPIKES, BIGHILLDOWN];
    currentTerrainType = terrainTypes[FLAT];

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
    setInterval(updateEnemies, tickSpeed);//Lags the game quite a bit
    setInterval(checkPlayerCollision, tickSpeed);
    setInterval(checkBulletEnemyCollision, tickSpeed);


    var enemyArr = [];
    var projArr = [];
    var controller = new Object();

    var character = new Object();
    character.element = "character";
    character.x = 0;
    character.y = 0
    character.width = 30;
    character.height = 50;
    character.AbsoluteX = 0;
    character.AbsoluteLeft = 0;
    character.acceleration = 0;

    //key press constants mapping
    const SPACE_KEY = 32; //shooting key.
    const UP_KEY = 87; //double press jump key
    const RIGHT_KEY = 68; //change direction key 
    const DOWN_KEY = 83; //change direction key
    const LEFT_KEY = 65; //Change dir key

    //var gravity = 0.8  //can be used for alternative jumping function
    var isJumping = false;
    var movingTimeout = -1;
    var frames = 60;
    var shootingTimeout = -1;
    var dmgCooldown = false; // tracks if there has been dmg 

    //creates test enemies
    
    createGround(0, 0, GROUND_WIDTH, LOW);
    updateGroundArr();

    createEnemy(enemyHealth, 500, 500, groundArr[groundArrayIndex2(500)].height, 60, 50, 1);
    createEnemy(enemyHealth, 800, 800, groundArr[groundArrayIndex2(800)].height, 60, 50, 1);

    updateCharacter();

    function gravity() {
        let maxGroundHeight = Math.max(groundArr[groundArrayIndex(character)].height, groundArr[groundArrayIndex2(character.AbsoluteX + character.width - 1)].height);
        if (character.y > maxGroundHeight && jumpCount == 0) {
            character.y -= (8 + character.acceleration);
            character.acceleration += .25;
        }
        else if (jumpCount == 0) {
            character.y = maxGroundHeight;
            character.acceleration = 0;
        }
        $(".character").css(({ bottom: character.y + 'px' }))
        setTimeout(gravity, 1000 / frames);
    }
    function createEnemy(health, AbsoluteX, x, y, width, height, dir) {
        var enemy = new Object();
        enemy.element = "enemy" + enemyCounter;
        enemyCounter++;
        enemy.health = health;
        enemy.AbsoluteX = AbsoluteX;
        enemy.x = groundArr[groundArrayIndex2(AbsoluteX)].x + (AbsoluteX - groundArr[groundArrayIndex2(AbsoluteX)].AbsoluteX);
        enemy.y = y;
        enemy.height = height;
        enemy.width = width;
        enemy.dir = dir;
        $("ul.enemyList").append('<li><div class=enemy id=' + enemy.element + '></div></li>')
        $('#' + enemy.element).css(({ bottom: y + 'px', left: enemy.x + 'px', width: width + 'px', height: height + 'px' }));
        enemyArr.push(enemy)
        return enemy;
    }
    function createProjectile(x, y) {
        var proj = new Object();
        proj.element = "proj" + Math.floor(Math.random() * 100000);
        proj.x = x;
        proj.y = y;
        proj.dir = direction;
        $("ul.projList").append('<li><div class=proj id=' + proj.element + '></div></li>')
        $('#' + proj.element).css(({ bottom: y + 'px', left: x + 'px' }));
        if (direction == -1) {
            $('#' + proj.element).css(({ transform: "scaleX(-1)" }));
        }
        projArr.push(proj);
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
        ground.x = groundArr[groundArr.length - 1].x + GROUND_WIDTH;
        ground.AbsoluteX = groundArr[groundArr.length - 1].AbsoluteX + 100;
        ground.y = 0;
        ground.width = width;
        switch (currentTerrainType) {
            case FLAT:
                if (currentTerrainCounter < 3) {
                    currentTerrainCounter++;
                    ground.height = LOW;
                } else {
                    currentTerrainType = terrainTypes[Math.floor(Math.random() * (terrainTypes.length - 1))];
                    currentTerrainCounter = 1;
                    switch (currentTerrainType) {
                        case FLAT:
                            ground.height = LOW;
                            break;
                        case BIGHILLUP:
                            ground.height = MEDIUM;
                            break;
                        case FLATBIGHILL:
                            ground.height = HIGH;
                            break;
                        case SMALLHILL:
                            ground.height = MEDIUM;
                            break;
                        case SPIKES:
                            ground.height = PIT;
                            break;
                        default:
                            console.log("SOMETHING IS WRONG");
                    }
                }
                break;
            case BIGHILLUP:
                if (currentTerrainCounter < 3) {
                    goUp = Math.floor(Math.random() * 2);
                    if (goUp == 1) {
                        ground.height = HIGH;
                        currentTerrainCounter = 1;
                        currentTerrainType = BIGHILLDOWN;
                    } else {
                        ground.height = MEDIUM;
                        currentTerrainCounter++;
                    }
                } else {
                    ground.height = HIGH;
                    currentTerrainCounter = 1;
                    currentTerrainType = BIGHILLDOWN;
                }
                break;
            case BIGHILLDOWN:
                if (groundArr[groundArr.length - 1].height == HIGH) {
                    if (currentTerrainCounter < 3) {
                        ground.height = HIGH;
                        currentTerrainCounter++;
                    } else if (currentTerrainCounter < 5) {
                        goDown = Math.floor(Math.random() * 2);
                        if (goDown == 1) {
                            ground.height = MEDIUM;
                            currentTerrainCounter = 1;
                        } else {
                            ground.height = HIGH;
                            currentTerrainCounter++;
                        }
                    } else {
                        ground.height = MEDIUM;
                        currentTerrainCounter = 1;
                    }
                } else {
                    if (currentTerrainCounter < 3) {
                        goDown = Math.floor(Math.random() * 2);
                        if (goDown == 1) {
                            ground.height = LOW;
                            currentTerrainCounter = 1;
                            currentTerrainType = FLAT;
                        } else {
                            ground.height = MEDIUM;
                            currentTerrainCounter++;
                        }
                    } else {
                        ground.height = LOW;
                        currentTerrainCounter = 1;
                        currentTerrainType = FLAT;
                    }
                }
                break;
            case FLATBIGHILL:
                if (currentTerrainCounter < 3) {
                    ground.height = HIGH;
                    currentTerrainCounter++;
                } else if (currentTerrainCounter < 5) {
                    goDown = Math.floor(Math.random() * 2);
                    if (goDown == 1) {
                        ground.height = LOW;
                        currentTerrainCounter = 1;
                        currentTerrainType = FLAT;
                    } else {
                        ground.height = HIGH;
                        currentTerrainCounter++;
                    }
                } else {
                    ground.height = LOW;
                    currentTerrainCounter = 1;
                    currentTerrainType = FLAT;
                }
                break;
            case SMALLHILL:
                if (currentTerrainCounter < 3) {
                    ground.height = MEDIUM;
                    currentTerrainCounter++;
                } else if (currentTerrainCounter < 5) {
                    goDown = Math.floor(Math.random() * 2);
                    if (goDown == 1) {
                        ground.height = LOW;
                        currentTerrainCounter = 1;
                        currentTerrainType = FLAT;
                    } else {
                        ground.height = MEDIUM;
                        currentTerrainCounter++;
                    }
                } else {
                    ground.height = LOW;
                    currentTerrainCounter = 1;
                    currentTerrainType = FLAT;
                }
                break;
            case SPIKES:
                let spikeName = createEnemy(spikeHealth, ground.AbsoluteX - tileWidth - 20, 0, PIT, tileWidth + 40, spikeHeight, 0).element;
                $('#'+spikeName).addClass("spike");
                if (currentTerrainCounter < 2) {
                    goUp = Math.floor(Math.random() * 2);
                    if (goUp == 1) {
                        ground.height = LOW;
                        currentTerrainCounter = 1;
                        currentTerrainType = FLAT;
                    } else {
                        ground.height = PIT;
                        currentTerrainCounter++;
                    }
                } else {
                    ground.height = LOW;
                    currentTerrainCounter = 1;
                    currentTerrainType = FLAT;
                }
                break;

        }
        //ground.height = groundHeights[Math.floor(Math.random() * groundHeights.length)];
        $("ul.groundList").append('<li><div class=ground id=' + ground.element + '></div></li>')
        $('#' + ground.element).css(({ bottom: ground.y, left: ground.x, width: width + 'px', height: ground.height + 'px' }));
        groundArr.push(ground)
        return ground;
    }

    setInterval(() => {
        if(dmgCooldown)
            $('.character').fadeTo(100, 0.3, function() { $(this).fadeTo(100, 1.0); });
        else{$('.character').stop().fadeTo(0, 1.0)}
    }, 200);

    function updatePlayerHealth(change) {
        playerHealth += change;
        document.getElementById('playerHealth').innerHTML = playerHealth;
        dmgCooldown = true;
        
        setTimeout(() => {
            dmgCooldown = false;
            $('.character').stop().fadeTo(0, 1.0)
        }, 2000);
    }

    function updateScore(increase) {
        score += increase;
        document.getElementById('score').innerHTML = score;
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
        if (groundArr[0].AbsoluteX + groundArr[0].width < character.AbsoluteLeft) {
            $("#" + groundArr.shift().element).parent().remove()
        }
        while (groundArr.length < 25) {
            createGroundAuto(GROUND_WIDTH);
        }
    }

    function updateEnemies() {
        enemyArr.forEach(e => {
            if (e.AbsoluteX + e.width <= (character.AbsoluteLeft) || e.health == 0) { //Removes Enemies if further than absolute left
                $("#" + e.element).parent().remove();
                enemyArr = enemyArr.filter(item => item.element !== e.element)
            }
            nextEnemyLocation = e.AbsoluteX + (enemySpeed * e.dir);
            if (e.dir == 1) {
                nextEnemyLocation += e.width - 1;
            }
            nextGroundIndex = groundArrayIndex2(nextEnemyLocation);
            nextGroundHeight = 0;
            if (nextGroundIndex > -1 && nextGroundIndex < 25) {
                nextGroundHeight = (groundArr[nextGroundIndex].height);
            }
            if (nextGroundIndex < 25 && e.y == nextGroundHeight) { //CHANGE TO == AFTER GENERATION 
                e.AbsoluteX += enemySpeed * e.dir; //Handles Movement of enemies
                e.x += enemySpeed * e.dir;
            }
            else {
                e.dir = e.dir * -1;
            }

            $('#' + e.element).css('left', e.x + 'px');
        });
        if (enemyArr.length < minEnemies && groundArr[groundArr.length - 1].height != 20) {
            createEnemy(enemyHealth, groundArr[groundArr.length - 1].AbsoluteX, 0, groundArr[groundArr.length - 1].height, 60, 50, 1);
        }
    }

    function updateProj() {
        projArr.forEach(e => {
            if (e.dir == -1) { //If moving to the left
                nextBulletLocation = e.x + (2 * projSpeed * e.dir);  // future bullet location
            }
            else { //If moving right
                nextBulletLocation = e.x + (e.dir - projSpeed);  // future bullet location
            }
            nextGroundIndex = groundArr.findIndex((element) => element.x > nextBulletLocation)  // find index of ground at that future bullet index
            nextGroundHeight = 0

            if (nextGroundIndex > -1) {
                nextGroundHeight = (groundArr[nextGroundIndex].height);
            }

            if (e.y > nextGroundHeight) {  // if bullet height is greater than the ground heihgt

                e.x += (projSpeed + isMoving) * e.dir;
                $('#' + e.element).css('left', e.x + 'px');
                if (e.x > groundArr[groundArr.length - 1].x + GROUND_WIDTH || e.x <= character.AbsoluteLeft - e.width) {
                    $("#" + e.element).parent().remove();
                    projArr = projArr.filter(item => item.element !== e.element)
                }
            } else {
                //$("#" + e.element).css('background-image', url(assets/Player/explosion.jpg));
                $("#" + e.element).parent().remove();
                projArr = projArr.filter(item => item.element !== e.element)
            }
        });
    }

    function groundArrayIndex2(xPos) {
        dif = xPos - groundArr[0].AbsoluteX;
        index = Math.floor(dif / GROUND_WIDTH);
        return index;
    }

    function checkPlayerCollision(){ //Check if player touches an enemy
        enemyArr.forEach(e => {
            if((((character.x > e.x && character.x < e.x + e.width) || (character.x + character.width > e.x && character.x + character.width < e.x + e.width)) && (character.y < e.y + e.height && character.y >= e.y)) && dmgCooldown == false){
                updatePlayerHealth(-1);
            }
        });
    }
    function checkBulletEnemyCollision(){
        projArr.forEach(e => {
            enemyArr.forEach(f => {
                if (((e.x + e.width >= f.x && e.x + e.width <= f.x + f.width) ||  (e.x > f.x && e.x < f.x + f.width)) && ((e.y >= f.y && e.y <= f.y + f.height) || (e.y + e.height >= f.y && e.y + e.height <= f.y + f.height ) )){
                    f.health = f.health - 1;
                    $("#" + e.element).parent().remove();
                    projArr = projArr.filter(item => item.element !== e.element)
                }
            })
        })
    }

    function groundArrayIndex(character) {
        dif = character.AbsoluteX - groundArr[0].AbsoluteX;
        index = Math.floor(dif / GROUND_WIDTH);
        return index;
    }

    //Character jump motion
    gravity();
    function jump() {
        let maxGroundHeight = Math.max(groundArr[groundArrayIndex(character)].height, groundArr[groundArrayIndex2(character.AbsoluteX + character.width - 1)].height);
        character.y += 12 - character.acceleration;
        jumpCount++;
        character.acceleration += .25
        $(".character").css(({ bottom: character.y + 'px' }))
        if (jumpCount < 200 && character.y >= maxGroundHeight) {
            jumpingTimeout = setTimeout(jump, 500 / frames);
        }
        else {
            jumpCount = 0;
            character.y = maxGroundHeight;
            character.acceleration = 0;
        }
    }

    //Right movement
    function moveRight() {

        direction = 1
        $("#character").css(({ transform: "scaleX(1)" }));

        if (character.y >= groundArr[groundArrayIndex2(character.AbsoluteX + character.width - 10 + playerSpeed)].height) {
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
            if (character.AbsoluteX == character.AbsoluteLeft + 400 + 20 * playerSpeed) {
                character.AbsoluteLeft += playerSpeed;
                updateScore(moveScore);
                if (Math.floor(character.AbsoluteLeft/2000) > Math.floor((character.AbsoluteLeft - playerSpeed)/2000)) {
                    minEnemies++;
                }
                if (Math.floor(character.AbsoluteLeft/10000) > Math.floor((character.AbsoluteLeft - playerSpeed)/10000) && enemyHealth < 5) {
                    enemyHealth++;
                }
            }
        }
        movingTimeout = setTimeout(moveRight, 1000 / frames);
        updateCharacter();
        //updateEnemies();
        //updateProj();
        updateGround();
        updateGroundArr();
    }


    //Left movement
    function moveLeft() {
        direction = -1
        $("#character").css(({ transform: "scaleX(-1)" }));
        if (character.AbsoluteX > character.AbsoluteLeft) {
            if (character.y >= groundArr[groundArrayIndex2(character.AbsoluteX - playerSpeed)].height) {
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
        }
        movingTimeout = setTimeout(moveLeft, 1000 / frames);

        updateCharacter();
        //updateEnemies();
        //updateProj();
        updateGround();
        updateGroundArr();
    }

    //Shooting Functionality
    function shoot() {
        let laserID
        let currLaserID = 0;
        createProjectile(character.x + character.width / 3, character.y + 20);
        shootingTimeout = setTimeout(shoot, ShootingTick);

        /*xPos=character.style.left; ------> we should write function in terms of characters curr position pixel. 
        createProjectile(character.style.left+450+"px",character.style.bottom+790+'px');*/


        //Write function to move lasers
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

                if (character.y <= Math.max(groundArr[groundArrayIndex(character)].height, groundArr[groundArrayIndex2(character.AbsoluteX + character.width - 1)].height)) {
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
                if (shootingTimeout === -1) {
                    shoot();
                }
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

            case SPACE_KEY:
                clearTimeout(shootingTimeout);
                shootingTimeout = -1;
                break;

            default: return;
        }
    });


});
