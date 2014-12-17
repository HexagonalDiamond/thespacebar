var Crafty = require('craftyjs');

require('./progressbar'); // import 3rd party library from: https://github.com/mucaho/crafty-component-progressbar

Crafty.init(500,350);

LEVEL_CHANGE = 1.5; // higher = harder leveling, smaller = easier leveling

Crafty.c("XP", {
	_xp: 0,
	_xpForNextLevel: 1,
	_level: 1,
	init: function() {
		
	},
	xp: function() {
		this.calculateLevel();
		return this;
	},
	calculateLevel: function() {
		if(this._xp >= this._xpForNextLevel) {
			this._xp = this._xp - this._xpForNextLevel;
			this._level += 1;
			this._xpForNextLevel = Math.ceil(Math.pow(LEVEL_CHANGE, this._level));
		}
		this.text("XP: "+this._xp+" / "+this._xpForNextLevel+" - LEVEL "+this._level);
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
	xp = Crafty.e("2D, DOM, Text, XP")
		.attr({ x: 20, y: 20, w: 300, h: 20, points: 0 })
		.text("Loading XP...")
		.textFont({
			size: "20pt"
		}).xp();
});
Crafty.enterScene("main");