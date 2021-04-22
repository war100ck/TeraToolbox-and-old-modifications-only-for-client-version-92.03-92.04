module.exports = function TPTeleport(mod) {
		const Message = require('../tera-message')
	const MSG = new Message(mod)
	
    const cmd = mod.command || mod.require.command;
    const path = require('path');

    const dungeons = jsonRequire('./teleport-list.json');
    mod.dispatch.addDefinition('C_REQUEST_EVENT_MATCHING_TELEPORT', 0, path.join(__dirname, 'C_REQUEST_EVENT_MATCHING_TELEPORT.0.def'));

    cmd.add('tpl', (value) => {
        if (value && value.length > 0) value = value.toLowerCase();
        if (value) {
            const loc = search(value);
            if (!loc) {
                cmd.message(`Не могу найти подземелье [${value}]`);
                return;
            }

            teleport(loc);
        } else {
            tpList();
        }
    });

    function jsonRequire(data) {
        delete require.cache[require.resolve(data)];
        return require(data);
    }

    const gui = {
        parse(array, title, d = '') {
            for (let i = 0; i < array.length; i++) {
                if (d.length >= 16000) {
                    d += `Превышен лимит данных графического интерфейса , некоторые значения могут отсутствовать.`;
                    break;
                }
                if (array[i].command) d += `<a href="admincommand:/@${array[i].command}">${array[i].text}</a>`;
                else if (!array[i].command) d += `${array[i].text}`;
                else continue;
            }
            mod.toClient('S_ANNOUNCE_UPDATE_NOTIFICATION', 1, {
                id: 0,
                title: title,
                body: d,
            });
        },
    };

    function tpList() {
        if (Object.keys(dungeons).length > 0) {
            let list = [];
            dungeons.forEach((x) => {
                list.push({
                    text: `<font color="${x.color}" size="+19">* ${x.city} ${x.province} ${x.camp} </font><br>`,
                    command: `t ${x.t[0]}`,
                });
            });
            gui.parse(list, `<font color="#E0B0FF">Список Телепортов</font>`);
            list = [];
        }
    }

    function search(value) {
        return dungeons.find((e) => e.t.map((x) => x.toLowerCase()).includes(value) || (value.length > 3 && e.camp.toLowerCase().includes(value)));
    }

    function teleport(loc) {
        let success = false;
        mod.send('C_REQUEST_EVENT_MATCHING_TELEPORT', 0, {
            quest: loc.quest,
            instance: loc.instance,
        });

        const zoneLoaded = mod.hook('S_LOAD_TOPO', 'raw', (e) => {
            success = true;
            mod.unhook(zoneLoaded);
            cmd.message(`Вы успешно телепортировались в ${loc.camp}.`);
			//MSG.raids(`Вы успешно телепортировались в ${loc.camp}.`);
			MSG.alert((`Вы успешно телепортировались в ${loc.camp}.`), 44);
        })

        mod.setTimeout(() => {
            if (!success) {
                mod.unhook(zoneLoaded);
                cmd.message(`Вы не можете телепортироваться в ${loc.camp}.`);
				MSG.alert((`Вы не можете телепортироваться в ${loc.camp}.`), 44);
            }
                
        }, 1000);
	}
};
