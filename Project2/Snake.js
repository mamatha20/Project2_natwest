// Snake-Game Using JavaScript
class SnakePart {
    constructor(i, j) {
        this.i = i;
		this.j = j;}
}
class Snake {
	constructor(game, i, j, initialPartsAmount) {
        this.game = game;
		this.i = i;
		this.j = j;
		this.isAlive = true;
		this.iSpeed = 1;
		this.jSpeed = 0;
		this.parts = [];
		for (var index = 0; index < initialPartsAmount; index++)
			this.parts.push(new SnakePart(i-index, j));
		this.canChangeDirection = true;
		var _this = this;
		document.onkeydown = function (event) {
			_this.controller(event.which);
		};
    }
	controller(key) {
		if (key == 13) {
            this.game.isPaused = ! this.game.isPaused;
		}
		if (this.game.isPaused)
			return;
		if (key == 37 && this.jSpeed != 0 && this.canChangeDirection) {
			this.canChangeDirection = false;
			this.iSpeed = -1;
			this.jSpeed = 0;
		}
		if (key == 39 && this.jSpeed != 0 && this.canChangeDirection) {
			this.canChangeDirection = false;
			this.iSpeed = 1;
			this.jSpeed = 0;
		}
		if (key == 38 && this.iSpeed != 0 && this.canChangeDirection) {
			this.canChangeDirection = false;
			this.iSpeed = 0;
			this.jSpeed = -1;
		}
		if (key == 40 && this.iSpeed != 0 && this.canChangeDirection) {
			this.canChangeDirection = false;
			this.iSpeed = 0;
			this.jSpeed = 1;
        }
	}
	addPart() {
		var lastPart = this.parts[this.parts.length - 1];
		this.parts.push(new SnakePart(lastPart.i, lastPart.j));
	}
	update() {
		this.i += this.iSpeed;
		this.j += this.jSpeed;
		if (this.i > this.game.width - 1)
			this.i = 0;
		if (this.i < 0) {
			this.i = this.game.width -1
		}
		if (this.j > this.game.height - 1)
			this.j = 0;
		if (this.j < 0) {
			this.j = this.game.height - 1;
		}
		console.log(this.parts.length)
		for (var index = this.parts.length - 1; index >= 0; index--) {
			var part = this.parts[index];
			if (index != 0){
				part.i = this.parts[index - 1].i;
				part.j = this.parts[index - 1].j;
				if (this.i == part.i && this.j == part.j) {
					this.die();
				}
			}
			else {
				part.i = this.i;
				part.j = this.j;
			}
			this.game.grid.fillTile(part.i, part.j, "#FFD700");
		}
		this.canChangeDirection = true;
	}
	die() {
		this.isAlive = false;
	}
}
class Food {
	constructor(game) {
		this.game = game;
		this.placeFood();
	}
	placeFood() {
		this.i = Math.floor(Math.random() * this.game.width);
		this.j = Math.floor(Math.random() * this.game.height);
	}
	update() {
		this.game.grid.fillTile(this.i, this.j, "#006400");
	}
}
class RenderGrid {
	constructor(game) {
		this.game = game;
		this.grid = [];
		this.buildGrid();
	}
	buildGrid() {
		for (var i = 0; i < this.game.width; i++) {
			this.grid[i] = [];
			for (var j = 0; j < this.game.height; j++) {
				var divTile = document.createElement("div");
				divTile.style.position = "absolute";
				divTile.style.width = divTile.style.height = this.game.size + "px";
				divTile.style.left = i * this.game.size + "px";
				divTile.style.top = j * this.game.size + "px";
				this.game.divStage.appendChild(divTile);
				this.grid[i][j] = {
					div: divTile,
					isFilled: false,
					color: "white"
				};
			}
		}
	}
	fillTile(i, j, color) {
		if (this.grid[i]) {
			if (this.grid[i][j]) {
				var tile = this.grid[i][j];
				tile.isFilled = true;
				tile.color = color;
			}
		}
	}
	update() {
		for (var i = 0; i < this.game.width; i++) {
			for (var j = 0; j < this.game.height; j++) {
				var tile = this.grid[i][j];
				var newBackgroundColor = tile.isFilled ? tile.color : "#000000";
				tile.div.style.background = newBackgroundColor;
				tile.isFilled = false;
			}
		}
	}
}
class Game {
	constructor(size, fps, divStageId, spanScoreId, spanDeathsId, spanMaxScoreId) {
		this.width = size;
		this.height = size;
		this.size = size;
		this.fps = fps;
		this.isPaused = true;

		this.divStage = document.getElementById(divStageId);
		this.spanScore = document.getElementById(spanScoreId);
		this.spanDeaths = document.getElementById(spanDeathsId);
		this.spanMaxScore = document.getElementById(spanMaxScoreId);

		this.score = 0;
		this.deaths = 0;
		this.maxScore = this.score;
		this.grid = new RenderGrid(this);
		this.food = new Food(this);
		this.snake = new Snake(this, 5, 2, 3);

		var _this = this;
		this.interval = setInterval(function () {
			_this.update();
		}, 1000/this.fps);
	}
	update() {
		if (this.isPaused)
			return;
		this.spanScore.innerHTML = this.score;
		this.spanDeaths.innerHTML = this.deaths;
		this.spanMaxScore.innerHTML = this.maxScore;
		if (! this.snake.isAlive) {
			this.maxScore = this.score > this.maxScore ? this.score : this.maxScore;
			this.score = 0;
			this.deaths++;
			this.snake = new Snake(this, 5, 2, 3);
			this.food.placeFood();
		}
		this.food.update();
		this.snake.update();
		if (this.snake.i == this.food.i && this.snake.j == this.food.j) {
			this.food.placeFood();
			this.snake.addPart();
			this.score++;
		}
		this.grid.update();
	}
}
