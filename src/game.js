var Game = {
	_display:null,
	_currentScreen:null,

	init:function() {
		var displayOption = {
			width:60, 
			height:30,
			forceSquareRatio:true,
			fontSize: 18
		};
		this._display = new ROT.Display(displayOption);
		
		var game = this;
		var bindEventToScreen = function(event) {
			window.addEventListener(event, function(e) {
				if(game._currentScreen !== null) {
					game._currentScreen.handleInput(event, e);
				}
			});
		}
		bindEventToScreen('keydown');
		bindEventToScreen('keyup');
		bindEventToScreen('keypress');
	},

	getDisplay:function() {
		return this._display;
	},

	switchScreen:function(screen) {
		if(this._currentScreen !== null) {
			this._currentScreen.exit();
		}
		this.getDisplay().clear();
		this._currentScreen = screen;
		if(!this._currentScreen !== null) {
			this._currentScreen.enter();
			this._currentScreen.render(this._display);
		}
	}
}

window.onload = function() {
	Game.init();
	document.getElementById("gameArea").appendChild(Game.getDisplay().getContainer());
	Game.switchScreen(Game.Screen.startScreen);
}