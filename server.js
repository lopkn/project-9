class wall{
	constructor(x,y){
		this.x = x
		this.y = y
		this.hp = 100
	}
	draw(){
		map.push([this.x,this.y,"#F0F0F0"])
		map.push([this.x+1,this.y,"#FFFFFF"])
		map.push([this.x,this.y+1,"#FFFFFF"])
		map.push([this.x+1,this.y+1,"#F0F0F0"])
	}
}


class player{
	constructor(id){
		this.id = id
		this.x = 0
		this.y = 0
		this.direction = "up"
		// this.Larm = 100
		// this.Rarm = 100
		// this.Lleg = 100
		// this.Rleg = 100
	}

	relay(){
		io.to(this.id).emit("updateData",[this.x,this.y])
		io.to(this.id).emit('frame',printables(map,this))
		// io.to(this.id).emit('players',players)
	}
	process(e){
		if(e == "w"){
			this.y -= 2
			this.direction = "up"
		} else if(e == "s"){
			this.y += 2
			this.direction = "down"
		} else if(e == "a"){
			this.x -= 2
			this.direction = "left"
		} else if(e == "d"){
			this.x += 2
			this.direction = "right"
		} else if(e == "m"){
			console.log(map)
		} else if(e[1] == "e"){
			walls.push(new wall(e[2]+e[4][0]-40,e[3]+e[4][1]-40))
		}
	}
	drawLb(){
		if(this.direction == "up"){
			return([this.x-1,this.y,"#FFFF00"])
		} else if(this.direction == "down"){
			return([this.x+1,this.y,"#FFFF00"])
		} else if(this.direction == "left"){
			return([this.x,this.y+1,"#FFFF00"])
		} else if(this.direction == "right"){
			return([this.x,this.y-1,"#FFFF00"])
		}
	}
	drawRb(){
		if(this.direction == "up"){
			return([this.x+1,this.y,"#FF0000"])
		} else if(this.direction == "down"){
			return([this.x-1,this.y,"#FF0000"])
		} else if(this.direction == "left"){
			return([this.x,this.y-1,"#FF0000"])
		} else if(this.direction == "right"){
			return([this.x,this.y+1,"#FF0000"])
		}
	}
		drawUb(){
		if(this.direction == "up"){
			return([[this.x+1,this.y+1,"#00FF00"],[this.x,this.y+1,"#00FF00"],[this.x-1,this.y+1,"#00FF00"]])
		} else if(this.direction == "down"){
			return([[this.x+1,this.y-1,"#00FF00"],[this.x,this.y-1,"#00FF00"],[this.x-1,this.y-1,"#00FF00"]])
		} else if(this.direction == "right"){
			return([[this.x-1,this.y,"#00FF00"],[this.x-1,this.y+1,"#00FF00"],[this.x-1,this.y-1,"#00FF00"]])
		} else if(this.direction == "left"){
			return([[this.x+1,this.y,"#00FF00"],[this.x+1,this.y+1,"#00FF00"],[this.x+1,this.y-1,"#00FF00"]])
		}
	}
			drawDb(){
		if(this.direction == "down"){
			return([[this.x+1,this.y+1,"#FF00FF"],[this.x,this.y+1,"#FF00FF"],[this.x-1,this.y+1,"#FF00FF"]])
		} else if(this.direction == "up"){
			return([[this.x+1,this.y-1,"#FF00FF"],[this.x,this.y-1,"#FF00FF"],[this.x-1,this.y-1,"#FF00FF"]])
		} else if(this.direction == "left"){
			return([[this.x-1,this.y,"#FF00FF"],[this.x-1,this.y+1,"#FF00FF"],[this.x-1,this.y-1,"#FF00FF"]])
		} else if(this.direction == "right"){
			return([[this.x+1,this.y,"#FF00FF"],[this.x+1,this.y+1,"#FF00FF"],[this.x+1,this.y-1,"#FF00FF"]])
		}
	}
	drawHd(){
		return([this.x,this.y,"#FFFFFF"])
	}
	retDraw(){
		let tr = []
		tr.push(this.drawLb())
		tr.push(this.drawRb())
		tr.push(this.drawHd())
		let u = this.drawUb()
		let d = this.drawDb()
		for(let i = 0; i < u.length; i++){
			tr.push(u[i])
		}
		for(let i = 0; i < d.length; i++){
			tr.push(d[i])
		}
		return(tr)
	}
}
function printables(arr,player){
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
class bullet{
	constructor(x,y,vx,vy){
		this.x = x
		this.y = y
		this.vx = vx
		this.vy = vy
		this.trail = []
		this.life = 100
	}

	updateNDraw(){
		this.life -= 1
		this.vx *= 0.99
		this.vy *= 0.99
		if(this.life > 0){

		let l = linePoints([Math.floor(this.x + this.vx), Math.floor(this.y + this.vy)],[Math.floor(this.x),Math.floor(this.y)])
		for(let i = 0; i < l.length; i++){
			this.trail.push(l[i])
		}
		this.trail.push([this.x,this.y])}
		if(this.life < 70){
			this.trail.splice(0,1)
		}



		for(let i = 0; i < walls.length; i++){
			let c = boxCol([[this.x,this.y],[this.x+this.vx,this.y+this.vy]],[walls[i].x,walls[i].y,2,2])
			if(c[0] != false || c[1] != false || c[2] != false || c[3] != false){
			walls[i].hp -= 20
		this.vx *= 0.5
		this.vy *= 0.5}
		}












		this.x += this.vx
		this.y += this.vy
if(this.life > 0){
		map.push([Math.floor(this.x),Math.floor(this.y),"rgba(255,255,0,"+this.life/100+")"])}
		for(let i = 0; i < this.trail.length; i++){
		map.push([Math.floor(this.trail[i][0]),Math.floor(this.trail[i][1]),"rgba(255,255,0,"+(this.life/100)*i/this.trail.length+")"])
	}
	}
}

var bullets = []
var players = []
var walls = []
var express = require('express');
var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("server is opened")

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection)



let map = [[10,10,"#FFFFFF"]]
// for(let i = 0; i < 10000; i++){
// 	map.push(Math.random()*255)
// }


function playerPosInArr(e){
	for(let i = 0; i < players.length; i++){
		if(e == players[i].id){
			return(i)
		}
	} return (false)
}


function processKey(e){
	let tid = playerPosInArr(e[0])
	if(tid === false){console.log(e[0],players[0].id);return}
	if(e[1]=="e"){
		players[tid].process(e)
	}else{
		players[tid].process(e[1])
	}
}

function newConnection(socket){
	socket.on('keyToSer', processKey)
	socket.on('mousePos',returnMouse)
	socket.on('fireBullet',createBullet)


	console.log(socket.id + " has joined")

	io.to(socket.id).emit('message', socket.id)
	io.to(socket.id).emit('frame',map)
	players.push(new player(socket.id))
	    socket.on('disconnect', function () {
        console.log(socket.id + " has disconnected");
        for(let i = 0; i < players.length; i++){
        	if(players[i].id == socket.id){
        		players.splice(i,1)
        		break
        	}
        }
    });
}

function createBullet(e){
	bullets.push(new bullet(e[0],e[1],e[2],e[3]))
}

function returnMouse(e){
	io.to(e[1]).emit("returnedMousePos",e[0])
}

function doSomething(){
		map = []
	for(let i = bullets.length-1; i > -1; i--){
		if(bullets[i].life <= 0){
			bullets.splice(i,1)
			
		}
	}

	for(let i = 0; i < bullets.length; i++){
		bullets[i].updateNDraw()
	}
	for(let i = walls.length-1; i > -1; i--){
		if(walls[i].hp <= 0){walls.splice(i,1)}else{
		walls[i].draw()}
	}
	for(let i = 0; i < players.length; i++){
		let ii = players[i].retDraw()
		for(let j = 0; j < 9; j++){
		map.push(ii[j])}
	}
	for(let i = 0; i < players.length; i++){
		players[i].relay()
	}

	
}


setInterval(function(){ 
    doSomething()
}, 100/6);

//////////////////////////////////////////////////////////////////////////////////////////////////////


function masterLineCollidor(line1,line2){
  let c = calculate(makeEquation(line1),makeEquation(line2),line1,line2)
  
  
  if(c != "inf"){c.push(pointOnLine(line1,line2,c));return(c)} else{return(false)}
}
function dline(ie){
  line(ie[0][0],ie[0][1],ie[1][0],ie[1][1])
}

function boxCol(line,box){
  let out = []
  let blines = []
  
  blines[0] = [[box[0],box[1]],[box[0],box[1]+box[3]]]
  blines[1] = [[box[0],box[1]],[box[0]+box[2],box[1]]]
  blines[2] = [[box[0]+box[2],box[1]+box[3]],[box[0],box[1]+box[3]]]
  blines[3] = [[box[0]+box[2],box[1]+box[3]],[box[0]+box[2],box[1]]]
  
  for(let i = 0; i < blines.length; i++){
  	let ccc = masterLineCollidor(line,blines[i])
  	if(ccc[2]!=false){out.push(ccc)}else{out.push(false)}
  }
  return(out)
}

function makeEquation(i){
  let tempGrad = (i[0][1]-i[1][1])/(i[0][0]-i[1][0])
  return[tempGrad,i[0][1]-tempGrad*i[0][0]]
}


function calculate(i1,i2,l1,l2){
  if(i1[0] != i2[0] && i1[0] != -1* i2[0]){
    let tempx = (i2[1]-i1[1])/(i1[0]-i2[0])
    
    let tempy = i1[0]*tempx + i1[1]
    if(i1[0] == "Infinity" || i1[0] == "-Infinity"){
      // console.log(i2[1])
      tempx = l1[0][0]
      tempy = i2[0]*tempx + i2[1]
    }
    if(i2[0] == "Infinity" || i2[0] == "-Infinity"){
      // console.log("c2")
      tempx = l2[0][0]
      tempy = i1[0]*tempx + i1[1]
    }
    
    return([tempx,tempy])
  } else return ("inf")
}
function pointOnLine(i1,i2,p){
  if(f(i1,p[0],p[1]) && f(i2,p[0],p[1])){return(true)}
  return(false)
}
function f(i,d,e){
  if(i[0][0] != i[1][0]){
  return((d >= i[0][0] && d <= i[1][0]) || (d <= i[0][0] && d >= i[1][0]))
  } else {
  return((e >= i[0][1] && e <= i[1][1]) || (e <= i[0][1] && e >= i[1][1]))
  }
}


