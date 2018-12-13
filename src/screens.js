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
    _map:null,
    _player:null,

    enter:function() {
        var map = [];
        var mapWidth = 80;
        var mapHeight = 40;
        for(var x=0; x<mapWidth;x++) {
            map.push([]);
            for(var y=0;y<mapHeight;y++) {
                map[x].push(Game.Tile.nullTile);
            }
        };
        var generator = new ROT.Map.Digger(mapWidth,mapHeight);
        generator.create(function(x,y,v) {
            if (v === 0) {
                map[x][y] = Game.Tile.floorTile;
            } else {
                map[x][y] = Game.Tile.wallTile;
            }
        });
        this._map = new Game.Map(map);
        this._player = new Game.Entity(Game.PlayerTemplate);
        var position = this._map.getRandomFloorPosition();
        this._player.setX(position.x);
        this._player.setY(position.y);        
    },
    exit:function() { },
    render:function(display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        // Make sure the x-axis doesn't go to the left of the left bound
        var topLeftX = Math.max(0, this._player.getX() - (screenWidth / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth);
        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (screenHeight / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);
        // Iterate through all visible map cells
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                // Fetch the glyph for the tile and render it to the screen
                // at the offset position.
                var tile = this._map.getTile(x, y);
                display.draw(
                    x - topLeftX,
                    y - topLeftY,
                    tile.getChar(), 
                    tile.getForeground(), 
                    tile.getBackground())
            }
        }
        // Render the player
        display.draw(
            this._player.getX() - topLeftX, 
            this._player.getY() - topLeftY,    
            this._player.getChar(), 
            this._player.getForeground(), 
            this._player.getBackground()
        );
    },    
    handleInput:function(inputType, inputData) {
        if(inputType === 'keydown') {
            // If enter is pressed, go to the win screen
            // If escape is pressed, go to lose screen
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.winScreen);
            } else if (inputData.keyCode === ROT.VK_ESCAPE) {
                Game.switchScreen(Game.Screen.loseScreen);
            }
            // Movement
            if (inputData.keyCode === ROT.VK_LEFT) {
                this.move(-1, 0);
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.move(1, 0);
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.move(0, -1);
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.move(0, 1);
            }
        }
    },
    move:function(dX, dY) {
        var newX = this._player.getX() + dX;
        var newY = this._player.getY() + dY;
        // Try to move to the new cell
        this._player.tryMove(newX, newY, this._map);
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