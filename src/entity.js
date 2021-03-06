Game.Entity = function(properties) {
    properties = properties || {};
    // Call the glyph's construtor with our set of properties
    Game.Glyph.call(this, properties);

    this._char = properties['character'] || ' ';
    this._foreground = properties['foreground'] || 'white';
    this._background = properties['background'] || 'black';
    // Instantiate any properties from the passed object
    this._name = properties['name'] || '';
    this._x = properties['x'] || 0;
    this._y = properties['y'] || 0;
    this._z = properties['z'] || 0;
    this._map = null;
    // Create an object which will keep track what mixins we have
    // attached to this entity based on the name property
    this._attachedMixins = {};
    // Create a similar object for groups
    this._attachedMixinGroups = {};
    // Setup the object's mixins
    var mixins = properties['mixins'] || [];
    for (var i = 0; i < mixins.length; i++) {
        // Copy over all properties from each mixin as long
        // as it's not the name or the init property. We
        // also make sure not to override a property that
        // already exists on the entity.
        for (var key in mixins[i]) {
            if (key != 'init' && key != 'name' && !this.hasOwnProperty(key)) {
                this[key] = mixins[i][key];
            }
        }
        // Add the name of this mixin to our attached mixins
        this._attachedMixins[mixins[i].name] = true;
        // If a group name is present, add it
        if (mixins[i].groupName) {
            this._attachedMixinGroups[mixins[i].groupName] = true;
        }
        // Finally call the init function if there is one
        if (mixins[i].init) {
            mixins[i].init.call(this, properties);
        }
    }
};
// Make entities inherit all the functionality from glyphs
// Game.Entity.extend(Game.Glyph);

Game.Entity.prototype.getChar = function(){ 
    return this._char; 
}
Game.Entity.prototype.getBackground = function(){
    return this._background;
}
Game.Entity.prototype.getForeground = function(){ 
    return this._foreground; 
}

Game.Entity.prototype.hasMixin = function(obj) {
    // Allow passing the mixin itself or the name as a string
    if (typeof obj === 'object') {
        return this._attachedMixins[obj.name];
    } else {
        return this._attachedMixins[obj] || this._attachedMixinGroups[obj];
    }
}

Game.Entity.prototype.setName = function(name) {
    this._name = name;
}
Game.Entity.prototype.setX = function(x) {
    this._x = x;
}
Game.Entity.prototype.setY = function(y) {
    this._y = y;
}
Game.Entity.prototype.getName = function() {
    return this._name;
}
Game.Entity.prototype.getX = function() {
    return this._x;
}
Game.Entity.prototype.getY   = function() {
    return this._y;
}
Game.Entity.prototype.setMap = function(map) {
    this._map = map;
}
Game.Entity.prototype.getMap = function() {
    return this._map;
}    
Game.Entity.prototype.setZ = function(z) {
    this._z = z;
}
Game.Entity.prototype.getZ = function() {
    return this._z;
}
Game.Entity.prototype.setPosition = function(x, y, z) {
    var oldX = this._x;
    var oldY = this._y;
    var oldZ = this._z;
    // Update position
    this._x = x;
    this._y = y;
    this._z = z;
    // If the entity is on a map, notify the map that the entity has moved.
    if (this._map) {
        this._map.updateEntityPosition(this, oldX, oldY, oldZ);
    }
}
Game.Entity.prototype.tryMove = function(x, y, z, map) {
    var map = this.getMap();
    // Must use starting z
    var tile = map.getTile(x, y, this.getZ());
    var target = map.getEntityAt(x, y, this.getZ());
    // If our z level changed, check if we are on stair
    if (z < this.getZ()) {
        if (tile != Game.Tile.stairsUpTile) {
            Game.sendMessage(this, "你不能从这里上楼");
        } else {
            Game.sendMessage(this, "你爬到了第%d层", [z + 1]);
            this.setPosition(x, y, z);
        }
    } else if (z > this.getZ()) {
        if (tile != Game.Tile.stairsDownTile) {
            Game.sendMessage(this, "你不能从这里下楼");
        } else {
            this.setPosition(x, y, z);
            Game.sendMessage(this, "你下到了第%d层", [z + 1]);
        }
    // If an entity was present at the tile
    } else if (target) {
        // An entity can only attack if the entity has the Attacker mixin and 
        // either the entity or the target is the player.
        if (this.hasMixin('Attacker') && 
            (this.hasMixin(Game.Mixins.PlayerActor) ||
             target.hasMixin(Game.Mixins.PlayerActor))) {
            this.attack(target);
            return true;
        } 
        // If not nothing we can do, but we can't 
        // move to the tile
        return false;        
    // Check if we can walk on the tile
    // and if so simply walk onto it
    } else if (tile.isWalkable()) {        
        // Update the entity's position
        this.setPosition(x, y, z);
        // Notify the entity that there are items at this position
        var items = this.getMap().getItemsAt(x, y, z);
        if (items) {
            if (items.length === 1) {
                Game.sendMessage(this, "你看见%s", [items[0].describeA()]);
            } else {
                Game.sendMessage(this, "地面上有许多东西");
            }
        }
        return true;
    // Check if the tile is diggable
    } 
    // else if (tile.isDiggable()) {
    //     // Only dig if the the entity is the player
    //     if (this.hasMixin(Game.Mixins.PlayerActor)) {
    //         map.dig(x, y, z);
    //         return true;
    //     }
    //     // If not nothing we can do, but we can't 
    //     // move to the tile
    //     return false;
    // }
};