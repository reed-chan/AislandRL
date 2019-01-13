Game.ItemRepository = new Game.Repository('items', Game.Item);

Game.ItemRepository.define('apple', {
    name: '苹果',
    character: '%',
    foreground: 'red'
});

Game.ItemRepository.define('rock', {
    name: '石头',
    character: '*',
    foreground: 'white'
});