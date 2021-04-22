const config = require('./config.json');
const Vec3 = require('tera-vec3');

module.exports = function Velikaredirect(mod) {
	
	const chests = [81341, 81342],
	chestloc = new Vec3(52562, 117921, 4431),
	data = {
		7005: { // Velika
			spawn: new Vec3(-481, 6301, 1956),
			redirect: new Vec3(-341, 8665, 2180),
			w: -0.96
		}
	};

	let velikaredirect = config.velikaredirect,
	    ghilliereset = config.ghilliereset,
            boxredirect = config.boxredirect,
            banyaka = 81301,
	    reset = false;

    mod.command.add('velikaredirect', () => {			
            velikaredirect = !velikaredirect;
            mod.command.message(`Перенаправление в Велику ${velikaredirect ? "Включено" : "Отключено"}.`);
    });
	
    mod.command.add('ghilliereset', () => {		
            ghilliereset = !ghilliereset;
            mod.command.message(`Автосброс данжа Поляна Древней ${ghilliereset ? "Включено" : "Отключено"}.`);
    });
	
    mod.command.add('boxredirect', () => {		
            boxredirect = !boxredirect;
            mod.command.message(`Перенаправление к сундуку ${boxredirect ? "Включено" : "Отключено"}.`);
    });		

	mod.hook('S_BOSS_GAGE_INFO',3,(event) => {
		if(!boxredirect) return;
			if ((Number.parseInt(event.curHp) / Number.parseInt(event.maxHp)*10000)/100 <= 20 && event.templateId == banyaka) {
			    teleport();
		}
    });	
	
	mod.game.me.on('change_zone', (zone) => {
		if (!ghilliereset) return;
		if (zone == 9714 && reset) {
			mod.send('C_RESET_ALL_DUNGEON', 1, {});
			reset = false;
			mod.command.message('Поляна Древней была сброшена.');
		}
	});

	mod.hook('S_SPAWN_ME', 3, event => {
		if (!velikaredirect || !data[mod.game.me.zone]) return;
		if (event.loc.equals(data[mod.game.me.zone].spawn)) {
			event.loc = data[mod.game.me.zone].redirect;
			if (data[mod.game.me.zone].w)
				event.w = data[mod.game.me.zone].w;
		}
		return true;
	});

	mod.hook('S_SPAWN_NPC', 10, event => {
		if (!ghilliereset) return;
		if (event.huntingZoneId == 713 && chests.includes(event.templateId)) {
			reset = true;
			mod.command.message('Поляна Древней будет сброшена, когда вы в следующий раз войдете в Святилище Велики.');
		}
	});

	mod.hook('C_RESET_ALL_DUNGEON', 1, event => {
		if (!ghilliereset) return;
		if (mod.game.me.zone == 9713) {
			reset = false;
			mod.command.message('Поляна Древней была сброшена вручную.');
		}
	});
	
	function teleport() {
		mod.send('S_INSTANT_MOVE', 3, {
				gameId: mod.game.me.gameId,
				loc: chestloc,
				w: 0.18
			});
		return false;
	}
};
