const SettingsUI = require('tera-mod-ui').Settings;
const Vec3 = require('tera-vec3');

module.exports = function Solodungeon(mod) {
	const Message = require('../tera-message');
    const MSG = new Message(mod);
	
    const blacklist = [9713];
    const whitelist = [9031, 9032, 3016];

    let loot,
        zone;

    mod.command.add('бпп', () => {
        if (ui) {
            ui.show();
        } else {		
            mod.settings.fastsolo = !mod.settings.fastsolo;
            mod.command.message(`Быстрое прохождение соло испытаний ${mod.settings.fastsolo ? "Включен" : "Отключен"}.`);  // Обычный текст в чате
        }
    });
	
    mod.command.add('acereset', () => {
        if (ui) {
            ui.show();
        } else {		
            mod.settings.acereset = !mod.settings.acereset;
             mod.command.message(`Автоматический сброс ${mod.settings.acereset ? "Включен" : "Отлючен"}.`);  // Обычный текст в чате
        }
    });
		
    mod.hook('S_LOAD_TOPO', 3, event => {
        zone = event.zone;
        loot = {};
    });
        
    mod.hook('S_SPAWN_ME', 3, event => {
        if (!mod.settings.fastsolo) return;
        switch(zone) {
            case 9713: // Поляна Древней
                event.loc = new Vec3(52233, 117319, 4382)
                event.w = 1.5
                return true;
            case 9031: // Кошмарная Акаша - Богиня Эпидемий	
                event.loc = new Vec3(72424, 133968, -502)
                event.w = 1.5
                return true;
            case 9032: // Баракос - Владыка Лабиринта
                event.loc = new Vec3(28214, 178550, -1675)
                event.w = 1.5
                return true;
            case 3016: // Замок Лилит	
                event.loc = new Vec3(-99600, 58666, 8023)
                event.w = 1.55
                return true;			
            default: return;
        }
    });

    mod.hook('S_SPAWN_DROPITEM', 8, event => {
        if(!(blacklist.indexOf(event.item) > -1)) loot[event.gameId.toString()] = 1;
    });

    mod.hook('S_DESPAWN_DROPITEM', 4, event => {
        if(event.gameId.toString() in loot) delete loot[event.gameId.toString()];
        if(Object.keys(loot).length < 1 && zone > 9000) resetinstance();
    });

    function resetinstance() {
        if (!mod.settings.acereset) return;
        if((zone == 9031 || zone == 9032 || zone == 3016) && whitelist.indexOf(zone) > -1)  mod.send('C_RESET_ALL_DUNGEON', 1, null);
    }

	const data = {7005: {spawn: new Vec3(-481, 6301, 1956), redirect: new Vec3(-341, 8665, 2180), w: -0.96}};	
	const chestloc = new Vec3(52562, 117921, 4431);
	const chests = [81341, 81342];	

	let banyaka = 81301,
	    reset = false;

    mod.command.add('вр', () => {
        if (ui) {
            ui.show();
        } else {		
            mod.settings.velikaredirect = !mod.settings.velikaredirect;
            mod.command.message(`Перенаправление в Велику ${mod.settings.velikaredirect ? "Включено" : "Отключено"}.`);  // Обычный текст в чате
        }
    });
	
    mod.command.add('спд', () => {
        if (ui) {
            ui.show();
        } else {		
            mod.settings.ghilliereset = !mod.settings.ghilliereset;
            mod.command.message(`Автосброс данжа Поляна Древней ${mod.settings.ghilliereset ? "Включено" : "Отключено"}.`);  // Обычный текст в чате
        }
    });
	
    mod.command.add('ср', () => {
        if (ui) {
            ui.show();
        } else {		
            mod.settings.boxredirect = !mod.settings.boxredirect;
            mod.command.message(`Перенаправление к сундуку ${mod.settings.boxredirect ? "Включено" : "Отключено"}.`);  // Обычный текст в чате
        }
    });		

	mod.hook('S_BOSS_GAGE_INFO',3,(event) => {
		if(!mod.settings.boxredirect) return;
			if ((Number.parseInt(event.curHp) / Number.parseInt(event.maxHp)*10000)/100 <= 20 && event.templateId == banyaka) {
			    teleport();
		}
    });	

	mod.game.me.on('change_zone', (zone) => {
		if (!mod.settings.ghilliereset) return;
		if (zone == 9714 && reset) {
			mod.send('C_RESET_ALL_DUNGEON', 1, {});
			reset = false;
			//mod.command.message('Поляна Древней была сброшена.');  // Обычный текст в чате
			MSG.chat(MSG.BLU("~Поляна Древней~  ") + " была" + MSG.RED(" - Сброшена"));  // Цветной текст в чате
			MSG.alert((`Поляна Древней была - Сброшена.`), 43);
		}
	});

	mod.hook('S_SPAWN_ME', 3, event => {
		if (!mod.settings.velikaredirect || !data[mod.game.me.zone]) return;
		if (event.loc.equals(data[mod.game.me.zone].spawn)) {
			event.loc = data[mod.game.me.zone].redirect;
			if (data[mod.game.me.zone].w)
				event.w = data[mod.game.me.zone].w;
		}
		return true;
	});

	mod.hook('S_SPAWN_NPC', 11, event => {
		if (!mod.settings.ghilliereset) return;
		if (event.huntingZoneId == 713 && chests.includes(event.templateId)) {
			reset = true;
			//mod.command.message('Поляна Древней будет сброшена, когда вы в следующий раз войдете в Святилище Велики..');  // Обычный текст в чате
			MSG.chat(MSG.BLU("~Поляна Древней~  ") + MSG.YEL(" будет сброшена, когда вы в следующий раз войдете в") + MSG.BLU(" Святилище Велики.."));  // Цветной текст в чате
		}
	});

	mod.hook('C_RESET_ALL_DUNGEON', 1, event => {
		if (!mod.settings.ghilliereset) return;
		if (mod.game.me.zone == 9713) {
			reset = false;
			//mod.command.message('Поляна Древней была сброшена вручную.');  // Обычный текст в чате
			MSG.chat(MSG.BLU("~Поляна Древней~ ") + " была сброшена" + MSG.RED(" - Вручную"));  // Цветной текст в чате
			MSG.alert((`Поляна Древней была сброшена - Вручную.`), 43);
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

    let ui = null;
    if (global.TeraProxy.GUIMode) {
        ui = new SettingsUI(mod, require('./settings_structure'), mod.settings, { height: 255 }, { alwaysOnTop: true });
        ui.on('update', settings => { mod.settings = settings; });

        this.destructor = () => {
            if (ui) {
                ui.close();
                ui = null;
            }
        };
    }
};
