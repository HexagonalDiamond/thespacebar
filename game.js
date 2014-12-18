var Crafty = require('craftyjs');

require('./progressbar'); // import 3rd party library from: https://github.com/mucaho/crafty-component-progressbar

Crafty.init(500,350);
/*
CONSTANTS
*/

//Internal
LEVEL_CHANGE = 1; // higher = harder leveling, smaller = easier leveling (side note: make this greater than 1 :D )

//Graphics
BORDER_WIDTH = 2;
BORDER_COLOR = "gray";
LEVEL_BAR_COLOR_NO = "#3399FF";
LEVEL_BAR_COLOR = "#11FF44";
LEVEL_TEXT_SIZE = "14pt";
LEVEL_TEXT_PADDING = 5;


Crafty.c("Border", {
	_border: null,
	init: function() {
		this._border = Crafty.e("2D, DOM, Color");
	},
	border: function(width, color) {
		this._border.color(color);
		this._border.x = this.x - width;
		this._border.y = this.y - width;
		this._border.w = this.w + (width * 2);
		this._border.h = this.h + (width * 2);
		return this;
	}
});

Crafty.c("XP", {
	_xp: 0,
	_xpForNextLevel: 1,
	_level: 1,
	init: function() {
		this.requires("2D, DOM, Text, Keyboard")
			.attr({z:100})
			.textColor("white")
			.bind("KeyDown", function (e) { if (e.key == Crafty.keys.SPACE) this.addXp(1) })
		this.progress = Crafty.e("Border, ProgressBar")
			.progressBar(300, false, LEVEL_BAR_COLOR_NO, LEVEL_BAR_COLOR)
			.attr({w:300, h:50, z: -5})
			.border(BORDER_WIDTH, BORDER_COLOR);
	},
	xp: function() {
		this.calculateLevel();
		this.progress.x = this.x - LEVEL_TEXT_PADDING;
		this.progress.y = this.y - LEVEL_TEXT_PADDING;
		this.progress.border(BORDER_WIDTH, BORDER_COLOR) // update border
		return this;
	},
	calculateLevel: function() {
		while(this._xp >= this._xpForNextLevel) {
			this._xp = this._xp - this._xpForNextLevel;
			this._level += 1;
			this._xpForNextLevel = Math.ceil(Math.pow(LEVEL_CHANGE, this._level));
		}
		this.progress.updateBarProgress(Math.ceil((this._xp / this._xpForNextLevel) * 300.0));
		this.text("Level "+this._level);
	},
	getLevel: function() {
		level = Math.floor(Math.log(this._xp) / Math.log(2));
		if(level < 0) { level = 0; }
		return level;
	},
	getXp: function() {
		return this._xp;
	},
	addXp: function(xp) {
		this._xp += xp;
		this.calculateLevel();
	}
})

Crafty.defineScene("main", function() {
	// Crafty.background('black');
	xp = Crafty.e("XP")
		.attr({ x: 50, y: 50, w: 300, h: 20, points: 0 })
		.text("Loading XP...")
		.textFont({
			size: LEVEL_TEXT_SIZE
		}).xp();
});
Crafty.enterScene("main");