class wall{
	constructor(x,y){
		this.x = x
		this.y = y
		this.hp = 100
	}
	draw(){
		map.push([this.x,this.y,"#F0F0F055"])
		map.push([this.x+1,this.y,"#FFFFFF55"])
		map.push([this.x,this.y+1,"#FFFFFF55"])
		map.push([this.x+1,this.y+1,"#F0F0F055"])
	}
}


class bloodParticle{
	constructor(x,y,vx,vy,n){
		this.x = x
		this.y = y
		this.vx = vx * 0.4
		this.vy = vy * 0.4
		this.life = Math.random() * 100 + n
		this.limlife = Math.random() * 30 + 5
	}
	draw(){
		this.x += this.vx
		this.y += this.vy
		this.vx *= 0.8
		this.vy *= 0.8
		this.life -= 0.3
		this.limlife -= 1

		if(this.life > 100 && this.life*this.life > Math.random()* 1116850 && this.limlife < 0){
			this.life /= 2
			blood.push(new bloodParticle(this.x,this.y,Math.random() * 2 - 1, Math.random() * 2 - 1))
			blood[blood.length-1].life = this.life
		}

		map.push([Math.round(this.x),Math.round(this.y),"rgba(255,50,50,"+this.life/255+")"])
	}
}


class flash{
	constructor(x,y){
		this.x = x
		this.y = y
		this.life = 3
	}

}
class player{
	constructor(id){
		this.id = id
		this.x = 0
		this.y = 0
		this.hp = 100
		this.status = "normal"
		this.direction = "up"
		// this.Larm = 100
		// this.Rarm = 100
		// this.Lleg = 100
		// this.Rleg = 100
	}

	relay(){
		if(this.hp < 100){
		this.hp += 0.01}
		if(this.hp < 0){ this.hp = -1}
		if(this.hp < 70 && this.hp < Math.random()*70){blood.push(new bloodParticle(this.x,this.y,Math.random()*2.5-1.25,Math.random()*2.5-1.25,0))}
		if(this.hp < 50 && this.status != "concussion" && this.status != "dead"){this.status = "concussion"; io.to(this.id).emit('ring');}
		if(this.hp < 0){this.status = "dead";}
		io.to(this.id).emit("updateData",[this.x,this.y,this.status])
		io.to(this.id).emit('frame',printables(map,this))
		// io.to(this.id).emit('players',players)
	}
	process(e){
		if(this.status != "dead"){
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
	}}
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

function inarr(e,arr){
	for(let i = 0; i < arr.length; i++){
		if(arr[i] == e){return(true)}
	}
	return(false)
}


function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}
function velocityOf(x,y){
  return(Math.abs(x)+Math.abs(y))
}

class bullet{
	constructor(x,y,vx,vy,ids){
		this.ids = [ids]
		this.x = x
		this.y = y
		this.vx = vx
		this.vy = vy
		this.trail = []
		this.life = 100
	}

	updateNDraw(){
		this.life -= (4-velocityOf(this.vx,this.vy)/2)
		this.vx *= 0.99
		this.vy *= 0.99









		for(let i = 0; i < players.length; i++){
			if(distance(this.x,this.y,players[i].x,players[i].y)<30 && inarr(players[i].id,this.ids) === false){
			let c = boxCol([[this.x,this.y],[this.x+this.vx,this.y+this.vy]],[players[i].x-1,players[i].y-1,2.9999,2.9999])
			if(c != "noCol"){
				for(let i = 0; i < 4; i++){
					if(c[i] != false){
						map.push([c[i][0],c[i][1],"#FF0000"])
					}
				}
				if(c[0][2] == "shortest"){map.push([this.x,this.y,"#00FF00"])}
				if(c[1][2] == "shortest"){map.push([this.x,this.y,"#00FF00"])}
				if(c[2][2] == "shortest"){map.push([this.x,this.y,"#00FF00"])}
				if(c[3][2] == "shortest"){map.push([this.x,this.y,"#00FF00"])}

			players[i].hp -= velocityOf(this.vx,this.vy)
		io.to(players[i].id).emit('GotShot');
		for(let k = 0; k < Math.floor((players[i].hp/100) * velocityOf(this.vx,this.vy)); k++){
			blood.push(new bloodParticle(players[i].x,players[i].y,this.vx * Math.random() * 3, this.vy*3 * Math.random(),350))}
			players[i].x += Math.round(this.vx *Math.abs(players[i].hp) * 0.005)
			players[i].y += Math.round(this.vy *Math.abs(players[i].hp) * 0.005)
		this.vx *= 0.8
		this.vy *= 0.8}
	}
		}






		let walls2 = []


		for(let i = 0; i < walls.length; i++){
			let tempd = distance(this.x,this.y,walls[i].x,walls[i].y)
			if(tempd<30 && walls2.length < 1){
				walls2.push([walls[i],tempd])
				continue
			}
			if(tempd<30){
				for(let j = 0; j < walls2.length; j++){
					if(tempd < walls2[j][1]){
						walls2.splice(j,0,[walls[i],tempd])
						break
					}
				}
			}
		}

		let walls3 = []
		for(let i = 0; i < walls2.length; i++){
			walls3.push(walls2[i][0])
		}

		// console.log(walls3)




		for(let i = 0; i < walls3.length; i++){
			if(distance(this.x,this.y,walls3[i].x,walls3[i].y)<30){
			let c = boxCol([[this.x,this.y],[this.x+this.vx,this.y+this.vy]],[walls3[i].x,walls3[i].y,1.9999999999999,1.9999999999999])
			if(c != "noCol"){
				io.emit("ricochet",[this.x,this.y])
				this.ids = []
				for(let i = 0; i < 4; i++){
					if(c[i] != false){
						console.log(c[i])
						map.push([c[i][0],c[i][1],"#FF0000"])
					}
				}
				let ta = "E"
				let tb = "E"
				if(c[0][2] == "shortest"){this.vx *= -1; ta = c[0][0]; tb = c[0][1];map.push([this.x,this.y,"#00FF00"])}
				if(c[1][2] == "shortest"){this.vy *= -1; ta = c[1][0]; tb = c[1][1];map.push([this.x,this.y,"#00FF00"])}
				if(c[2][2] == "shortest"){this.vy *= -1; ta = c[2][0]; tb = c[2][1];map.push([this.x,this.y,"#00FF00"])}
				if(c[3][2] == "shortest"){this.vx *= -1; ta = c[3][0]; tb = c[3][1];map.push([this.x,this.y,"#00FF00"])}
						this.trail.push([this.x,this.y])
						let l2 = linePoints([Math.floor(ta), Math.floor(tb)],[Math.floor(this.x),Math.floor(this.y)])
		for(let i = 0; i < l2.length; i++){
			this.trail.push(l2[i])
		}
		if(ta != "E"){
				this.x = ta
				this.y = tb
}
			walls3[i].hp -= 20
		this.vx *= 0.5
		this.vy *= 0.5}
	}
		}





		if(this.life > 0){

		let l = linePoints([Math.floor(this.x + this.vx), Math.floor(this.y + this.vy)],[Math.floor(this.x),Math.floor(this.y)])
		for(let i = 0; i < l.length; i++){
			this.trail.push(l[i])
		}
		this.trail.push([this.x,this.y])}
		if(this.life < 70){
			this.trail.splice(0,1)
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
var blood = []


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


function createBullet(e){
	bullets.push(new bullet(e[0],e[1],e[2],e[3],e[4]))
	socket.broadcast.emit("fire",[e[0],e[1]])
}}

function returnMouse(e){
	io.to(e[1]).emit("returnedMousePos",e[0])
}

function doSomething(){
		map = []
		if(bullets.length > 0){
			map.push([0,0,"#FF00FF"])
		}


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

	for(let i = blood.length-1; i > -1; i--){
				if(blood[i].life <= 0){blood.splice(i,1)}else{
		blood[i].draw()}
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
}, 800/6);

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////










//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////


function masterLineCollidor(line1,line2){
  let c = calculate(makeEquation(line1),makeEquation(line2),line1,line2)
  
  
  if(c != "inf"){c.push(pointOnLine(line1,line2,c));return(c)} else{return(false)}
}
function dline(ie){
  line(ie[0][0],ie[0][1],ie[1][0],ie[1][1])
}

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
	if(out[0] ===false && out[1] ===false && out[2] === false && out[3] === false){
		return("noCol")
	}
	let out2 = []
	let fout = 0
	for(let i = 0; i < 4; i++){
		if(out[i] != false){
			out2.push([i,distance(line[0][0],line[0][1],out[i][0],out[i][1])])
		}
	}

	if(out2.length == 1){out[out2[0][0]][2] = "shortest"}else{

	for(let i = 0; i < out2.length; i++){
		for(let j = 0; j < out2.length; j++){
			if(i == j){continue}
			if(out2[i][1] > out2[j][i]){continue}
			fout = out2[i][0]	

		}
	}}

out[fout][2] = "shortest"


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


