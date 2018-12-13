Game.Screen = {};

Game.Screen.startScreen = {
    enter:function() { },
    exit:function() { },
    render:function(display) {
        display.drawText(1,1, "Aisland Roguelike","#6cf")
        display.drawText(1,2, "按下回车开始", "#f8b551")
    },
    handleInput:function(inputType, inputData) {
        if(inputType === 'keydown') {
            if(inputData.keyCode === ROT.KEYS.VK_RETURN) {
                Game.switchScreen(Game.Screen.playScreen);
            }
        }
    }
}
Game.Screen.playScreen = {
<<<<<<< HEAD
<<<<<<< HEAD
    _map:null,
    _centerX: 0,
    _centerY: 0,

    enter:function() {
        var map = [];
        var mapWidth = 100;
        var mapHeight = 50;
        for(var x=0; x<mapWidth;x++) {
            map.push([]);
            for(var y=0;y<mapHeight;y++) {
                map[x].push(Game.Tile.nullTile)
            }
        }
        var generator = new ROT.Map.Cellular(mapWidth,mapHeight);
        generator.randomize(0.5);
        var totalIterations = 3;
        for (var i = 0; i < totalIterations - 1; i++) {
            generator.create();
        }
        generator.create(function(x,y,v) {
            if (v === 1) {
                map[x][y] = Game.Tile.floorTile;
            } else {
                map[x][y] = Game.Tile.wallTile;
            }
        });
        this._map = new Game.Map(map);
    },
    exit:function() { },
    render:function(display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        var topLeftX = Math.max(0, this._centerX - (screenWidth / 2));
        topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth);
        var topLeftY = Math.max(0, this._centerY - (screenHeight / 2));
        topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);        
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                // Fetch the glyph for the tile and render it to the screen
                // at the offset position.
                var glyph = this._map.getTile(x, y).getGlyph();
                display.draw(
                    x - topLeftX,
                    y - topLeftY,
                    glyph.getChar(), 
                    glyph.getForeground(), 
                    glyph.getBackground());
            }
        };
        display.draw(
            this._centerX - topLeftX, 
            this._centerY - topLeftY,
            '@',
            'white',
            'black');
    },    
<<<<<<< HEAD
=======
    enter:function() { },
    exit:function() { },
    render:function(display) {
=======
    enter:function() { },
    exit:function() { },
    render:function(display) {
>>>>>>> parent of 846e40a... Screen scoll
        display.drawText(3,5, "%c{red}%b{white}This game is so much fun!");
        display.drawText(4,6, "Press [Enter] to win, or [Esc] to lose!");
    },
>>>>>>> parent of 846e40a... Screen scoll
=======
    move:function(dX, dY) {
        this._centerX = Math.max(0,Math.min(this._map.getWidth() - 1, this._centerX + dX));
        this._centerY = Math.max(0,Math.min(this._map.getHeight() - 1, this._centerY + dY));    
    },
>>>>>>> parent of cd5281f... 12/13
    handleInput:function(inputType, inputData) {
        if(inputType === 'keydown') {
            if(inputData.keyCode === ROT.KEYS.VK_RETURN) {
                Game.switchScreen(Game.Screen.winScreen);
            }
            else if (inputData.keyCode === ROT.KEYS.VK_ESCAPE) {
                Game.switchScreen(Game.Screen.loseScreen);
            }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            // Movement
            if (inputData.keyCode === ROT.VK_LEFT) {
=======

            if (inputData.keyCode === ROT.KEYS.VK_LEFT) {
>>>>>>> parent of cd5281f... 12/13
                this.move(-1, 0);
            } else if (inputData.keyCode === ROT.KEYS.VK_RIGHT) {
                this.move(1, 0);
            } else if (inputData.keyCode === ROT.KEYS.VK_UP) {
                this.move(0, -1);
            } else if (inputData.keyCode === ROT.KEYS.VK_DOWN) {
                this.move(0, 1);
<<<<<<< HEAD
            }
=======
>>>>>>> parent of 846e40a... Screen scoll
=======
>>>>>>> parent of 846e40a... Screen scoll
=======
            }   
>>>>>>> parent of cd5281f... 12/13
        }
    }
}
Game.Screen.winScreen = {
    enter:function() { },
    exit:function() { },
    render:function(display) {
        display.drawText(2, 1, "You WIN!");
    },
    handleInput:function(inputType, inputData) {

    }
}
Game.Screen.loseScreen = {
    enter:function() { },
    exit:function() { },
    render:function(display) {
        display.drawText(2, 1, "You LOSE!");
    },
    handleInput:function(inputType, inputData) {

    }
}