// Canvas element form the page
var canvas;
// Window weight and height
var w;
var h;
var context;
var x = new Array();
var y = new Array();
var player;
var activate = true;
var conn = new Connection();

function init()
{
  canvas = document.getElementById("canvas");
  context = canvas.getContext('2d');
  w = window.innerWidth;
  h = window.innerHeight;
  player = { x: w/2, y: h, r: w/4};
  console.log(w, h);
  canvas.width = w;
  canvas.height = h;
  setInterval(draw,10);
  conn.sendMessage({
    "type": "connect"
  })
}

function draw()
{
  context.clearRect(0,0, w, h);
  // Draws the payer
  context.fillStyle="#ff0000";
  context.beginPath();
  context.arc(player.x, player.y-15, 15, 0, Math.PI*2);
  context.closePath();
  context.fill();
  // Draws the safe zone
  context.beginPath();
  context.arc(player.x, player.y, player.r, 0, Math.PI*2);
  context.closePath();
  context.lineWidth = 2;
  context.stroke();
  // Draws the enemies
  context.fillStyle="#0000ff";
  for (i = 0; i < x.length; i++) {
    context.beginPath();
    context.arc(x[i], y[i], 10, 0, Math.PI*2, true);
    context.closePath();
    context.fill();
  }
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
  })
  x.push(xPosition);
  y.push(yPosition);
}

function isInSafeZone(xPosition, yPosition)
{
  return Math.abs(xPosition - player.x) <= player.r && Math.abs(yPosition - player.y) <= player.r;
}
