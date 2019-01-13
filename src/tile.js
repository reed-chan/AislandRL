Game.Tile = function(properties) {
    properties = properties || {};
    // Call the Glyph constructor with our properties
    Game.Glyph.call(this, properties);
    this._char = properties['character'] || ' ';
    this._foreground = properties['foreground'] || 'white';
    this._background = properties['background'] || 'black';
    // Set up the properties. We use false by default.
    this._walkable = properties['walkable'] || false;
    // this._diggable = properties['diggable'] || false;
    this._blocksLight = (properties['blocksLight'] !== undefined) ?
    properties['blocksLight'] : true;
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
    return this._walkable;
}
Game.Tile.prototype.isDiggable = function() {
    return this._diggable;
}
Game.Tile.prototype.isBlockingLight = function() {
    return this._blocksLight;
}

Game.Tile.nullTile = new Game.Tile({})
Game.Tile.floorTile = new Game.Tile({
    character: '·',
    foreground: '#A1A1A1',
    walkable: true,
    blocksLight: false
});
Game.Tile.wallTile = new Game.Tile({
    character: '墙',
    foreground: '#8B7500',
    // diggable: true
});
Game.Tile.stairsUpTile = new Game.Tile({
    character: '<',
    foreground: 'red',
    walkable: true,
    blocksLight: false
});
Game.Tile.stairsDownTile = new Game.Tile({
    character: '>',
    foreground: 'red',
    walkable: true,
    blocksLight: false
});

Game.getNeighborPositions = function(x, y) {
    var tiles = [];
    // Generate all possible offsets
    for (var dX = -1; dX < 2; dX ++) {
        for (var dY = -1; dY < 2; dY++) {
            // Make sure it isn't the same tile
            if (dX == 0 && dY == 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }
    return tiles.randomize();
}
Array.prototype.random = function() {
	if (!this.length) { return null; }
	return this[Math.floor(ROT.RNG.getUniform() * this.length)];
}
Array.prototype.randomize = function() {
	var result = [];
	while (this.length) {
		var index = this.indexOf(this.random());
		result.push(this.splice(index, 1)[0]);
	}
	return result;
}