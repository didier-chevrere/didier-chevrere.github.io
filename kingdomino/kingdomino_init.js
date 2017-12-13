
var color = ["blue", "green", "pink", "yellow"];
var nbPlayer = 4;

var deck = Array();

function init() {
	initPos();
	initDominos();
	initBoards();
	initDragNDrop();
}

function initDragNDrop() {
	for (var i=1;i<=nbPlayer;i++) {
		$("#pion"+i).draggable({ revert: "invalid" });
		$("#pion"+i).draggable('disable');
	}	
	
	$("#next1").droppable({ drop: function( event, ui ) { playerChoiceDone(1); }, accept: ".pion" });
	$("#next2").droppable({ drop: function( event, ui ) { playerChoiceDone(2); }, accept: ".pion" });
	$("#next3").droppable({ drop: function( event, ui ) { playerChoiceDone(3); }, accept: ".pion" });
	$("#next4").droppable({ drop: function( event, ui ) { playerChoiceDone(4); }, accept: ".pion" });
	
	for (var i=1;i<=nbPlayer;i++) {
		$("#img1curr"+i).draggable({ revert: "invalid", helper: "clone", start: function(event, ui) { dominoSelect(ui.helper) } });
		$("#img1curr"+i).draggable('disable');
		$("#img2curr"+i).draggable({ revert: "invalid", helper: "clone", start: function(event, ui) { dominoSelect(ui.helper) } });
		$("#img2curr"+i).draggable('disable');
	}
}

function initPos() {
	for (var i=0;i<1000;i++) {
		var a = Math.floor((Math.random() * nbPlayer));
		var b = Math.floor((Math.random() * nbPlayer));
		var tmp = pos[a];
		pos[a] = pos[b];
		pos[b] = tmp;
	}
}

function initBoards() {
	var targetM = $("#targetModel");
	var boardM = $("#boardModel");
	for (var p=1;p<=nbPlayer;p++) {
		var board = boardM.clone();
		board.attr("id", "board"+p);
		board.appendTo($("#boards"));
		for (var i=0;i<9;i++)
			for (var j=0;j<9;j++) {
				var cell = targetM.clone();
				cell.attr("id", "target"+p+"_"+j+"_"+i);
				cell.appendTo(board);
				cell.css("border", "0px");
				if (i==4 && j==4) cell.attr("src", "img/pion_castle_"+color[p-1]+".png");
				else {
					cell.droppable({ 
						drop: function( event, ui ) { dominoChoiceDone(event, ui); }, 
						accept: ".domino" });
				}
			}

		board.css('zIndex', '-10');
	}
	boardM.remove();
	targetM.remove();	
	$( "#boardValider" ).click(function() { dominoChoiceValider(); });
	$( "#boardAnnuler" ).click(function() { dominoChoiceAnnuler(); });
}

function initDominos() {
	// TODO ordonner les dominos
	deck.push("F0 F0");
	deck.push("F1 B0");
	deck.push("F1 B0");
	deck.push("F0 F0");
	deck.push("B0 H2");
	deck.push("F0 H0");
	deck.push("F1 H0");
	deck.push("F0 F0");
	deck.push("H1 L0");
	deck.push("F0 F0");
	deck.push("F0 B0");
	deck.push("F0 B1");
	deck.push("B0 H1");
	deck.push("B1 H0");
	deck.push("B0 H0");
	deck.push("H2 L0");
	deck.push("H0 H0");
	deck.push("L0 L0");
	deck.push("L0 F1");
	deck.push("L0 F0");
	deck.push("F1 B0");
	deck.push("F1 B0");
	deck.push("B0 D0");
	deck.push("B0 D0");
	deck.push("H0 H0");
	deck.push("L0 L0");
	deck.push("L1 F0");
	deck.push("L1 F0");
	deck.push("B0 B0");
	deck.push("B1 M0");
	deck.push("D0 M2");
	deck.push("D0 M2");
	deck.push("D0 D0");
	deck.push("D0 H0");
	deck.push("D0 H0");
	deck.push("L0 L0");
	deck.push("L1 F0");
	deck.push("L1 F0");
	deck.push("B0 B0");
	deck.push("B0 M2");
	deck.push("M1 B0");
	deck.push("M3 B0");
	deck.push("B0 D2");
	deck.push("B1 D0");
	deck.push("B0 L0");
	deck.push("L1 B0");
	deck.push("B1 L0");
	deck.push("L1 B0");
}