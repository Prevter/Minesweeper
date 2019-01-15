FPS = 60;
width=15;
height=10;

//cellSize = window.innerHeight / height;

cellSize = 60;

bombsCount = 50;

function rand(a){
	return Math.floor(Math.random() * a);
}

function selTool(t){
	tool = t;
}

function setBombs(value){
	bombsCount = value;
	start();
}
function setWidth(value){
	width = value;
	start();
}
function setHeight(value){
	height = value;
	start();
}

function drawCell(x,y,width,height){
	ctx.fillStyle="white";
	ctx.fillRect(x,y,width,height/10);
	ctx.fillRect(x,y,width/10,height);
	ctx.fillStyle="grey";
	ctx.beginPath();
	ctx.moveTo(x,y+height);
	ctx.lineTo(x+width,y);
	ctx.lineTo(x+width,y+height);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle="lightgrey";
	ctx.fillRect(x+width/10,y+height/10,width-(width/5),height-height/5);
}

function Cell(x,y){
	this.x = x;
	this.y = y;
	
	this.bomb = false;
	this.bombsCount = 0;
	
	this.active = false;
	this.flag = false;
	
	this.show = function (){
		if(this.active){
			if(this.bomb){
				ctx.fillRect(this.x*cellSize+cellSize/4,this.y*cellSize+cellSize/4,cellSize/2,cellSize/2);
			}
			else if(this.bombsCount !=0){
				ctx.fillText(this.bombsCount,this.x*cellSize+cellSize/3,this.y*cellSize+cellSize/1.5);
			}
		}
		else if(this.flag){
			drawCell(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
			ctx.fillStyle = "red";
			ctx.beginPath();
			ctx.moveTo(this.x*cellSize+cellSize/8,this.y*cellSize+cellSize/8);
			ctx.lineTo(this.x*cellSize+cellSize-cellSize/8,this.y*cellSize+cellSize-cellSize/8);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(this.x*cellSize+cellSize/8,this.y*cellSize+cellSize-cellSize/8);
			ctx.lineTo(this.x*cellSize+cellSize-cellSize/8,this.y*cellSize+cellSize/8);
			ctx.stroke();
		}
		else{
			drawCell(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
		}
		ctx.fillStyle = "grey";
		ctx.strokeRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
	};
	
	this.calcNeighbors = function(cells){
		for (var y=this.y-1; y <= this.y+1; y++){
			if(y>=0 && y < height){
				for (var x=this.x-1; x <= this.x+1; x++){
					if(x>=0 && x < width){
						if(cells[y][x].bomb){
							this.bombsCount++;
						}
					}
				}
			}
		}
	};
}

cnv = document.getElementById("game");
ctx = cnv.getContext("2d");

cnv.width = width*cellSize;
cnv.height = height*cellSize;

ctx.font = (cellSize/1.5)+"px Arial";

function engine(){
	ctx.clearRect(0,0,cnv.width,cnv.height);
	update();
}

cnv.addEventListener('click', function(event) {
    	x = Math.floor((event.pageX - cnv.offsetLeft)/cellSize);
        y = Math.floor((event.pageY - cnv.offsetTop)/cellSize);
        if(tool == 0){
        	if(!cells[y][x].flag){
    	   	 cells[y][x].active = true;
     		   if(cells[y][x].bomb){
      	  		alert("Game over!");
        			bombs.forEach(function(bomb){
      	  			cells[bomb[1]][bomb[0]].active = true;
      	 		});
   	  	   }
  	  	}
        }
        else{
        	cells[y][x].flag = !cells[y][x].flag;
        }
});
//Main functions:

cells = [];
bombs = [];

function start(){
	cnv.width = width*cellSize;
	cnv.height = height*cellSize;
	ctx.font = (cellSize/1.5)+"px Arial";
	cells = [];
	bombs = [];
	tool = 0;
	finishOnce = false;
	for (var y=0; y < height; y++){
		lineX = [];
		for (var x=0; x < width; x++){
			cell = new Cell(x,y);
			lineX.push(cell);
		}
		cells.push(lineX);
	}
	var i=0;
	while(i<bombsCount){
		x = rand(width);
		y = rand(height);
		if(!cells[y][x].bomb){
			i++;
			cells[y][x].bomb = true;
			bombs.push([x,y]);
		}
	}
	cells.forEach(function(line) {
		line.forEach(function(cell){
			cell.calcNeighbors(cells);
		});
	});
}

function update(){
	cells.forEach(function(line) {
		line.forEach(function(cell){
			cell.show();
		});
	});
	finished=0
	bombs.forEach(function(b) {
		if(cells[b[1]][b[0]].flag){
			finished = ++;
		}
	});
	if(finished==bombsCount && !finishOnce && ){
		alert("You win!");
		finishOnce = true;
	}
}

start();
setInterval(engine,1000/FPS);