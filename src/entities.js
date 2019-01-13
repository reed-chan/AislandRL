// Create our Mixins namespace
Game.Mixins = {};

Game.Mixins.MessageRecipient = {
    name: 'MessageRecipient',
    init: function(template) {
        this._messages = [];
    },
    receiveMessage: function(message) {
        this._messages.push(message);
    },
    getMessages: function() {
        return this._messages;
    },
    clearMessages: function() {
        this._messages = [];
    }
}

Game.Mixins.Sight = {
    name: 'Sight',
    groupName: 'Sight',
    init: function(template) {
        this._sightRadius = template['sightRadius'] || 5;
    },
    getSightRadius: function() {
        return this._sightRadius;
    }
}

Game.sendMessage = function(recipient, message, args) {
    // Make sure the recipient can receive the message 
    // before doing any work.
    if (recipient.hasMixin(Game.Mixins.MessageRecipient)) {
        // If args were passed, then we format the message, else
        // no formatting is necessary
        if (args) {
            message = vsprintf(message, args);
        }
        recipient.receiveMessage(message);
    }
}

Game.sendMessageNearby = function(map, centerX, centerY, centerZ, message, args) {
    // If args were passed, then we format the message, else
    // no formatting is necessary
    if (args) {
        message = vsprintf(message, args);
    }
    // Get the nearby entities
    entities = map.getEntitiesWithinRadius(centerX, centerY, centerZ, 7);
    // Iterate through nearby entities, sending the message if
    // they can receive it.
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].hasMixin(Game.Mixins.MessageRecipient)) {
            entities[i].receiveMessage(message);
        }
    }
}

// Define our Moveable mixin
Game.Mixins.Moveable = {
    name: 'Moveable',
    tryMove: function(x, y, z, map) {
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
            // If we are an attacker, try to attack
            // the target
            if (this.hasMixin('Attacker')) {
                this.attack(target);
                return true;
            } else {
                // If not nothing we can do, but we can't 
                // move to the tile
                return false;
            }
        // Check if we can walk on the tile
        // and if so simply walk onto it
        } else if (tile.isWalkable()) {        
            // Update the entity's position
            this.setPosition(x, y, z);
            return true;
        // Check if the tile is diggable, and
        // if so try to dig it
        } 
        // else if (tile.isDiggable()) {
        //     map.dig(x, y, z);
        //     return true;
        // }
        return false;
    }    
}

Game.Mixins.Destructible = {
    name: 'Destructible',
    init: function(template) {
        this._maxHp = template['maxHp'] || 10;
        // We allow taking in health from the template incase we want
        // the entity to start with a different amount of HP than the 
        // max specified.
        this._hp = template['hp'] || this._maxHp;
        this._defenseValue = template['defenseValue'] || 0;
    },
    getHp: function() {
        return this._hp;
    },
    getMaxHp: function() {
        return this._maxHp;
    },
    getDefenseValue: function() {
        return this._defenseValue;
    },
    takeDamage: function(attacker, damage) {
        this._hp -= damage;
        // If have 0 or less HP, then remove ourseles from the map
        if (this._hp <= 0) {
            Game.sendMessage(attacker, '你杀死了%s', [this.getName()]);
            Game.sendMessage(this, '你死了');
            this.getMap().removeEntity(this);
        }
    }
}

Game.Mixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',
    init: function(template) {
        this._attackValue = template['attackValue'] || 1;
    },
    getAttackValue: function() {
        return this._attackValue;
    },
    attack: function(target) {
        // Only remove the entity if they were attackable
        if (target.hasMixin('Destructible')) {
            var attack = this.getAttackValue();
            var defense = target.getDefenseValue();
            var max = Math.max(0, attack - defense);
            var damage = 1 + Math.floor(Math.random() * max);
            Game.sendMessage(this, '你攻击了%s并造成%d点伤害', 
                [target.getName(), damage]);
            Game.sendMessage(target, '%s攻击了你并造成%d点伤害', 
                [this.getName(), damage]);
            target.takeDamage(this, damage);
        }
    },
}

Game.Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
        // Re-render the screen
        Game.refresh();
        // Lock the engine and wait asynchronously
        // for the player to press a key.
        this.getMap().getEngine().lock();   
        this.clearMessages();     
    }
}

Game.Mixins.FungusActor = {
    name: 'FungusActor',
    groupName: 'Actor',
    init: function() {
        this._growthsRemaining = 5;
    },
    act: function() {
        if (this._growthsRemaining > 0) {
            if (Math.random() <= 0.02) {
                // Generate the coordinates of a random adjacent square by
                // generating an offset between [-1, 0, 1] for both the x and
                // y directions. To do this, we generate a number from 0-2 and then
                // subtract 1.
                var xOffset = Math.floor(Math.random() * 3) - 1;
                var yOffset = Math.floor(Math.random() * 3) - 1;
                // Make sure we aren't trying to spawn on the same tile as us
                if (xOffset != 0 || yOffset != 0) {
                    // Check if we can actually spawn at that location, and if so
                    // then we grow!
                    if (this.getMap().isEmptyFloor(this.getX() + xOffset,
                                                   this.getY() + yOffset,
                                                   this.getZ())) {
                        var entity = new Game.Entity(Game.FungusTemplate);
                        entity.setPosition(this.getX() + xOffset, 
                            this.getY() + yOffset, this.getZ());
                        this.getMap().addEntity(entity);
                        this._growthsRemaining--;
                        // Send a message nearby!
                        Game.sendMessageNearby(this.getMap(),
                            entity.getX(), entity.getY(), entity.getZ(),
                            '真菌生长...');
                    }                    
                }
            }
        }        
    }
}

// Player template
Game.PlayerTemplate = {
    character: '@',
    foreground: 'white',
    background: 'black',
    maxHp: 40,
    attackValue: 10,
    sightRadius: 5,
    mixins: [
        Game.Mixins.Moveable, 
        Game.Mixins.PlayerActor,
        Game.Mixins.Attacker,
        Game.Mixins.Destructible,
        Game.Mixins.MessageRecipient,
        Game.Mixins.Sight
    ]
}

Game.FungusTemplate = {
    name: '真菌',
    character: 'F',
    foreground: 'green',
    maxHp: 10,
    mixins: [
        Game.Mixins.FungusActor,
        Game.Mixins.Destructible
    ]
}