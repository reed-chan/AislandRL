Game.Item = function(properties) {
    properties = properties || {};
    // Call the glyph's construtor with our set of properties
    Game.Glyph.call(this, properties);
    // Instantiate any properties from the passed object
    this._char = properties['character'] || ' ';
    this._foreground = properties['foreground'] || 'white';
    this._background = properties['background'] || 'black';
    this._name = properties['name'] || '';
};

Game.Item.prototype.getChar = function(){ 
    return this._char; 
};
Game.Item.prototype.getBackground = function(){
    return this._background;
};
Game.Item.prototype.getForeground = function(){ 
    return this._foreground; 
};

Game.Item.prototype.describe = function() {
    return this._name;
};

Game.Item.prototype.describeA = function() {
    return "" + this.describe();
}