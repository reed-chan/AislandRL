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
    enter:function() { },
    exit:function() { },
    render:function(display) {
        display.drawText(3,5, "%c{red}%b{white}This game is so much fun!");
        display.drawText(4,6, "Press [Enter] to win, or [Esc] to lose!");
    },
    handleInput:function(inputType, inputData) {
        if(inputType === 'keydown') {
            if(inputData.keyCode === ROT.KEYS.VK_RETURN) {
                Game.switchScreen(Game.Screen.winScreen);
            }
            else if (inputData.keyCode === ROT.KEYS.VK_ESCAPE) {
                Game.switchScreen(Game.Screen.loseScreen);
            }
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