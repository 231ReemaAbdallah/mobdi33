// المساعدة
            //<![CDATA[
/* Whatsapp Chat Widget by www.imintweb.com */
$(document).on("click", "#send-it", function () {
  var a = document.getElementById("chat-input");
  if ("" != a.value) {
    var b = $("#get-number").text(),
      c = document.getElementById("chat-input").value,
      d = "https://web.whatsapp.com/send",
      e = b,
      f = "&text=" + c;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    )
      var d = "whatsapp://send";
    var g = d + "?phone=" + e + f;
    window.open(g, "_blank");
  }
}),
  $(document).on("click", ".informasi", function () {
    (document.getElementById("get-number").innerHTML = $(this)
      .children(".my-number")
      .text()),
      $(".start-chat,.get-new").addClass("show").removeClass("hide"),
      $(".home-chat,.head-home").addClass("hide").removeClass("show"),
      (document.getElementById("get-nama").innerHTML = $(this)
        .children(".info-chat")
        .children(".chat-nama")
        .text()),
      (document.getElementById("get-label").innerHTML = $(this)
        .children(".info-chat")
        .children(".chat-label")
        .text());
  }),
  $(document).on("click", ".close-chat", function () {
    $("#whatsapp-chat").addClass("hide").removeClass("show");
  }),
  $(document).on("click", ".blantershow-chat", function () {
    $("#whatsapp-chat").addClass("show").removeClass("hide");
  });
//]]>

// xo
/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, https://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

// object.watch
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		enumerable: false,
		configurable: true,
		writable: false,
		value: function (prop, handler) {
			var oldval = this[prop],
				newval = oldval,
				getter = function () {
					return newval;
				},
				setter = function (val) {
					oldval = newval;
					return (newval = handler.call(this, prop, oldval, val));
				};

			if (delete this[prop]) {
				// can't watch constants
				Object.defineProperty(this, prop, {
					get: getter,
					set: setter,
					enumerable: true,
					configurable: true
				});
			}
		}
	});
}

// object.unwatch
if (!Object.prototype.unwatch) {
	Object.defineProperty(Object.prototype, "unwatch", {
		enumerable: false,
		configurable: true,
		writable: false,
		value: function (prop) {
			var val = this[prop];
			delete this[prop]; // remove accessors
			this[prop] = val;
		}
	});
}

//clone arrays
Array.prototype.clone = function () {
	var arr = [];

	for (var i = 0; i < this.length; i++) {
		if (Array.isArray(this[i])) {
			arr[i] = this[i].clone();

			continue;
		}

		arr[i] = this[i];
	}

	return arr;
};

//GAME OBJECT
function TicTacToe(aiActive, cellsPerRow) {
	this.numberOfCellsPerRow = cellsPerRow || 3;
	this.numberOfCells = this.numberOfCellsPerRow * this.numberOfCellsPerRow;
	this.aiActive = aiActive;

	this.players = {
		X: { points: 0, scoreElement: null, rounds: 0 },
		O: { points: 0, scoreElement: null, rounds: 0 }
	};

	this.totalRounds = 0;
	this.currentPlayer = null;
	this.gameCanvasElement = null;
	this.scoreBoardElement = null;
	this.gameBodyElement = null;
	this.gameFooterElement = null;
	this.cellElements = {};
	this.tableStructure = [];
	this.busy = false;
	this.ai = null;
	this.aiPlayerSym = "O";
	this.ai2 = null;
	this.ai2PlayerSym = "X";
	this.lastMove = [];

	this.init();
}

TicTacToe.prototype.eachPlayer = function (callback) {
	var players = Object.keys(this.players);

	for (i = 0; i < players.length; i++) {
		callback.apply(this, [players[i], this.players[players[i]]]);
	}
};

TicTacToe.prototype.eachCell = function (callback) {
	for (i = 0; i < this.cellElements.length; i++) {
		callback.apply(this, [this.cellElements[i]]);
	}
};

TicTacToe.prototype.helpers = {
	createElement: function (name, classes, id) {
		var element = document.createElement(name);

		if (id) {
			element.id = id;
		}

		if (classes && classes.length > 0) {
			element.classList.add.apply(element.classList, classes);
		}

		return element;
	},

	centerIndex: function () {
		return Math.floor(this.parent.numberOfCellsPerRow / 2);
	},

	isTheCenterCell: function (rowIndex, cellIndex) {
		return rowIndex == this.centerIndex() && cellIndex == this.centerIndex();
	},

	isCornerCell: function (rowIndex, cellIndex) {
		return rowIndex != this.centerIndex() && cellIndex != this.centerIndex();
	},

	isEdgeCell: function (rowIndex, cellIndex) {
		return (
			!this.isCornerCell(rowIndex, cellIndex) &&
			!this.isTheCenterCell(rowIndex, cellIndex)
		);
	}
};

TicTacToe.prototype.init = function () {
	this.helpers.parent = this;
	this.gameCanvasElement = document.getElementById("game-canvas");
	this.gameCanvasElement.classList.add("tic-tac-toe-game-canvas");
	this.createScoreBoardElement();
	this.watchPlayerChanges();
	this.setTableStructure();
	this.createGameBody();
	this.createGameFooter();
	this.setNextPlayer();
	this.setAi();
};

TicTacToe.prototype.setAi = function () {
	this.ai = new TicTacToeAI(this, this.aiPlayerSym);
	this.ai2 = new TicTacToeAI(this, this.ai2PlayerSym);

	setTimeout(
		function () {
			if (this.aiActive && this.currentPlayer === this.aiPlayerSym) {
				this.ai.nextMove();
			}
			// else if(this.aiActive && this.currentPlayer === this.ai2PlayerSym) {
			// 	this.ai2.nextMove();
			// }
		}.bind(this),
		20
	);
};

TicTacToe.prototype.watchPlayerChanges = function () {
	this.eachPlayer(function (sym, player) {
		player.watch(
			"points",
			function (prop, oldVal, newVal) {
				setTimeout(
					function () {
						this.updateScore();
					}.bind(this),
					0
				);

				return newVal;
			}.bind(this)
		);
	});

	this.watch("currentPlayer", function (prop, oldVal, newVal) {
		setTimeout(
			function () {
				this.eachPlayer(function (sym, player) {
					player.scoreElement.toogleCurrentClass();
				});
			}.bind(this),
			0
		);

		return newVal;
	});
};

TicTacToe.prototype.createScoreBoardElement = function () {
	this.scoreBoardElement = this.helpers.createElement("div", ["score-board"]);
	this.createPlayersScoreBoard();
	this.gameCanvasElement.append(this.scoreBoardElement);
};

TicTacToe.prototype.makePlayerSym = function (sym) {
	var self = this,
		continerEl = this.helpers.createElement("div", ["player-sym-continer"]),
		el = this.helpers.createElement("i", [
			"player-sym",
			"player-sym-" + sym.toLowerCase()
		]);

	continerEl.append(el);

	continerEl.animateIn = function (callback) {
		var icon = this.getElementsByTagName("i")[0];
		icon.classList.remove("out");

		if (callback) {
			icon.addEventListener("transitionend", callback.bind(self), { once: true });
		}
	};

	continerEl.animateOut = function (callback) {
		var icon = this.getElementsByTagName("i")[0];
		icon.classList.add("out");

		if (callback) {
			icon.addEventListener("transitionend", callback.bind(self), { once: true });
		}
	};

	continerEl.animateWin = function (callback) {
		var icon = this.getElementsByTagName("i")[0];
		icon.classList.add("win");

		icon.addEventListener(
			"animationend",
			function () {
				icon.classList.remove("win");

				if (callback) {
					callback.call(self);
				}
			},
			{ once: true }
		);
	};

	return continerEl;
};

TicTacToe.prototype.updateScore = function () {
	this.eachPlayer(function (sym, player) {
		player.scoreElement.updateScore();
	});
};

TicTacToe.prototype.createPlayersScoreBoard = function () {
	var self = this,
		playerSym,
		scoreNumberElement,
		playerScoreElement;

	this.eachPlayer(function (playerSym, player) {
		player.scoreElement = this.helpers.createElement("div", [
			"player-score",
			"player-" + playerSym.toLowerCase() + "-score"
		]);

		scoreNumberElement = this.helpers.createElement("span", [
			"player-score-number"
		]);

		player.scoreElement.updateScore = function () {
			var scoreElement = this.getElementsByTagName("span")[0];
			scoreElement.innerHTML = self.players[playerSym]["points"] || "-";
		};

		player.scoreElement.toogleCurrentClass = function () {
			this.classList.toggle("current-player", self.currentPlayer == playerSym);
		};

		player.scoreElement.append(this.makePlayerSym(playerSym));
		player.scoreElement.append(scoreNumberElement);

		this.scoreBoardElement.append(self.players[playerSym]["scoreElement"]);
	});

	this.updateScore();
};

TicTacToe.prototype.setTableStructure = function () {
	var numOfRows = this.numberOfCells / this.numberOfCellsPerRow,
		rowIndex,
		row,
		cellIndex;

	this.tableStructure = [];

	for (rowIndex = 0; rowIndex < numOfRows; rowIndex++) {
		row = [];

		for (cellIndex = 0; cellIndex < this.numberOfCellsPerRow; cellIndex++) {
			row.push(null);
		}

		this.tableStructure.push(row);
	}
};

TicTacToe.prototype.makeTableCellElement = function (rowIndex, cellIndex) {
	var self = this,
		cellClasses = [
			"game-table-cell",
			"game-table-cell-" + rowIndex + "-" + cellIndex,
			"game-table-cell-index-" + cellIndex
		],
		cell = this.helpers.createElement("div", cellClasses),
		cellInner = this.helpers.createElement("div", ["game-table-cell-inner"]),
		playerSymElement;

	this.eachPlayer(function (sym, player) {
		var element = (playerSymElement = this.makePlayerSym(sym));
		playerSymElement.animateOut();

		cell["animate_" + sym + "_in"] = function (callback) {
			element.animateIn(callback);
		};

		cell["animate_" + sym + "_out"] = function (callback) {
			element.animateIn(callback);
		};

		cell["animate_" + sym + "_win"] = function (callback) {
			element.animateWin(callback);
		};

		cellInner.append(playerSymElement);
	});

	cell.append(cellInner);

	cell.addEventListener("click", function () {
		self.onCellClicked(rowIndex, cellIndex, cell);
	});

	this.cellElements[rowIndex + ":" + cellIndex] = cell;

	return cell;
};

TicTacToe.prototype.makeTableRowElement = function (index, rowStructure) {
	var row = this.helpers.createElement("div", [
			"game-table-row",
			"game-table-row-" + index
		]),
		rowInner = this.helpers.createElement("div", ["game-table-row-innder"]),
		cellIndex;

	for (cellIndex = 0; cellIndex < rowStructure.length; cellIndex++) {
		rowInner.append(this.makeTableCellElement(index, cellIndex));
	}

	row.append(rowInner);

	return row;
};

TicTacToe.prototype.makeMainTableElement = function () {
	var table = this.helpers.createElement(
			"div",
			["main-game-table"],
			"tic-tac-toe-main-table"
		),
		rowIndex;

	for (rowIndex = 0; rowIndex < this.tableStructure.length; rowIndex++) {
		table.append(
			this.makeTableRowElement(rowIndex, this.tableStructure[rowIndex])
		);
	}

	return table;
};

TicTacToe.prototype.createGameBody = function () {
	this.gameBodyElement = this.helpers.createElement("div", ["game-body"]);
	this.gameBodyElement.append(this.makeMainTableElement());
	this.gameCanvasElement.append(this.gameBodyElement);
};

TicTacToe.prototype.createGameFooter = function () {
	var resetButton;

	this.gameFooterElement = this.helpers.createElement("div", ["game-footer"]);
	resetButton = this.helpers.createElement("button", ["reset-game-button"]);
	resetButton.innerHTML = "Reset the game";
	resetButton.addEventListener("click", this.resetGame.bind(this));
	this.gameFooterElement.append(resetButton);
	this.gameCanvasElement.append(this.gameFooterElement);
};

TicTacToe.prototype.onCellClicked = function (
	rowIndex,
	cellIndex,
	cellElement,
	isAI
) {
	var player;

	if (!isAI && (this.busy || this.tableStructure[rowIndex][cellIndex] != null)) {
		return;
	}

	if (!this.currentPlayer) {
		var playersSym = Object.keys(this.players)[0];
		this.currentPlayer = playersSym;
	}

	this.tableStructure[rowIndex][cellIndex] = this.currentPlayer;
	this.busy = true;
	player = this.players[this.currentPlayer];
	player.rounds++;
	this.totalRounds++;
	this.lastMove = [rowIndex, cellIndex];

	cellElement["animate_" + this.currentPlayer + "_in"](function () {
		var isWin = this.checkIfWin(rowIndex, cellIndex);

		if (isWin) {
			this.showWinScreen(isWin, cellElement, true);

			player.points += 1;
			this.currentPlayer = null;

			return;
		}

		if (this.totalRounds >= this.numberOfCells) {
			this.currentPlayer = null;

			// setTimeout(function() {
			// 	this.resetGame();
			// }.bind(this), 1000);

			return;
		}

		this.setNextPlayer();

		if (this.aiActive && this.currentPlayer === this.aiPlayerSym) {
			setTimeout(
				function () {
					this.ai.nextMove();
				}.bind(this),
				10
			);

			return;
		}
		// 		else if(this.aiActive && this.currentPlayer === this.ai2PlayerSym) {
		// 			setTimeout(function() {
		// 				this.ai2.nextMove();
		// 			}.bind(this), 10);

		// 			return;
		// 		}

		this.busy = false;
	});
};

TicTacToe.prototype.checkIfWin = function (
	rowIndex,
	cellIndex,
	playerSym,
	tableStructure
) {
	var player = this.players[this.currentPlayer],
		playerSym = playerSym || this.currentPlayer,
		tableStructure = tableStructure || this.tableStructure,
		centerIndex = Math.floor(this.numberOfCellsPerRow / 2),
		isTheCenterCell = rowIndex == centerIndex && cellIndex == centerIndex,
		isCornerCell = rowIndex != centerIndex && cellIndex != centerIndex,
		colIndex = cellIndex,
		currentIndex,
		rowFounds = [],
		colFounds = [],
		cornerFounds = [],
		centerLeftFounds = [],
		centerRightFounds = [];

	// if(player.rounds < this.numberOfCellsPerRow) {
	// 	return false;
	// }

	for (
		currentIndex = 0;
		currentIndex < this.numberOfCellsPerRow;
		currentIndex++
	) {
		if (isTheCenterCell || isCornerCell) {
			if (tableStructure[currentIndex][currentIndex] === playerSym) {
				centerLeftFounds.push([currentIndex, currentIndex]);

				if (centerLeftFounds.length >= this.numberOfCellsPerRow) {
					return centerLeftFounds;
				}
			}

			if (
				tableStructure[currentIndex][
					this.numberOfCellsPerRow - 1 - currentIndex
				] === playerSym
			) {
				centerRightFounds.push([
					this.numberOfCellsPerRow - 1 - currentIndex,
					currentIndex
				]);

				if (centerRightFounds.length >= this.numberOfCellsPerRow) {
					return centerRightFounds;
				}
			}
		}

		if (tableStructure[rowIndex][currentIndex] === playerSym) {
			rowFounds.push([rowIndex, currentIndex]);

			if (rowFounds.length >= this.numberOfCellsPerRow) {
				return rowFounds;
			}
		}

		if (tableStructure[currentIndex][colIndex] === playerSym) {
			colFounds.push([currentIndex, colIndex]);

			if (colFounds.length >= this.numberOfCellsPerRow) {
				return colFounds;
			}
		}
	}

	return false;
};

TicTacToe.prototype.setNextPlayer = function () {
	var playersSym = Object.keys(this.players),
		nextPlayerIndex,
		currentPlayerIndex;

	if (!this.currentPlayer) {
		this.currentPlayer = playersSym[0];

		return;
	}

	currentPlayerIndex = playersSym.indexOf(this.currentPlayer);
	nextPlayerIndex = currentPlayerIndex + 1;
	nextPlayerIndex = nextPlayerIndex >= playersSym.length ? 0 : nextPlayerIndex;
	this.currentPlayer = playersSym[nextPlayerIndex];
};

TicTacToe.prototype.showWinScreen = function (
	winIndexes,
	cellElement,
	dontReset
) {
	var self = this,
		dontReset = dontReset || false;

	for (var i = 0; i < winIndexes.length; i++) {
		var rowIndex = winIndexes[i][0],
			cellIndex = winIndexes[i][1],
			callback;

		if (i == winIndexes.length - 1 && !dontReset) {
			callback = function () {
				self.resetGame();
			};
		}

		this.cellElements[rowIndex + ":" + cellIndex][
			"animate_" + this.currentPlayer + "_win"
		](callback);
	}
};

TicTacToe.prototype.resetGame = function () {
	this.currentPlayer = null;
	this.eachPlayer(function (playerSyn, player) {
		player.rounds = 0;
	});

	this.gameBodyElement.innerHTML = "";
	this.gameBodyElement.append(this.makeMainTableElement());

	this.setNextPlayer();
	this.setTableStructure();
	this.totalRounds = 0;
	this.setAi();
	console.clear();

	this.busy = false;
};

function TicTacToeAI(gameInctence, aiPlayerSym) {
	this.game = gameInctence;
	this.tableStructure = this.game.tableStructure;
	this.syn = aiPlayerSym || this.game.aiPlayerSym;
	this.opponentSyn = this.syn == "O" ? "X" : "O";
	this.opponentMoves = [];
}

TicTacToeAI.prototype.markCell = function (rowIndex, cellIndex) {
	this.game.onCellClicked(
		rowIndex,
		cellIndex,
		this.game.cellElements[rowIndex + ":" + cellIndex],
		true
	);
};

TicTacToeAI.prototype.nextMove = function () {
	var tableStructureClone = this.tableStructure.slice(0),
		playerMoveCell,
		playerMoveRow,
		moves;

	moves = this.predicts();
	this.markCell(moves[0][0], moves[0][1]);

	return;
};

TicTacToeAI.prototype.getCenterCell = function () {
	return [this.game.helpers.centerIndex(), this.game.helpers.centerIndex()];
};

TicTacToeAI.prototype.getBoardCorners = function () {
	var lastIndex = this.game.numberOfCellsPerRow - 1;

	return [
		[0, 0],
		[0, lastIndex],
		[lastIndex, 0],
		[lastIndex, lastIndex]
	];
};

TicTacToeAI.prototype.getBoardSides = function () {
	var sides = [],
		rowIndex,
		cellIndex;

	for (rowIndex = 0; rowIndex < this.tableStructure.length; rowIndex++) {
		for (
			cellIndex = 0;
			cellIndex < this.tableStructure[rowIndex].length;
			cellIndex++
		) {
			if (this.game.helpers.isEdgeCell(rowIndex, cellIndex)) {
				sides.push([rowIndex, cellIndex]);
			}
		}
	}

	return sides;
};

TicTacToeAI.prototype.getEmptyBoardSides = function () {
	var sides = this.getBoardSides(),
		emptySides = [],
		i;

	for (i = 0; i < sides.length; i++) {
		if (this.tableStructure[sides[i][0]][sides[i][1]] == null) {
			emptySides.push(sides[i]);
		}
	}

	return emptySides;
};

TicTacToeAI.prototype.getEmptyBoardCorners = function () {
	var emptyCorners = [],
		corners = this.getBoardCorners(),
		i;

	for (i = 0; i < corners.length; i++) {
		if (this.tableStructure[corners[i][0]][corners[i][1]] === null) {
			emptyCorners.push(corners[i]);
		}
	}

	return emptyCorners;
};

TicTacToeAI.prototype.isEageIndex = function (index) {
	return index === 0 || index === this.game.numberOfCellsPerRow - 1;
};

TicTacToeAI.prototype.getEmptyCornersNextTo = function (rowIndex, cellIndex) {
	var corners = this.getEmptyBoardCorners(),
		emptyCorners = [],
		i,
		corner;

	for (i = 0; i < corners.length; i++) {
		corner = corners[i];

		if (rowIndex === corner[0] || cellIndex === corner[1]) {
			if (
				cellIndex - 1 === corner[1] ||
				cellIndex + 1 === corner[1] ||
				rowIndex - 1 === corner[0] ||
				rowIndex + 1 === corner[0]
			) {
				emptyCorners.push(corner);
			}
		}
	}

	return emptyCorners;
};

TicTacToeAI.prototype.getEmptyOppositeEageCell = function (
	rowIndex,
	cellIndex
) {
	var lastIndex = this.game.numberOfCellsPerRow - 1,
		opposite = null;

	if (this.isEageIndex(rowIndex)) {
		opposite = [rowIndex == lastIndex ? 0 : lastIndex, cellIndex];
	} else if (this.isEageIndex(cellIndex)) {
		opposite = [rowIndex, cellIndex == lastIndex ? 0 : lastIndex];
	}

	if (opposite && this.tableStructure[(opposite[0], opposite[1])] !== null) {
		return null;
	}

	return opposite ? opposite : null;
};

TicTacToeAI.prototype.random = function (max, min) {
	min = Math.ceil(min || 0);
	max = Math.floor(max || 100);

	return Math.floor(Math.random() * (max - min + 1)) + min;
};

TicTacToeAI.prototype.inCellesArray = function (celles, cell) {
	var newCelles = celles.map(function (cellArray) {
		return cellArray[0] + ":" + cellArray[1];
	});

	return newCelles.indexOf(cell[0] + ":" + cell[1]) != -1;
};

TicTacToeAI.prototype.getBestMovesToFork = function (
	forPlayer,
	tableStructure
) {
	var tableStructure = tableStructure || this.game.tableStructure,
		tableStructureClone,
		moves = [],
		moveWins,
		cellIndex,
		moveCell,
		moveRow,
		cell2Index,
		move2Cell,
		move2Row;

	for (cellIndex = 0; cellIndex < this.game.numberOfCells; cellIndex++) {
		moveRow = Math.floor(cellIndex / this.game.numberOfCellsPerRow);
		moveCell = cellIndex % this.game.numberOfCellsPerRow;
		tableStructureClone = tableStructure.clone();
		tableStructureClone[moveRow][moveCell] = forPlayer;

		if (
			tableStructure[moveRow][moveCell] !== null ||
			this.game.checkIfWin(moveRow, moveCell, forPlayer, tableStructureClone)
		) {
			continue;
		}

		moveWins = 0;
		for (cell2Index = 0; cell2Index < this.game.numberOfCells; cell2Index++) {
			move2Row = Math.floor(cell2Index / this.game.numberOfCellsPerRow);
			move2Cell = cell2Index % this.game.numberOfCellsPerRow;

			if (tableStructure[move2Row][move2Cell] !== null) {
				continue;
			}

			tableStructureClone = tableStructure.clone();
			tableStructureClone[moveRow][moveCell] = forPlayer;
			tableStructureClone[move2Row][move2Cell] = forPlayer;

			var wins = this.game.checkIfWin(
				move2Row,
				move2Cell,
				forPlayer,
				tableStructureClone
			);

			if (
				wins &&
				this.inCellesArray(wins, [moveRow, moveCell]) &&
				this.inCellesArray(wins, [move2Row, move2Cell])
			) {
				moveWins++;
			}
		}

		if (moveWins > 1) {
			moves.push([moveRow, moveCell]);
		}
	}

	return moves;
};

TicTacToeAI.prototype.getBestMovesToBlockFork = function (possibilities) {
	var tableStructureClone,
		forPlayer = this.syn,
		opponentPlayer = this.opponentSyn,
		moves = [],
		cellIndex,
		moveCell,
		moveRow,
		i,
		forkMove;

	for (i = 0; i < possibilities.length; i++) {
		forkMove = possibilities[i];

		for (cellIndex = 0; cellIndex < this.game.numberOfCells; cellIndex++) {
			moveRow = Math.floor(cellIndex / this.game.numberOfCellsPerRow);
			moveCell = cellIndex % this.game.numberOfCellsPerRow;

			if (this.game.tableStructure[moveRow][moveCell] !== null) {
				continue;
			}

			tableStructureClone = this.game.tableStructure.clone();
			tableStructureClone[forkMove[0]][forkMove[1]] = opponentPlayer;
			tableStructureClone[moveRow][moveCell] = forPlayer;
			var theBets = this.getBestMovesToFork(opponentPlayer, tableStructureClone);

			if (theBets.length > 0) {
				if (forPlayer === "O") {
					console.log("skip: " + moveRow + ":" + moveCell, theBets);
				}

				continue;
			}

			moves.push([moveRow, moveCell]);
		}
	}

	return moves;
};

TicTacToeAI.prototype.getWinMoves = function (forPlayer, tableStructure) {
	var tableStructureClone,
		tableStructure = tableStructure || this.game.tableStructure,
		moves = [],
		cellIndex,
		moveCell,
		moveRow;

	for (cellIndex = 0; cellIndex < this.game.numberOfCells; cellIndex++) {
		moveRow = Math.floor(cellIndex / this.game.numberOfCellsPerRow);
		moveCell = cellIndex % this.game.numberOfCellsPerRow;

		if (this.game.tableStructure[moveRow][moveCell] !== null) {
			continue;
		}

		tableStructureClone = tableStructure.clone();
		tableStructureClone[moveRow][moveCell] = forPlayer;

		if (this.game.checkIfWin(moveRow, moveCell, forPlayer, tableStructureClone)) {
			moves.push([moveRow, moveCell]);
		}
	}

	return moves;
};

TicTacToeAI.prototype.getWinMovesIn2Moves = function (forPlayer, exclude) {
	var tableStructureClone,
		moves = [],
		cellIndex,
		moveCell,
		moveRow,
		excludeIndex,
		needToContinue = false;

	for (cellIndex = 0; cellIndex < this.game.numberOfCells; cellIndex++) {
		moveRow = Math.floor(cellIndex / this.game.numberOfCellsPerRow);
		moveCell = cellIndex % this.game.numberOfCellsPerRow;

		if (exclude) {
			for (excludeIndex = 0; excludeIndex < exclude.length; excludeIndex++) {
				if (
					exclude[excludeIndex][0] === moveRow &&
					exclude[excludeIndex][1] === moveCell
				) {
					needToContinue = true;
				}
			}
		}

		if (needToContinue || this.game.tableStructure[moveRow][moveCell] !== null) {
			continue;
		}

		needToContinue = false;

		tableStructureClone = this.game.tableStructure.clone();
		tableStructureClone[moveRow][moveCell] = forPlayer;

		if (this.getWinMoves(forPlayer, tableStructureClone)) {
			moves.push([moveRow, moveCell]);
		}
	}

	return moves;
};

TicTacToeAI.prototype.predicts = function () {
	var tableStructureClone = this.tableStructure.slice(0),
		tempPredicts = [],
		predicts = [],
		mustMoves = [],
		forkBloks = [],
		blokMoves = [],
		winMoves = [],
		playerMoveCell,
		playerMoveRow,
		opposite,
		corners,
		opponentBestMovesToFork,
		opponentBestMovesToWin;

	if (this.game.lastMove.length > 0) {
		playerMoveCell = this.game.lastMove[1];
		playerMoveRow = this.game.lastMove[0];

		this.opponentMoves.push(this.game.lastMove);
	}

	if (this.syn === "O") {
		console.log("opponentMoves: ", this.opponentMoves);
	}

	if (this.game.totalRounds == 0) {
		corners = this.getEmptyBoardCorners();
		mustMoves.push(this.getCenterCell());
		mustMoves = mustMoves.concat(corners);
	}

	if (this.game.totalRounds == 1) {
		if (this.game.helpers.isCornerCell(playerMoveRow, playerMoveCell)) {
			mustMoves.push(this.getCenterCell());
		}

		if (this.game.helpers.isTheCenterCell(playerMoveRow, playerMoveCell)) {
			corners = this.getEmptyBoardCorners();
			mustMoves.push(corners[this.random(corners.length - 1)]);
		}

		if (this.game.helpers.isEdgeCell(playerMoveCell, playerMoveRow)) {
			tempPredicts = [this.getCenterCell()];
			opposite = this.getEmptyOppositeEageCell(playerMoveRow, playerMoveCell);

			if (opposite) {
				tempPredicts.push(opposite);
			}

			tempPredicts = tempPredicts.concat(
				this.getEmptyCornersNextTo(playerMoveRow, playerMoveCell)
			);
			mustMoves.push(tempPredicts[this.random(tempPredicts.length - 1)]);
		}
	}

	opponentBestMovesToFork = this.getBestMovesToFork(this.opponentSyn);

	if (opponentBestMovesToFork.length > 1) {
		forkBloks = this.getBestMovesToBlockFork(opponentBestMovesToFork);
	} else if (opponentBestMovesToFork.length > 0) {
		forkBloks.push(opponentBestMovesToFork[0]);
	}

	opponentBestMovesToWin = this.getWinMoves(this.opponentSyn);
	winMoves = this.getWinMoves(this.syn);

	if (winMoves.length == 1) {
		return winMoves;
	}

	if (opponentBestMovesToWin.length > 0) {
		if (this.syn === "O") {
			console.log(opponentBestMovesToWin, "opponentBestMovesToWin");
		}

		return opponentBestMovesToWin;
	}

	if (mustMoves.length > 0) {
		if (this.syn === "O") {
			console.log(mustMoves, "mustMoves");
		}

		return mustMoves;
	}

	winMoves = winMoves.concat(this.getBestMovesToFork(this.syn));

	if (forkBloks.length > 0) {
		if (this.syn === "O") {
			console.log(forkBloks, "forkBloks");
		}

		predicts = predicts.concat(forkBloks);
	}

	if (blokMoves.length > 0) {
		predicts = predicts.concat(blokMoves);
	}

	if (!predicts.length) {
		winMoves = winMoves.concat(this.getWinMovesIn2Moves(this.syn));
	}

	if (winMoves.length > 0) {
		predicts = predicts.concat(winMoves);
	}

	if (predicts.length > 1) {
		if (this.syn === "O") {
			console.log("befor sorting: ", predicts);
		}

		var movesScores = {},
			keys,
			i,
			key;

		if (this.syn === "O") {
			console.log("befor sorting: ", movesScores);
		}

		for (i = 0; i < predicts.length; i++) {
			key = predicts[i][0] + ":" + predicts[i][1];
			if (movesScores[key]) {
				movesScores[key]["score"]++;
			} else {
				movesScores[key] = {
					score: 0,
					value: predicts[i]
				};
			}
		}

		predicts = Object.keys(movesScores)
			.sort(function (a, b) {
				// console.log(movesScores[a]['score'], movesScores[b]['score'], 'sorting');
				if (movesScores[a]["score"] < movesScores[b]["score"]) return 1;
				if (movesScores[a]["score"] > movesScores[b]["score"]) return -1;
				return 0;
			})
			.map(function (key) {
				return movesScores[key]["value"];
			});
	}

	if (this.syn === "O") {
		console.log(predicts[0]);
	}

	return predicts;
};

var game = new TicTacToe(true, 3);
// السلايد
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("demo");
  let captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}
// 
// لايك
function myFunction(x) {
	x.classList.toggle("fa-thumbs-down");
  }