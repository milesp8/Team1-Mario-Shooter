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
    var e=document.getElementById(sprite.element);
    e.style.left =sprite.x+'px';
    e.style.top=sprite.y+'px';
}



 var controller = new Object();

var SPACE_KEY=32; //shooting key.
var UP_KEY=38; //double press jump key
var RIGHT_KEY=39; //change direction key 
var DOWN_KEY=40; //change direction key

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

