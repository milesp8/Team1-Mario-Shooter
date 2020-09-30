
document.addEventListener('DOMContentLoaded', () => {
    console.log("true")
    var enemyArr = [];
    var projArr = [[], []];
    var groundArr = [];
    var GROUND_WIDTH = 100;
    //$(".game-container").css(({width: window.innerWidth + 'px'}));
    //$(".game-container").css(({height: window.innerHeight + 'px'}));
    var direction = 1  //direction of the character and projectile ( 1 = right, 2 = left)

    const projSpeed = 40;
    const tickSpeed = 30;

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
    function gravity(){
        if (characterY > 150 && jumpCount == 0){
            characterY -=15;
        }
        $(".character").css(({bottom: characterY + 'px'}))
        setTimeout(gravity, 1000 / frames);
    }
    gravity();
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
            $("#" + enemyArr.shift().element).remove();
        }
        return enemy;
    }
    function createProjectile(x, y) {
        var proj = new Object();
        proj.element = "proj" + Math.floor(Math.random() * 100000);
        proj.x = x;
        proj.y = y;
        $("ul.projList").append('<li><div class=proj id=' + proj.element + '></div></li>')
        $('#' + proj.element).css(({ bottom: y + 'px', left: x + 'px'}));
        projArr.push(proj, direction);
        if (projArr.length > 10) {
            $("#" + projArr.shift().element).remove()
        }
        return proj;
    }

    function createGround(x, y, width, height) {
        var ground = new Object();
        ground.element = "ground" + Math.floor(Math.random() * 100000);
        ground.x = x;
        ground.y = y; 
        ground.height = height;
        ground.width = width;
        $("ul.groundList").append('<li><div class=ground id=' + ground.element + '></div></li>')
        $('#' + ground.element).css(({ bottom: y, left: x, width: width + 'px', height: height + 'px' }));
        groundArr.push(ground)
        return ground;
    }
    

    function updateGround() {
        groundArr.forEach(e => {
            $('#' + e.element).css('left', e.x + 'px');
        });
    }

    function updateGroundArr() {
        if (groundArr[0].x < -100) {
            groundArr.shift();
        }
        while (groundArr.length < 40) {
            createGround(groundArr[groundArr.length - 1].x + 100, 0, 100, 150);
        }
    }

    function updateEnemies() {
        enemyArr.forEach(e => {
            $('#' + e.element).css('left', e.x + 'px');
        });
    }

    function updateProj() {
        projArr.forEach(e => {
            e.x += projSpeed;
            $('#' + e.element).css('left', e.x + 'px');
            if (e.x > window.innerWidth){
                $("#" + projArr.shift().element).remove();
            }
        });
    }


    var controller = new Object();

    var SPACE_KEY = 32; //shooting key.
    var UP_KEY = 38; //double press jump key
    var RIGHT_KEY = 39; //change direction key 
    var DOWN_KEY = 40; //change direction key
    var LEFT_KEY = 37; //Change dir key



    //var gravity = 0.8  //can be used for alternative jumping function
    var isJumping = false;
    var movingTimeout = -1;
    var frames = 60;

    //creates test enemies
    createEnemy(3, 500, 150, 20, 100);
    createEnemy(2, 800, 175, 60, 50);

   createGround(0, 0, 100, 150);
   updateGroundArr();
    //Character jump motion
    var characterY = 150;
    jumpCount = 0;
    function jump() {
        characterY += 15;
        jumpCount++;
        $(".character").css(({bottom: characterY + 'px'}))
        if(jumpCount < 20){
            jumpingTimeout = setTimeout(jump, 1000 / frames);
        }
        else{jumpCount = 0}
    }

    //Right movement
    function moveRight() {

        direction = 1

        groundArr.forEach(e => {
            e.x -= 20;
        });
       // $('div.ground').css('left', (parseInt($('div.ground').css('left')) - 20) + 'px');
        enemyArr.forEach(e => {
            e.x -= 20;
        });
        projArr.forEach(e => {
            e.x -=20;
        });
        movingTimeout = setTimeout(moveRight, 1000 / frames);

        updateEnemies();
        updateProj();
        updateGround();
        updateGroundArr();
    }


    //Left movement
    function moveLeft() {

        direction = 2

        groundArr.forEach(e => {
            e.x += 20;
        });
        //$('div.ground').css('left', (parseInt($('div.ground').css('left')) + 20) + 'px');
        enemyArr.forEach(e => {
            e.x += 20;
        });
        projArr.forEach(e => {
            e.x += 20
        });
        movingTimeout = setTimeout(moveLeft, 1000 / frames);

        updateEnemies();
        updateProj();
        updateGround();
        updateGroundArr();
    }

    //Shooting Functionality
    function shoot() {
        let laserID
        let currLaserID = 0;
        character = document.querySelector('.character')

        /*xPos=character.style.left; ------> we should write function in terms of characters curr position pixel. 
        createProjectile(character.style.left+450+"px",character.style.bottom+790+'px');*/

        createProjectile(450, characterY + 20);
        //Write function to move lasers
        function moveLasers() {
            var laserElem = document.getElementById(".character");
            updateProj;
        }
        updateProj()
    }

    //When key is pressed
    $(document).keydown(function (e) {
        switch (e.which) {
            case LEFT_KEY:  //left key

                if (movingTimeout === -1) {
                    moveLeft();
                }
                break;

            case UP_KEY:  //up key
            if (characterY <= 150){
                jump();
            }
                break;

            case RIGHT_KEY:  //right key

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
            case 37:  //left key
                clearTimeout(movingTimeout);
                movingTimeout = -1;

                break;

            case 38:  //up key

                $('div.character').stop(false, true);

                break;

            case 39:  //right key
                clearTimeout(movingTimeout);
                movingTimeout = -1;

                break;

            case 40:  //down key
                break;

            default: return;
        }
    });


});