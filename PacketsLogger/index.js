const hexy = require('hexy')
const fs = require('fs');
const util = require('util');
module.exports = function PacketsLogger(mod) {
	const command = mod.command;
	const startTime = Date.now();
	let logFile = null;
	let logC = true;
	let logS = true;
	let logRaw = true;
	let logRawUnkOnly = false;
	let logJson = true;
	let logUnk = true;
	let logUnkOnly = false;
	let logPaste = false;
	let hook = null;
	let hookEnabled = false;
	let searchExpr = null;

	let blacklist = [
		//'S_F2P_PremiumUser_Permission',
		'S_NPC_LOCATION',
		'S_SOCIAL',
		'S_PLAYER_CHANGE_MP',
		'S_SOCIAL',
		'S_PLAYER_STAT_UPDATE',
		'S_PLAYER_CHANGE_ALL_PROF',
		'S_SYSTEM_MESSAGE',
		'S_PLAYER_STAT_UPDATE',
		'S_CREATURE_CHANGE_HP',
		'S_NPC_TARGET_USER',
		'S_CHAT',
		'S_PARTY_MATCH_LINK',
		'S_CREATURE_ROTATE',
		'S_NPC_STATUS',
		'S_DESPAWN_NPC',
		'S_CURRENT_CHANNEL',
		'S_SPAWN_NPC',
		'C_PLAYER_LOCATION',
		'S_PRIVATE_CHAT',
		'C_CHAT',
		'S_SPAWN_COLLECTION',
		'S_DIALOG_EVENT',
		'S_ABNORMALITY_END',
		'S_ABNORMALITY_BEGIN',
		'S_LOAD_CLIENT_USER_SETTING',
		'S_DESPAWN_COLLECTION',
		'S_USER_LOCATION',
		'S_DESPAWN_USER',
		'S_REQUEST_DESPAWN_SERVANT',
		'S_ITEMLIST',
		'S_USER_FLYING_LOCATION',
		'S_NPC_AI_EVENT',
		'C_SIMPLE_TIP_REPEAT_CHECK',
		'C_SAVE_CLIENT_ACCOUNT_SETTING',
		'S_INVEN',
 ];

	command.add('logC', () => {
		logC = !logC;
		command.message(`Client packet logging is now ${logC ? 'enabled' : 'disabled'}.`)
		if (!logC && !logS && hookEnabled) disableHook();
		if ((logC || logS) && !hookEnabled) enableHook();

	});

	command.add('logS', () => {
		logS = !logS;
		command.message(`Server packet logging is now ${logS ? 'enabled' : 'disabled'}.`);
		if (!logC && !logS && hookEnabled) disableHook();
		if ((logC || logS) && !hookEnabled) enableHook();
	});

	command.add('logRaw', (arg) => {
		arg = '' + arg
		arg = arg.toLowerCase()

		if (['true', 'yes', 'y', '1'].includes(arg)) {
			logRaw = true
			logRawUnkOnly = false
		} else if (['false', 'no', 'n', '0'].includes(arg)) {
			logRaw = false
			logRawUnkOnly = false
		} else if (['unk', 'u', '2'].includes(arg)) {
			logRaw = true
			logRawUnkOnly = true
		} else {
			logRaw = !logRaw
			logRawUnkOnly = false
		}

		command.message(`Raw packet logging is now ${logRaw ? 'enabled' : 'disabled'}${logRawUnkOnly ? ' (only unknown packets)' : ''}.`)
	});

	command.add('logJson', () => {
		logJson = !logJson
		command.message(`Json packet logging is now ${logJson ? 'enabled' : 'disabled'}.`)
	});

	command.add('logPaste', () => {
		logPaste = !logPaste
		command.message(`Raw packet pasting format is now ${logPaste ? 'enabled' : 'disabled'}.`)
	});

	command.add('logUnk', (arg) => {
		arg = '' + arg
		arg = arg.toLowerCase()

		if (['true', 'yes', 'y', '1'].includes(arg)) {
			logUnk = true
			logUnkOnly = false
		} else if (['false', 'no', 'n', '0'].includes(arg)) {
			logUnk = false
			logUnkOnly = false
		} else if (['only', 'o', '2'].includes(arg)) {
			logUnk = true
			logUnkOnly = true
		} else {
			logUnk = !logUnk
			logUnkOnly = false
		}

		command.message(`Unknown packet logging is now ${logUnk ? 'enabled' : 'disabled'}${logUnkOnly ? ' (only)' : ''}.`)
	});
	command.add('recreate', () => {
		logFile = fs.createWriteStream('tera-log.log', {
			flags: 'a'
		});
	});
	command.add('logSearch', (s) => {
		if (s === '' || s === undefined) s = null
		searchExpr = s;

		if (searchExpr !== null) {
			searchExpr = '' + searchExpr
			command.message(`Logger search expression set to: ${searchExpr}`);
		} else {
			command.message(`Logger search disabled.`);
		}
	});

	command.add('logBlack', (name) => {
		if (name === null || name === undefined) {
			command.message('Invalid');
			return
		}
		var index = blacklist.indexOf(name);
		if (index > -1) {
			blacklist.splice(index, 1);
			command.message('Now showing ' + name + '.');
		} else {
			blacklist.push('' + name);
			command.message('Now hiding ' + name + '.');
		}
	});

	command.add('logBlackShow', (name) => {
		for (let item of blacklist) {
			command.message(item)
		}
	});

	command.add('logBlackClear', (name) => {
		blacklist = []
		command.message(`Logger blacklist cleared.`)
	})

	function pad(n, l, c = '0') {
		return String(c).repeat(l).concat(n).slice(-l);
	}

	function hexDump(data) {
		if (logPaste) {
			return data.toString('hex')
		} else {
			return hexy.hexy(data, {format: "eights", offset: 4, caps: "upper", width: 32})
		}
	}

	function timestamp() {
		let today = new Date();
		return "[" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds() + "]";
	}

	function packetArrow(incoming) {
		return incoming ? '<-' : '->'
	}
	
	function internalType(data) {
		return (data.$fake ? '[CRAFTED]	' : '') + (data.$silenced ? '[BLOCKED]	' : '') + (data.$modified ? '[EDITED]	' : '') + ( (!data.$fake && !data.$silenced && !data.$modified) ? '         	' : '')
	}

	function printUnknown(code, data, incoming, name) {
		logFile.write(`${timestamp()} ${packetArrow(incoming)} ${internalType(data)}    (id ${code}) ${name}\n`);
		if (logRaw) {
			logFile.write(hexDump(data) + '\n');
			logFile.write(data.toString('hex') + '\n');
		}
	}

	function loopBigIntToString(obj) {
		Object.keys(obj).forEach(key => {
			if (obj[key] && typeof obj[key] === 'object') loopBigIntToString(obj[key]);
			else if (typeof obj[key] === "bigint") obj[key] = obj[key].toString();
		});
	}

	function printKnown(name, packet, incoming, code, data, defPerhapsWrong) {
		loopBigIntToString(packet);
		let json = JSON.stringify(packet, null, 4);
		logFile.write(`${timestamp()} ${packetArrow(incoming)} ${internalType(data)} ${name}    (id ${code}${defPerhapsWrong ? ', DEF WRONG!!!)' : ')'}\n`)
		if (logJson) logFile.write(json + '\n')
		if (logRaw && (defPerhapsWrong || !logRawUnkOnly)) {
			logFile.write(hexDump(data) + '\n');
			logFile.write(data.toString('hex') + '\n');
		}
	}

	function isDefPerhapsWrong(name, packet, incoming, data) {
		if (incoming && name.slice(0, 2) === 'C_') {
			return true
		}
		if (!incoming && name.slice(0, 2) === 'S_') {
			return true
		}

		//let protocolVersion = mod.protocolVersion
		//let data2 = mod.dispatch.protocol.write(protocolVersion, name, '*', packet)
		let data2 = mod.dispatch.toRaw(name, '*', packet)
		if ((data.length != data2.length)) {
			return true
		} else {
			return false
		}
	}

	function shouldPrintKnownPacket(name, code, incoming) {
		if (logUnk && logUnkOnly) return false

		if (incoming) {
			if (!logS) return false
		} else {
			if (!logC) return false
		}

		for (let item of blacklist) {
			if (item === name) {
				return false
			}

			if (item === ('' + code)) {
				return false
			}
		}
		if (searchExpr !== null && !packetMatchesSearch(name, code)) {
			return false
		}

		return true
	}

	function shouldPrintUnknownPacket(name, code, incoming) {
		if (!logUnk) return false

		if (incoming) {
			if (!logS) return false
		} else {
			if (!logC) return false
		}

		for (let item of blacklist) {
			if (item === name) {
				return false
			}

			if (item === ('' + code)) {
				return false
			}
		}

		if (searchExpr !== null && !packetMatchesSearch('', code)) {
			return false
		}

		return true
	}

	function packetMatchesSearch(name, code) {
		if (searchExpr === ('' + code)) {
			return true
		} else {
			if (name !== '' && new RegExp(searchExpr).test(name)) {
				return true
			}
		}

		return false
	}

	function disableHook() {
		hookEnabled = false;
		mod.unhook(hook);
		logFile.end('<---- Hook DISABLED ---->\r\n');
	}

	function enableHook() {
		hookEnabled = true;
		logFile = fs.createWriteStream('tera-log.log', {
			flags: 'a'
		});
		logFile.write('<---- Hook ENABLED ---->\r\n');
		hook = mod.hook('*', 'raw', {
			order: 999999,
			filter: {
				fake: null,
				silenced: null,
				modified: null
			}
		}, (code, data, incoming, fake) => {
			if (!logC && !logS) return

			//let protocolVersion = mod.protocolVersion
			let name = null
			let packet = null

			name = mod.dispatch.protocolMap.code.get(code);
			if (name === undefined) name = null;

			if (name) {
				try {
					//packet = mod.dispatch.protocol.parse(protocolVersion, code, '*', data)
					packet = mod.dispatch.fromRaw(code, '*', data)
				} catch (e) {
					packet = null
				}

				if (packet) {
					let defPerhapsWrong = isDefPerhapsWrong(name, packet, incoming, data)
					if (shouldPrintKnownPacket(name, code, incoming)) {
						printKnown(name, packet, incoming, code, data, defPerhapsWrong)
					}
				}
			}

			if (!name || !packet) {
				if (shouldPrintUnknownPacket(name, code, incoming)) {
					printUnknown(code, data, incoming, name)
				}
			}
		});
	}
	if (logS || logC) enableHook();
	this.destructor = function () {
		if (logS || logC) {
			logFile.write('<---- TERA proxy UNLOADED ---->\r\n');
		}
	}
};
