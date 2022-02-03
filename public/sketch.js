class playerc{
  constructor(){
    this.x = 0
    this.y = 0
  }
}
var playerID
player = new playerc()

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var mouseX = 0
var mouseY = 0

let currentlyPressedKeys = []

socket = io.connect('/');
socket.on('message',message)
socket.on('frame',frame)
socket.on('updateData',updatePlayer)
socket.on('returnedMousePos',returnedmouse)
// socket.on('players',drawPlayers)

function updatePlayer(e){
  player.x = e[0]
  player.y = e[1]
}

function message(m){
    playerID = m
    console.log(m)
}



onmousemove = function(e){mouseX = e.clientX -2 ; mouseY = e.clientY -2}
ondrag = function(e){}


function rect(x,y,x2,y2){
  ctx.fillRect(x,y,x2,y2)
}
function fill(i){
  ctx.fillStyle = i
}


////////////////////////////////////////////////////////////////////////////////

function toGridNum(x,y){
  return(Math.floor(x) + Math.floor(y) * 20)
}


function getGrad(p1,p2){
  return((p1[1]-p2[1])/(p1[0]-p2[0]))
}






function linePoints(p1,p2){
  let gr = getGrad(p1,p2)
  let out = []
  let j = 0
  let y;
  let x;
  let step = 1
  if(gr < 1 && gr > -1){
    if(p1[0] < p2[0]){
      step = 1
      for(let x = p1[0] + 1; x < p2[0]; x++){
        y = gr * step + p1[1]
        step ++
        out.push([x,Math.round(y)])
      }
    
    } else {
      step = -1
      for(let x = p1[0] - 1; x > p2[0]; x--){
        y = gr * step + p1[1]
        step--
        out.push([x,Math.round(y)])

      }
      
    }
  } else {
    if(p1[1] < p2[1]){
      for(let y = p1[1] + 1; y < p2[1]; y++){
        if(gr != "-Infinity"){
        x = (y - (-gr*p1[0]+p1[1])) / gr}
        else {x = p1[0]}

        out.push([Math.round(x),y])
     }
    
    } else {
      for(let y = p1[1] - 1; y > p2[1]; y--){
        if(gr != "Infinity"){
        x = (y - (-gr*p1[0]+p1[1])) / gr}
        else {x = p1[0]}
        out.push([Math.round(x),y])

      }
      
    }
  }
  
  
  
  
  
  return(out)
}
///////////////////////////////////////////////////////////










function drawGrid(gridmaxX,gridmaxY,inArray,size){
  if(inArray == "fdark"){
    for(let i = 0; i < gridmaxY; i++){
      for(let j = 0; j < gridmaxX; j++){
            fill("rgba(0,0,20,0.2)")
            rect(j*size,i*size,size,size)
            // console.log("a")
        }
    }
  } else{
  for(let i = 0; i < gridmaxY; i++){
      for(let j = 0; j < gridmaxX; j++){
          fill(inArray[gridmaxX * i + j])
            rect(j*size,i*size,size,size) 
        }
    }
  }
}


function inListR(inp,arr){
  for(let i = 0; i < arr.length; i++){
    if(inp = arr[i]){
      return(i)
    }
  } return(false)
}

KeyboardEvent.repeat = false
document.addEventListener('keydown', (event) => {
  var name = event.key;
  if(inListR(name,currentlyPressedKeys)===false){
    currentlyPressedKeys.push(name)
    console.log(name,currentlyPressedKeys)
    let packet = []
    if(name != "e"){
    packet = [playerID,name]}
    if(name == "e"){
    packet = [playerID,name,player.x,player.y,mouseToPos()]
    }
    socket.emit('keyToSer',packet)

  }

}, false);
document.addEventListener('keyup', (event) => {
  var name = event.key;
  currentlyPressedKeys.splice(inListR(name,currentlyPressedKeys),1)
}, false);

reloaded = true

document.addEventListener('mousedown', (event) => {
  if(reloaded){
    let m = mouseNormalVector()

    socket.emit('fireBullet',[player.x,player.y,m[0]*6,m[1]*6])
  }
})

function mouseNormalVector(){
  let m = mouseToPos()
  m[0] -= 40
  m[1] -= 40
  let d = distance(0,0,m[0],m[1])
  return([(m[0]/d),(m[1]/d)])
}

function decompress(arr){
  let out = []
  for(let i = 0; i < arr.length; i++){
    let t = arr[i] 
    if(typeof(arr[i]) == "number"){
      out.push("rgb("+t+","+t+","+t+")")
    }
  }

  return(out)
}

function distance(x,y,x2,y2){
  let a = x-x2
  let b = y-y2
  return(Math.sqrt(a*a+b*b))
}

function printables(arr){
  let out = []
  for(let i = 0; i < arr.length; i++){
    let ax = arr[i][0]
    let ay = arr[i][1]
    if(ax > player.x - 40 && ax < player.x + 40 && ay > player.y - 40 && ay < player.y + 40){
    out.push([ax,ay,arr[i][2]])}
    // console.log(out)
  }
  return(out)
}

function rectAtCoords(x,y,col){
  fill(col)
  rect(x*10,y*10,10,10)
}



function velocityOf(x,y){
  return(Math.abs(x)+Math.abs(y))
}



function toGridNum(x,y,e){
  return(x + y * e)
}

function frame(e){
  drawGrid(81,81,"fdark",10)
  let e2 = printables(e)
  for(let i = 0; i < e2.length; i++){
    rectAtCoords(e2[i][0] +40 - player.x,e2[i][1] +40 - player.y,e2[i][2])
  }
}

function mouseToPos(){
  return([Math.floor(mouseX/10),Math.floor(mouseY/10)])
}

function returnedmouse(e){
  rectAtCoords(e[0],e[1],"rgba(0,255,0,70)")
}


function repeat(){
  let m = mouseToPos()
  rectAtCoords(m[0],m[1],"rgba(255,0,0,0.5)")
  let mn = mouseNormalVector()
  let p = linePoints([0,0],[mn[0]*5,mn[1]*5])
  for(let i = 0; i< p.length; i++){
    rectAtCoords(p[i][0]+40,p[i][1]+40,"#505050")
  }
  // socket.emit('mousePos',[m,playerID])
}


function myFunction () {
   requestAnimationFrame(myFunction);
   repeat()
}
requestAnimationFrame(myFunction);
