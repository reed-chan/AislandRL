Game.Tile = function(properties) {
    properties = properties || {};
    // Call the Glyph constructor with our properties
    Game.Glyph.call(this, properties);
    this._char = properties['character'] || ' ';
    this._foreground = properties['foreground'] || 'white';
    this._background = properties['background'] || 'black';
    // Set up the properties. We use false by default.
    this._isWalkable = properties['isWalkable'] || false;
    this._isDiggable = properties['isDiggable'] || false;
};
// Make tiles inherit all the functionality from glyphs
// Game.Tile.extend(Game.Glyph);

Game.Tile.prototype.getChar = function(){ 
    return this._char; 
}
Game.Tile.prototype.getBackground = function(){
    return this._background;
}
Game.Tile.prototype.getForeground = function(){ 
    return this._foreground; 
}

// Standard getters
Game.Tile.prototype.isWalkable = function() {
    return this._isWalkable;
}
Game.Tile.prototype.isDiggable = function() {
    return this._isDiggable;
}

Game.Tile.nullTile = new Game.Tile({})
Game.Tile.floorTile = new Game.Tile({
    character: '·',
    foreground: '#555',
    isWalkable: true
});
Game.Tile.wallTile = new Game.Tile({
    character: '墙',
    foreground: '#8B7500',
    // isDiggable: true
});
