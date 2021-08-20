module.exports = function npcsummoner(script) {	
	///
	const path = require('path');
	const fs = require('fs');
	let config = {};
	let settingTimeout = null;	
	let npcId;
	let zoned = false;
	let type;
	let value;
	script.dispatch.addDefinition('C_REQUEST_CONTRACT', 50, path.join(__dirname, 'C_REQUEST_CONTRACT.50.def'));
	try { config = require('./config.json'); }
	catch (e) {
		config = {};
		settingUpdate();
	}

	function settingUpdate() {
		clearTimeout(settingTimeout);
		settingTimeout = setTimeout(settingSave,1000);
	}	
	function settingSave() {
		fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(config, undefined, '\t'), err => {
		});
	}
	let hw_zone = 7031
	if (("hw_zone" in config)) {
		hw_zone = config.hw_zone;
	}
	if (!("hw_zone" in config)) {
		config.hw_zone = 7031;
		settingUpdate();
	}
	let merchant_template = 2019
	if (("merchant_template" in config)) {
		merchant_template = config.merchant_template;
	}
	if (!("merchant_template" in config)) {
		config.merchant_template = 2019;
		settingUpdate();
	}
	let merchant_id = 3518437209224331
	if (("merchant_id" in config)) {
		merchant_id = config.merchant_id;
	}
	if (!("merchant_id" in config)) {
		config.merchant_id = 3518437209224331;
		settingUpdate();
	}
	let vg_template = 2058
	if (("vg_template" in config)) {
		vg_template = config.vg_template;
	}
	if (!("vg_template" in config)) {
		config.vg_template = 2058;
		settingUpdate();
	}
	let vg_id = 3518437209069257
	if (("vg_id" in config)) {
		vg_id = config.vg_id;
	}
	if (!("vg_id" in config)) {
		config.vg_id = 3518437209069257;
		settingUpdate();
	}
	let sp_template = 2109
	if (("sp_template" in config)) {
		sp_template = config.sp_template;
	}
	if (!("sp_template" in config)) {
		config.sp_template = 2109;
		settingUpdate();
	}
	let sp_id = 3518437209205338
	if (("sp_id" in config)) {
		sp_id = config.sp_id;
	}
	if (!("sp_id" in config)) {
		config.sp_id = 3518437209205338;
		settingUpdate();
	}
	
	let fishmonger_template = 2062
	if (("fishmonger_template" in config)) {
		fishmonger_template = config.fishmonger_template;
	}
	if (!("fishmonger_template" in config)) {
		config.fishmonger_template = 2062;
		settingUpdate();
	}
	let fishmonger_id = 3518437209066564
	if (("fishmonger_id" in config)) {
		fishmonger_id = config.fishmonger_id;
	}
	if (!("fishmonger_id" in config)) {
		config.fishmonger_id = 3518437209066564;
		settingUpdate();
	}
	
	let fishcratevendor_template = 9805
	if (("fishcratevendor_template" in config)) {
		fishcratevendor_template = config.fishcratevendor_template;
	}
	if (!("fishcratevendor_template" in config)) {
		config.fishcratevendor_template = 9805;
		settingUpdate();
	}
	let fishcratevendor_id = 3518437209069110
	if (("fishcratevendor_id" in config)) {
		fishcratevendor_id = config.fishcratevendor_id;
	}
	if (!("fishcratevendor_id" in config)) {
		config.fishcratevendor_id = 3518437209069110;
		settingUpdate();
	}
	
	let fishmerch_template = 2063
	if (("fishmerch_template" in config)) {
		fishmerch_template = config.fishmerch_template;
	}
	if (!("fishmerch_template" in config)) {
		config.fishmerch_template = 2063;
		settingUpdate();
	}
	let fishmerch_id = 3518437209063865
	if (("fishmerch_id" in config)) {
		fishmerch_id = config.fishmerch_id;
	}
	if (!("fishmerch_id" in config)) {
		config.fishmerch_id = 3518437209063865;
		settingUpdate();
	}
	
	let summons = [
		{
			"tname": "Банк",
			"name": "bank",
			"type": 26,
			"npcId": 0,
			"value": 1
		},
		{
			"tname": "Гильдейский Банк",
			"name": "gbank",
			"type": 26,
			"npcId": 0,
			"value": 3
		},
		{
			"tname": "Персональное Хранилище",
			"name": "petbank",
			"type": 26,
			"npcId": 0,
			"value": 9
		},
		{
			"tname": "Склад Костюмов",
			"name": "wardrobe",
			"type": 26,
			"npcId": 0,
			"value": 12
		},
		{
			"tname": "Торговец",
			"name": "merchant",
			"type": 9,
			"npcId": merchant_id,
			"value": 70310
		},		
		{
			"tname": "Торговец Авангарда",
			"name": "vg",
			"type": 49,
			"npcId": vg_id,
			"value": 609
		},
		{
			"tname": "Магазин Редкостей",
			"name": "sp",
			"type": 9,
			"npcId": sp_id,
			"value": 250
		},
		{
			"tname": "Торговый Брокер",
			"name": "broker",
		},
		{
			"tname": "Торговец ящиками с рыбой",
			"name": "fishcratevendor",
			"type": 93,
			"npcId": fishcratevendor_id,
			"value": 1001
		},
		{
			"tname": "Торговец Рыбой",
			"name": "fishmonger",
			"type": 93,
			"npcId": fishmonger_id,
			"value": 1000
		},
		{
			"tname": "Торговец Товарами Для Рыбалки",
			"name": "fishmerch",
			"type": 9,
			"npcId": fishmerch_id,
			"value": 16094
		},
		{
			"tname": "Магазин Рыбных Значков",
			"name": "angler",
			"type": 20,
			"npcId": 0,
			"value": 16095
		}	
	]
	
    script.command.add(["sum", "s" ], (arg) => {
        if (arg && arg.length > 0) arg = arg.toLowerCase();
        if (arg) {
			const summon = getSum(arg);
            if (!summon) {
                script.command.message(`Недействительный аргумент`);
                return;
            }
			if(summon && summon.name!="broker") {
				let buffer = Buffer.alloc(4);
				buffer.writeUInt32LE(Number(summon.value));
				script.send("C_REQUEST_CONTRACT", 50, {
					ContractType: summon.type,
					NpcCreatureId: summon.npcId,
					ValueParam: Number(summon.value),
					ContractRequestee: "",
					Param: buffer
				});	
			} else {
				script.toClient('S_NPC_MENU_SELECT', 1, {type:28});
			}				

        } else {
            sumMenu();
        }
    });
	
    const gui = {
        parse(array, title, d = '') {
            for (let i = 0; i < array.length; i++) {
                if (d.length >= 16000) {
                    d += `Превышен лимит данных графического интерфейса, некоторые значения могут отсутствовать.`;
                    break;
                }
                if (array[i].command) d += `<a href="admincommand:/@${array[i].command}">${array[i].text}</a>`;
                else if (!array[i].command) d += `${array[i].text}`;
                else continue;
            }
            script.toClient('S_ANNOUNCE_UPDATE_NOTIFICATION', 1, {
                id: 0,
                title: title,
                body: d,
            });
        },
    };	

    function sumMenu() {
        if (Object.keys(summons).length > 0) {
            let list = [];
            summons.forEach((x) => {
                list.push({
                    text: `<font size="+20">* ${x.tname} </font><br>`,
                    command: `sum ${x.name}`,
                });
            });
            gui.parse(list, `<font color="#E0B0FF">Меню призыва NPC</font>`);
            list = [];
        }
    }

    function getSum(arg) {
        return summons.find((e) => e.name.toLowerCase().includes(arg));
    }	

	script.hook('S_LOAD_TOPO', 3, packet => {

		if (packet.zone == hw_zone) {
			zoned = true;
		}
		else {
			zoned = false;
		}
	});
	script.hook('S_SPAWN_NPC', 11, (packet) => {	
		if (zoned == true) {
			switch (packet.templateId) {
			case merchant_template:
				merchant_id = packet.gameId;
				config.merchant_id = Number(merchant_id);
				summons[1].npcId = merchant_id
				settingUpdate();				
				console.log("NPC =Торговец=  идентифицирован, конфигурация обновлена: ", merchant_id);
				break;
			case vg_template:
				vg_id = packet.gameId;
				config.vg_id = Number(vg_id);
				summons[2].npcId = vg_id
				settingUpdate();				
				console.log("NPC =Торговец=  идентифицирован, конфигурация обновлена: ", merchant_id);				
				console.log("NPC =Магазин Редкостей= идентифицирован: ", vg_id);
				break;	
			case sp_template:
				sp_id = packet.gameId;
				config.sp_id = Number(sp_id);
				summons[3].npcId = sp_id
				settingUpdate();				
				console.log("NPC =Магазин Редкостей=  идентифицирован, конфигурация обновлена: ", sp_id);
				break;
			case fishmonger_template:
				fishmonger_id = packet.gameId;
				config.fishmonger_id = Number(fishmonger_id);
				summons[4].npcId = fishmonger_id
				settingUpdate();				
				console.log("NPC =Торговец Рыбой= идентифицирован, конфигурация обновлена: ", fishmonger_id);
				break;
			case fishcratevendor_template:
				fishcratevendor_id = packet.gameId;
				config.fishcratevendor_id = Number(fishcratevendor_id);
				summons[5].npcId = fishcratevendor_id
				settingUpdate();				
				console.log("NPC =Торговец ящиками с рыбой= идентифицирован, конфигурация обновлена: ", fishcratevendor_id);
				break;
			case fishmerch_template:
				fishmerch_id = packet.gameId;
				config.fishmerch_id = Number(fishmerch_id);
				summons[6].npcId = fishmerch_id
				settingUpdate();				
				console.log("NPC =Торговец Товарами Для Рыбалки= идентифицирован, конфигурация обновлена: ", fishmerch_id);
				break;			
			default:
				break;
			}
		}
	});			
	
}
