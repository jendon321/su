angular.module('myApp', []).controller('GameController', ['$scope', function($scope) {
	
	$scope.size = 9;
	$scope.widths = [];
	$scope.heights = [];

	for(var i = 0; i < 8; i++) {
		$scope.widths.push(i);
		$scope.heights.push(i);
	}
	
}]);
var score = 0;
var puzzle_board = new Array(9);
var player_board = new Array(9); //player's answer
var board = new Array(9); //answer board

var gameOver = false;

var levels = [
	{
		name: 'EASY',
		showBoxes: 55
	},
	{
		name: 'MEDIUM',
		showBoxes: 45
	},
	{
		name: 'HARD',
		showBoxes: 30
	}
];
var levelOption = 0;

$(document).ready(function() {
	
	for(var i = 0; i < 9; i++) {
		$('#box-' + i + '-' + 2).css('border-bottom', '4px solid #004c4c');
		$('#box-' + i + '-' + 5).css('border-bottom', '4px solid #004c4c');
		$('#box-' + 2 + '-' + i).css('border-right', '4px solid #004c4c');
		$('#box-' + 5 + '-' + i).css('border-right', '4px solid #004c4c');

	}
	
	$('#level').html(levels[levelOption].name);
	
	new_board();
	
	$('.box').on('click', function() {
		if(gameOver) {
			resetGame();
			return;
		}
		$('.box').removeClass('wrong-answer');
		
		if($(this).hasClass('unclickable')) {
			return;
		}
		if(!$(this).hasClass('clicked')) {
			$('.box').removeClass('clicked');
		}
		$(this).toggleClass('clicked');
	});

	//Get the clicked keyboard
	$(document).keydown(function(event) {
		var key = event.which;
		
		if(key >= 37 && key <= 40) {
			var box = $('.clicked').attr('id').split('-');
			var x = box[1];
			var y = box[2];
			
			$('#box-' + x + '-' + y).removeClass('clicked');
			if(key === 37 && x > 0) { //LEFT
				x--;
			} else if(key === 38 && y > 0) { //UP
				y--; 
			} else if(key === 39 && x < 8) { //RIGHT
				x++;
			} else if(key === 40 && y < 8) { //DOWN
				y++;
			}
			$('#box-' + x + '-' + y).addClass('clicked');
		}
	});
	
	$(document).keypress(function(event) {
		if($('.clicked').hasClass('unclickable')) {
			return;
		}
		var key = event.which;
		if(key >= 48 && key <= 57) { //0-9
			var number = parseInt(String.fromCharCode(key));
			if(number === 0) {
				$('.clicked').html('');
			} else {
				$('.clicked').html(number);
				
				var box = $('.clicked').attr('id').split('-');
				var x = box[1];
				var y = box[2];
				player_board[x][y] = number;
			}
			//$('.box').removeClass('clicked');
		}
	});
	

	//options bar
	$('.level-btn').on('click', function() {
		levelOption === levels.length - 1 ? levelOption = 0 : levelOption++;
		$('#level').html(levels[levelOption].name);
		resetGame();
		restScore();
		
		
	});
	
	$('.reset-btn').on('click', function() {
		resetGame();
	});

	$('.help-btn').on('click', function() {
		checkBoard();
	});
	$('.check-btn').on('click', function() {
		gameOver = true;
		showAnswer();
	});

});

//FUNCTIONS

function new_board() {
	var counter = 1, k1, k2, i, j;
	i = 0;
	while(i < 9) {
		puzzle_board[i] = new Array(9);
		board[i] = new Array(9);
		player_board[i] = new Array(9);
		i++;
	}

	generate();
	generate_random(0);
	generate_random(1);

	var n = [0, 3, 6];
	for(var i = 0; i < 2; i++) {
		k1 = n[ Math.floor(Math.random() * n.length) ];
		do {
			k2 = n[ Math.floor(Math.random() * n.length) ];
		} while(k1 === k2);
		if(counter === 1) {
			row_change(k1, k2);
		} else {
			col_change(k1, k2);
		}
		counter++;
	}

	for(i = 0; i < 9; i++) {
		for(j = 0; j < 9; j++) {
			puzzle_board[i][j] = board[i][j];
		}
	}

	/*
	//Striking out
	for(k1 = 0; k1 < 9; k1++) {
		for(k2 = 0; k2 < 9; k2++) {
			strike_out(k1, k2);
		}
	}
	*/

	//Select boxes to display in the new game by level
	var n = 0;
	while(n < levels[levelOption].showBoxes) {
		do {
			var box = Math.floor(Math.random() * 80);
			var i = box % 9;
			var j = Math.floor(box / 9);
		} while($('#box-' + i + '-' + j).hasClass('unclickable'));
		
		$('#box-' + i + '-' + j).html(board[i][j]);
		$('#box-' + i + '-' + j).addClass('unclickable');
		player_board[i][j] = board[i][j];
		n++;
	}
}




//If user clicks on the wrong answer then 
function showAnswer() {
    var wrongAnswers = 0;
	for(var i = 0; i < 9; i++) {
		for(var j = 0; j < 9; j++) {
			var box = $('#box-' + i + '-' + j);
			
			box.html(board[i][j]);
			if(player_board[i][j] !== board[i][j]) {
                wrongAnswers++;
				box.addClass('wrong-answer');
			}
		}
	}

    if(wrongAnswers === 0) {
        alert('Congratulations! You won!');
		score = 0;
    } else if(wrongAnswers === 1){
        alert('You have one wrong answer!');
		score = 0;
    } else {
        alert('You have ' + wrongAnswers + ' wrong answers!');
		score++;
    }
	document.getElementById("score").innerHTML = score;
}
function checkBoard() {
    var wrongAnswers = 0;
	for(var i = 0; i < 9; i++) {
		for(var j = 0; j < 9; j++) {
			var box = $('#box-' + i + '-' + j);
			
			if(!box.hasClass('unclickable')
				&& box.html() !== ''
				&& player_board[i][j] !== board[i][j]) {
                
                wrongAnswers++;
				box.addClass('wrong-answer');
			}
		}
	}
    if(wrongAnswers === 0) {
        alert('Your answer is correct!');
    } else if(wrongAnswers === 1){
        alert('You have one wrong answer!');
    } else {
        alert('You have ' + wrongAnswers + ' wrong answers!');
    }
}
function restScore(){
	document.getElementById("score").innerHTML = 0;
	score = 0;
}
function resetGame() {
	
	$('.box').html('');
	$('.box').removeClass('unclickable');
	$('.box').removeClass('wrong-answer');
	$('.box').removeClass('clicked');

	new_board();
	
	gameOver = false;
}


//Generate the new board
function generate() {
	var k = 1, n = 1;
	for(var i = 0; i < 9; i++) {
		k = n;
		for(var j = 0; j < 9; j++) {
			if(k <= 9) {
				board[i][j] = k;
				k++;
			} else {
				k = 1;
				board[i][j] = k;
				k++;
			}
		}
		n = k + 3;
		if(k === 10) {
			n = 4;
		}
		if(n > 9) {
			n = (n % 9) + 1;
		}
	}
}

//Interchange rows and columns
function permutation_row(k1, k2) {
	var temp;
	for(var j = 0; j < 9; j++) {
		temp = board[k1][j];
		board[k1][j] = board[k2][j];
		board[k2][j] = temp;
	}
}

function permutation_col(k1, k2) {
	var temp;
	for(var j = 0; j < 9; j++) {
		temp = board[j][k1];
		board[j][k1] = board[j][k2];
		board[j][k2] = temp;
	}
}

//Interchange 2 groups of rows and columns
function row_change(k1, k2) {
	var temp;
	for(var n = 0; n < 3; n++) {
		for(var j = 0; j < 9; j++) {
			temp = board[k1][j];
			board[k1][j] = board[k2][j];
			board[k2][j] = temp;
		}
		k1++;
		k2++;
	}
}

function col_change(k1, k2) {
	var temp;
	for(var n = 0; n < 3; n++) {
		for(var j = 0; j < 9; j++) {
			temp = board[j][k1];
			board[j][k1] = board[j][k2];
			board[j][k2] = temp;
		}
		k1++;
		k2++;
	}
}

//Random generate board
//Call 2 times for both columns and rows permutation
function generate_random(check) {
	var k1, k2, max = 2, min = 0;
	//Loop for 3 groups
	for(var i = 0; i < 3; i++) {
		//k1 must not equal k2
		k1 = Math.floor((Math.random() * (max - min + 1)) + min);
		do {
			k2 = Math.floor((Math.random() * (max - min + 1)) + min);
		} while(k1 === k2);
		max += 3;
		min += 3;
		if(check === 1) {
			permutation_row(k1, k2);
		} else if(check === 0) {
			permutation_col(k1, k2);
		}
	}
}

function strike_out(k1, k2) {
	var row_from, row_to, col_from, col_to;
	var i, j, b, c;
	var rem1, rem2, flag, temp = board[k1][k2], count = 9;

	for(i = 1; i <= 9; i++) {
		flag = 1;
		for(j = 0; j < 9; j++) {
			if(j !== k2) {
				if(i !== board[k1][j]) {
					continue;
				} else {
					flag = 0;
					break;
				}
			}
		}
		if(flag === 1) {
			for(c = 0; c < 9; c++) {
				if(c !== k1) {
					if(i !== board[c][k2]) {
						continue;
					} else {
						flag = 0;
						break;
					}
				}
			}
		}
		if(flag === 1) {
			rem1 = k1 % 3;
			rem2 = k2 % 3;
			row_from = k1 - rem1;
			row_to = k1 + (2 - rem1);
			col_from = k2 - rem2;
			col_to = k2 + (2- rem2);

			for(c = row_from; c <= row_to; c++) {
				for(b = col_from; b <= col_to; b++) {
					if(c !== k1 && b !== k2) {
						if(i !== board[c][b]) {
							continue;
						} else {
							flag = 0;
							break;
						}
					}
				}
			}
		}
		if(flag === 0) {
			count--;
		}
	}
	if(count === 2) {
		puzzle_board[k1][k2] = 0;

	}
}