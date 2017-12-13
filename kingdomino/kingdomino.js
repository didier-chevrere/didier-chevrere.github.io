
var pos = [1,2,3,4];
var newPos = [1,2,3,4];
var current = 0;
var turn = 0;
var firstDominoDrop;
var lastDominoDrop;
var xmin, xmax, ymin, ymax;
var score = [0,0,0,0];

function startTurn() {
	changeDomino();
	
	for (var i=0;i<nbPlayer;i++) movePion(pos[i], i+1, true);	
	for (var i=1;i<=nbPlayer;i++) {
		hideBoard(i);
		$("#next"+i).droppable('option', 'disabled', false);
	}
		
	current = 0;
	playerChoice();
}

function changeDomino(i){
	var list = [-1];
	for (var i=1;i<=nbPlayer;i++) {
		var find;
		do {
			list[i] = Math.floor( Math.random()*deck.length);
			find = 0;
			for (var j=1;j<i;j++) if (list[i]==list[j]) find = 1;
		} while (find!=0);
	}
		
	for (var i=1;i<=nbPlayer;i++) {
		var domino = deck[list[i]];
		$("#img1next"+i).attr("src","img/"+domino[0]+"_"+domino[1]+".png");
		$("#img2next"+i).attr("src","img/"+domino[3]+"_"+domino[4]+".png");
	}
	
	for (var i=nbPlayer;i>=1;i--)
		deck.splice(list[i], 1);
}

function playerChoice() {	
	$("#pion"+pos[current]).draggable('enable');
	$("#pion"+pos[current]).css("border", "2px solid red");
	displayBoard(pos[current]);
	displayKingdom();
}

function playerChoiceDone(index) {
	movePion(pos[current], index, false);
	newPos[index-1] = pos[current];
	$("#pion"+pos[current]).draggable('disable');
	$("#pion"+pos[current]).css("border", "0px");
	$("#next"+index).droppable('option', 'disabled', true);
	
	firstDominoDrop = '';
	dominoChoice();
}

function dominoChoice() {
	if (turn==0) {
		dominoChoiceDone();
		return;
	}
	
	$(".buttonBoard").attr("disabled", true);
	$(".buttonBoard").css("border", "0px");
	
	$("#img1curr"+(current+1)).draggable('enable');
	$("#img2curr"+(current+1)).draggable('enable');
	$("#curr"+(current+1)).css("border", "2px solid red");
}

function dominoSelect(helper) {
	var type = readType(helper);
	if (firstDominoDrop=='') {
		for (var i=0;i<9;i++)
			for (var j=0;j<9;j++) {
				var cell = $("#target"+pos[current]+"_"+i+"_"+j);
				if (readType(cell)=='f')
					updateCellDomino(cell, canDropDomino(i,j,type));
			}
	} else {
		for (var i=0;i<9;i++)
			for (var j=0;j<9;j++) {
				var cell = $("#target"+pos[current]+"_"+i+"_"+j);
				if (readType(cell)=='f') {
					cell.droppable('option', 'disabled', true);
					cell.css('visibility','hidden');
				}
			}
				
		var x = parseInt(firstDominoDrop[8]);
		var y = parseInt(firstDominoDrop[10]);
		var cell = $("#target"+pos[current]+"_"+(x+1)+"_"+y)
		if (isInKindom(x+1,y)) updateCellDomino(cell, readType(cell)=='f');
		cell = $("#target"+pos[current]+"_"+(x-1)+"_"+y)
		if (isInKindom(x-1,y)) updateCellDomino(cell, readType(cell)=='f');
		cell = $("#target"+pos[current]+"_"+x+"_"+(y+1))
		if (isInKindom(x,y+1)) updateCellDomino(cell, readType(cell)=='f');
		cell = $("#target"+pos[current]+"_"+x+"_"+(y-1))
		if (isInKindom(x,y-1)) updateCellDomino(cell, readType(cell)=='f');
	}
}

function updateCellDomino(cell, ok) {
	if (readType(cell)!='f') return;
	if (ok) {
		cell.droppable('option', 'disabled', false);
		cell.css('visibility','visible');
	} else {
		cell.droppable('option', 'disabled', true);
		cell.css('visibility','hidden');
	}	
}

function canDropDomino(x, y, type) {
	if (!isInKindom(x,y)) return false;
	var cellT = readType($("#target"+pos[current]+"_"+(x+1)+"_"+y));
	if (cellT==type || cellT=='p') return true;
	cellT = readType($("#target"+pos[current]+"_"+(x-1)+"_"+y));
	if (cellT==type || cellT=='p') return true;
	cellT = readType($("#target"+pos[current]+"_"+x+"_"+(y+1)));
	if (cellT==type || cellT=='p') return true;
	cellT = readType($("#target"+pos[current]+"_"+x+"_"+(y-1)));
	if (cellT==type || cellT=='p') return true;
	return false;
}

function dominoChoiceDone(event, ui) {
	if (turn!=0) {
		var cell = $("#"+event.target.id);
		cell.attr("src", ui.draggable.attr("src"));
		ui.draggable.attr("src", "img/blank.png");
		cell.droppable('option', 'disabled', true);
		if (firstDominoDrop=='') {
			firstDominoDrop = event.target.id;
			return;
		}
		lastDominoDrop = event.target.id;
	}
	if (turn!=0) {
		$(".buttonBoard").attr("disabled", false);
		$(".buttonBoard").css("border", "1px solid red");
	}
	else dominoChoiceValider();
}

function dominoChoiceAnnuler() {
	$("#img1curr"+(current+1)).attr('src', $('#'+firstDominoDrop).attr('src'));
	$("#img2curr"+(current+1)).attr('src', $('#'+lastDominoDrop).attr('src'));
	$('#'+firstDominoDrop).attr('src', 'img/free.png');
	$('#'+lastDominoDrop).attr('src', 'img/free.png');
	
	displayKingdom();
	firstDominoDrop = '';
	dominoChoice();
}

function dominoChoiceValider() {
	$("#curr"+(current+1)).css("border", "1px solid black");
	hideBoard(pos[current]);	
	updateScore();
	
	current=current+1;	
	$("#pion"+pos[current]).draggable('enable');
	$("#pion"+pos[current]).css("border", "2px solid red");
	
	$(".buttonBoard").attr("disabled", true);
	$(".buttonBoard").css("border", "0px");
	
	if (current==nbPlayer) endTurn();
	else playerChoice();
}

function endTurn() {
	for (var i=1;i<=nbPlayer;i++) {
		$("#img1curr"+i).attr("src", $("#img1next"+i).attr("src") );
		$("#img2curr"+i).attr("src", $("#img2next"+i).attr("src") );
	}
	
	for (var i=0;i<nbPlayer;i++) pos[i] = newPos[i];
	turn++;
	startTurn();
}

function readType(img) {
	if (!img.attr("src")) return '';
	return img.attr("src")[4];	
}

function readValue(img) {
	if (!img.attr("src")) return 0;
	if (readType(img)=='f' || readType(img)=='p') return 0;
	return parseInt(img.attr("src")[6]);	
}

function movePion(pion, pos, curr) {
	var e = curr?"#curr":"#next";
	var destX = $(e+pos).position().left + 30;
	var destY = $(e+pos).position().top + 30;
	$("#pion"+pion).animate({ "left": destX, "top": destY }, "fast" );
}

function computeCurentKindom() {
	xmin=-1, xmax=-1, ymin=-1, ymax=-1;
	for (var i=0;i<9;i++)
		for (var j=0;j<9;j++) {
			var cell = $("#target"+pos[current]+"_"+i+"_"+j);
			if (readType(cell)!='f') {
				if (xmin==-1 || xmin>i) xmin=i;
				if (xmax==-1 || xmax<i) xmax=i;
				if (ymin==-1 || ymin>j) ymin=j;
				if (ymax==-1 || ymax<j) ymax=j;
			}
		}
	var lx = 5 - (xmax-xmin+1);
	var ly = 5 - (ymax-ymin+1);
	xmin = xmin - lx;
	xmax = xmax + lx;
	ymin = ymin - ly;
	ymax = ymax + ly;
}

function displayKingdom() {
	computeCurentKindom();
	for (var i=0;i<9;i++)
		for (var j=0;j<9;j++) {
			var cell = $("#target"+pos[current]+"_"+i+"_"+j);
			cell.css('visibility', isInKindom(i,j)?'visible':'hidden' );
		}
}

function isInKindom(x, y) {
	return (x>=xmin && x<=xmax && y>=ymin && y<=ymax);
}

function updateScore() {
	var s = 0;	
	for (var i=0;i<9;i++)
		for (var j=0;j<9;j++) {
			var val = readValue($("#target"+pos[current]+"_"+i+"_"+j));
			var size = sizeOfZone(i,j);
			s += (val*size);
		}
	console.log("score = "+s);
	score[pos[current]] = s;
	$('#score'+(pos[current])).html(score[pos[current]]);
}

function sizeOfZone(x, y) {
	var t  = readType($("#target"+pos[current]+"_"+x+"_"+y));
	var b = new Array;
	for (var i=0;i<9;i++) {
		b[i] = new Array;
		for (var j=0;j<9;j++) {
			if (readType($("#target"+pos[current]+"_"+i+"_"+j))==t) b[i][j] = 0;
		}
	}
	b[x][y] = 1;
	var count = 1;
	var find = true;
	while(find) {
		find = false;
		for (var i=0;i<9;i++)
			for (var j=0;j<9;j++) {
				if (b[i][j]==0) {
					if ((i<8 && b[i+1][j]==1) || (i>0 && b[i-1][j]==1) || (j<8 && b[i][j+1]==1) || (j>0 && b[i][j-1])==1) {
						find = true;
						b[i][j] = 1;
						count++;
					}
					
				}
			}
	}
	return count;
}

function hideBoard(i) {
	$("#board"+i).css({ transform: 'scale(.5)' });
	$("#board"+i).appendTo( $("#otherBoards") );
}

function displayBoard(i) {
	$("#board"+i).css({ transform: 'scale(1)' });
	$("#board"+i).appendTo( $("#boards") );
}