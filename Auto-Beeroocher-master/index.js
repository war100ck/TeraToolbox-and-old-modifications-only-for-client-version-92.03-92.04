/**
 * Version: Apex 2
 * Configured by Ilya
 * Configured by Blasting Penis In The Sky
 * Configured by Brawndria
 * Configured by Kygas
 */


const LEIN_ID = 80081;
const fs = require('fs');
const path = require('path');
module.exports = function AutoBroocher(dispatch) {
const skills = require('./skills');
let cdwn = getCDWs();

var LEIN_DELAY = cdwn.list[0].cdw,                           // How much time in miliseconds should wait after buff (seconds * 1000)
	BROOCH_DELAY = cdwn.list[1].cdw;
	
    const command = dispatch.command;
    dispatch.game.initialize('inventory'); // call for Tera-Game-State Inventory Submodule
	
    let enabled = cdwn.enabled,
        oCid = null,
        oJob = null,
        oX = null,
        oY = null,
        oZ = null,
        oW = null,
		eqBrooch = null, // Equipped Brooch ID
        isCDBrooch = false, // if Brooch is on CD
		isCdDrink = false,
        getInfoCommand = false;
		
    command.add('beer', () => {
        enabled = !enabled;
        let txt = (enabled) ? 'ENABLED' : 'DISABLED';
        message('Auto Broocher ' + txt, true);
    });
	
    command.add('getskillinfo', () => {
        getInfoCommand = true;
        message('Use the desired skill and check proxy console.');
    });
	
	command.add('lein', {
		$default() { 
			message(`Beer delay= ${LEIN_DELAY}`,true);
    	},
    	delay(value) {
    		value = parseInt(value);
    		if (!isNaN(value)) {
    			LEIN_DELAY = value;
    			message(`Beer delay set to ${LEIN_DELAY}.`,true);
    		}
    	}
	});
	
	command.add('brooch', {
		$default() { 
			message(`Brooch delay= ${BROOCH_DELAY}.`,true);
    	},
    	delay(value) {
    		value = parseInt(value);
    		if (!isNaN(value)) {
    			BROOCH_DELAY = value;
    			message(`Brooch delay set to ${BROOCH_DELAY}.`,true);
    		}
    	}
	});
	
    dispatch.hook('S_LOGIN', 'raw', { order : Infinity }, (event) => {
        oCid = dispatch.game.me.gameId;
        oJob = (dispatch.game.me.templateId - 10101) % 100;
    });
	
    dispatch.hook('C_PLAYER_LOCATION', 5, { order: -10 }, (event) => {
        oX = (event.loc.x + event.dest.x) / 2;
        oY = (event.loc.y + event.dest.y) / 2;
        oZ = (event.loc.z + event.dest.z) / 2;
        oW = event.w;
    });
	
	dispatch.hook('S_START_COOLTIME_ITEM', 1, event => {
        if ( event.item == LEIN_ID && isCdDrink == false ) {
            isCdDrink = true;
            setTimeout(function () { isCdDrink = false; }, event.cooldown * 1000);
        }
		
        if ( event.item == (dispatch.game.inventory.equipment.slots[20]).id && isCDBrooch == false ) {
            isCDBrooch = true;
            setTimeout(function () { isCDBrooch = false; }, event.cooldown * 1000);
        }
    });
	
    dispatch.hook('C_START_SKILL', 7, { order: -10 }, (event) => {
        if (!enabled) return;
        let sInfo = getSkillInfo(event.skill.id); // returns struct with skill info 
        if (getInfoCommand) {
            message('Skill info: (group: ' + sInfo.group + ' / job: ' + oJob + ')');
            getInfoCommand = false;
        }
		const brooch = dispatch.game.inventory.equipment.slots[20];
		if(brooch) {
			for (let s = 0; s < skills.length; s++) {
            if (skills[s].group == sInfo.group && skills[s].job == oJob) { // compares skills file with sInfo struct
					beer();
					Brooch(brooch);
					break;
            }
          }
		}
		else command.message("Equip Brooch MOFO");
    });
	
    function Brooch(bID) { // Brooch Item Data
   	 if(!isCDBrooch)
		 {
			setTimeout(function () {
					dispatch.toServer('C_USE_ITEM', 3, {
						gameId: oCid,
						id: bID.id,
						dbid: bID.dbid,
						target: 0,
						amount: 1,
						dest: {x: 0, y: 0, z: 0},
						loc: {x: oX, y: oY, z: oZ},
						w: oW,
						unk1: 0,
						unk2: 0,
						unk3: 0,
						unk4: 1
					});
					isCDBrooch = true;
					setTimeout(function () { isCDBrooch = false; }, 180000);
			}, BROOCH_DELAY);
		 }
	}
	
	function beer() {
		if (dispatch.game.inventory.getTotalAmountInBag(LEIN_ID) > 0 && !isCdDrink ){
			var pivo = dispatch.game.inventory.findInBag(LEIN_ID); // get Item Beer
			setTimeout(function () {
				dispatch.toServer('C_USE_ITEM', 3, {
					gameId: oCid,
					id: pivo.id,
					dbid: pivo.dbid,
					target: 0,
					amount: 1,
					dest: {x: 0, y: 0, z: 0},
					loc: {x: oX, y: oY, z: oZ},
					w: oW,
					unk1: 0,
					unk2: 0,
					unk3: 0,
					unk4: 1
				});
				isCdDrink = true;
				setTimeout(function () { isCdDrink = false; }, 60000);
			}, LEIN_DELAY);
		}
	}
	
    function getSkillInfo(id) {
		let nid = id;
        return {
            id: nid,
            group: Math.floor(nid / 10000),
            level: Math.floor(nid / 100) % 100,
            sub: nid % 100
        };
    }
	
    function message(msg, chat = false) {
        if (chat == true) {
            command.message('(Auto Broocher) ' + msg);
        } else {
            console.log('(Auto Broocher) ' + msg);
        }
    }

function jsonRequire(p) {//path|name
		delete require.cache[require.resolve(p)];
		return require(p);
	}

function getCDWs() {
		let cdws = {};
		try {
			cdws = jsonRequire('./config.json');
		} catch (e) {
			cdws = {
				enabled: true,
				list: {
					0: {
						cdw: 3000 //lein delay
					},
					1: {
						cdw: 500 //brooch delay
						
					}
				}
			}
			jsonSave('config.json', cdws);
		}
		return cdws;
	}
	
	function jsonSave(name, data) {fs.writeFile(path.join(__dirname, name), JSON.stringify(data, null, 4), err => {});}
}
