var Background= new Object();
Background.element='Background';
/* 
Background.x=0; if we wanted to give a position x, to the Background
Background.y=0; if we want to give a positon y, to the Background
setPosition(Background); sets the position of the Background
*/

var Mario =new Object();
Mario.element='Mario';
Mario.x=0;
Mario.y=600;

/* allows us to set a position */
function setPosition(sprite){
    $('#'+sprite.element).css(({top: sprite.y, left: sprite.x}));
}

var enemyArr = [];
var projArr = [];

function createEnemy(health, x, y, width, height){
    var enemy = new Object();
    enemy.element = "enemy"+ Math.floor(Math.random() * 100000);
    enemy.health = health;
    enemy.x = x;
    enemy.y = y;
    enemy.height = height;
    enemy.width = width;
    $("ul.enemyList").append('<li><div class=enemy id=' + enemy.element + '></div></li>')
    $('#' + enemy.element).css(({top: y, left: x, width: width +'px', height: height + 'px'}));
    setPosition(enemy);
    enemyArr.push(enemy)
    if(enemyArr.length > 10){
        $("#" + enemyArr.shift().element).remove();
    }
    return enemy;
}
function createProjectile(x,y){
    var proj = new Object();
    proj.element = "proj"+ Math.floor(Math.random() * 100000);
    proj.x = x;
    proj.y = y;
    $("ul.projList").append('<li><div class=proj id=' + proj.element + '></div></li>')
    ('#' + proj.element).css(({top: y, left: x, width: width +'px', height: height + 'px'}));
    setPosition(proj);
    projArr.push(proj);
    if(projArr.length > 10){
        $("#" + projArr.shift().element).remove()
    }
    return proj;
}





 var controller = new Object();

var SPACE_KEY=32; //shooting key.
var UP_KEY=38; //double press jump key
var RIGHT_KEY=39; //change direction key 
var DOWN_KEY=40; //change direction key
var LEFT_KEY = 37; //Change dir key

//JQuery code for movement
$(document).ready(function(){
    //var gravity = 0.8  //can be used for alternative jumping function
    var isJumping = false;
    var movingTimeout = -1;
    var frames = 60;

    //creates test enemies
    createEnemy(3,400,600, 20, 100);
    createEnemy(2,800,650, 60, 50);

    //Character jump motion
    function jump() {
        if (isJumping === false) {

            isJumping = true;

            //Upward and downward motion animation
            $('div.character').animate({top: '-=25%'}, { 
                duration: 250
            }).animate({top: '+=25%'}, { 
                duration: 250
            });

            isJumping = false;
        }
    }

    //Right movement
    function moveRight() {
 
        $('div.character').css('left', (parseInt($('div.character').css('left')) + 20) + 'px');

        movingTimeout = setTimeout(moveRight, 1000 / frames);

    }

    
    //Left movement
    function moveLeft() {

        $('div.character').css('left', (parseInt($('div.character').css('left')) - 20) + 'px');

        movingTimeout = setTimeout(moveLeft, 1000 / frames);

    }

    //Shooting Functionality
    function shoot(){
        let laserID
        let currLaserID = 0;
        createProjectile(10,10);
        //Write function to move lasers
        function moveLasers(){

        }
    }

    //When key is pressed
    $(document).keydown(function(e){
        switch(e.which){
            case LEFT_KEY:  //left key

                if (movingTimeout === -1) {
                    moveLeft();
                }
                break;

            case UP_KEY:  //up key
                jump();
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
    $(document).keyup(function(e){
        switch(e.which){
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



/*
function toggleKey(keyCode,isPressed){
    console.log(keyCode);
    if (keyCode==)
}

document.onkeydown =function(evt){
    toggleKey(evt.dd,true)
};

document.onkeyup =function(evt){
    toggleKey(evt.keyCode)
};
 */

