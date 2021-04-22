'use strict'

const path = require('path'),
    fs = require('fs')

module.exports = function PlayerLogger(mod) {
	const Message = require('../tera-message')
    const MSG = new Message(mod)
	
    let file = path.join(__dirname, '..', '..', 'player_logger', 'player-logger' + Date.now() + '.log');
    let enabled = true;
    mod.hook('S_SPAWN_USER', 15, e => {
        if(enabled) {
           // mod.command.message(`Рядом с Вами Игрок: ${e.name}`);
			MSG.chat("Рядом с Вами Игрок: " + MSG.YEL(`${e.name}`));
			//mod.command.message('Рядом с Вами Игрок: <font color="#E69F00">${e.name}</font>');
            console.log(`Рядом с Вами Игрок:  ${e.name}`);
            fs.appendFileSync(file,`${e.name}\n`);

        }
    });
    mod.command.add('mingzi', () => {
        enabled = !enabled;
        mod.command.message(`Player Logger ${enabled ? 'en' : 'dis'}abled`)
    })
}