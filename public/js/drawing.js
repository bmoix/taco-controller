// Canvas element form the page
var canvas;
// Window weight and height
var w;
var h;
var context;
var enemies = [];
var coords = [];
var player;
var viewing;
var activate = true;
var conn = new Connection();

window.onresize = function() { location.reload(); }
function init()
{
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    w = window.innerWidth;
    h = window.innerHeight;
    player = {x: w/2, y: h - 75, r: w/4};
    viewing = { x: 100, y: 100};
    canvas.width = w;
    canvas.height = h;
    //setInterval(draw,10);
    conn.sendMessage({
        "type": "connect"
    });
    draw();
}

function draw()
{
    context.clearRect(0,0, w, h);
    // Draws the safe zone
    context.beginPath();
    context.arc(player.x, player.y, player.r, 0, Math.PI*2);
    context.lineWidth = 2;
    context.stroke();
    // Draws the camera view angle
    context.beginPath();
    context.moveTo(player.x, player.y);
    context.lineTo(coords.minx*w/4, coords.miny*h);
    context.stroke();
    context.beginPath();
    context.moveTo(player.x, player.y);
    context.lineTo(coords.maxx*w/4, coords.maxy*h);
    context.stroke();
    // Draws the enemies
    for (i = 0; i < enemies.length; i++) {
        if (Math.abs(enemies[i].posx * w - player.x) <= 25 && Math.abs(enemies[i].posy * h - player.y) <= 25) {}
        else {
            rgba = Math.round(enemies[i].color[0]*255)+","+Math.round(enemies[i].color[1]*255)+","+Math.round(enemies[i].color[2]*255)+","+enemies[i].color[3]; 
            context.beginPath();
            context.arc(enemies[i].posx * w, enemies[i].posy * h, 10, 0, Math.PI*2, true);
            context.fillStyle="rgba("+rgba+")";
            context.fill();
        }
    }
    // Draws the payer
    $("#tacotime").css({transform: 'scale(0.25)'}).offset({top: $("body").height()-120, left: $("body").width()/2 - 75});
    requestAnimationFrame(draw);
}

// Send event via EA. Normalized [0,1]
function getClickPosition(event) 
{
    var xPosition = event.clientX;
    var yPosition = event.clientY;
    if (!isInSafeZone(xPosition, yPosition) && activate) {
      addEnemy(xPosition, yPosition);
      activate = false;
      setTimeout(function(){
        activate = true;
    }, 1000);
  }
}

function addEnemy(xPosition, yPosition)
{
  conn.sendMessage({
    "type": "addEnemy",
    "posx": xPosition/w,
    "posy": yPosition/h,
});
}

function isInSafeZone(xPosition, yPosition)
{
  return Math.abs(xPosition - player.x) <= player.r && Math.abs(yPosition - player.y) <= player.r;
}

$(document).on("game_message", function (e, message) {
    //console.log("Received Message: " + JSON.stringify(message));
    var payload = message.payload;
    // Here you can add to the switch statement to respond to individual game messages differently:
    switch (payload.type) {
        case "enemy_list_info":
            enemies = payload.list;
            break;
        case "fov_info":
            coords = payload.coords;
            break;
    }
});
