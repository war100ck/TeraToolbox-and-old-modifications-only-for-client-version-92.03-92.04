module.exports = function Gathering(mod) {
	const Message = require('../tera-message')
	const MSG = new Message(mod)
	
	if (mod.proxyAuthor !== 'caali') {
		const options = require('./module').options
		if (options) {
			const settingsVersion = options.settingsVersion
			if (settingsVersion) {
				mod.settings = require('./' + (options.settingsMigrator || 'settings_migrator.js'))(mod.settings._version, settingsVersion, mod.settings)
				mod.settings._version = settingsVersion
			}
		}
	}
	
	let plantsMarkers = false,
		miningMarkers = false,
		energyMarkers = false
	
	let mobid = [],
		gatherMarker = []
	
	function СборStatus() {
		sendStatus(
			"Сбор: " + (mod.settings.enabled ? MSG.BLU("Включен") : MSG.YEL("Выключен")),
			"Предупреждающее сообщение: " + (mod.settings.sendToAlert  ? MSG.BLU("Включен") : MSG.YEL("Выключен")),
			"Уведомление: " + (mod.settings.sendToNotice ? MSG.BLU("Включен") : MSG.YEL("Выключен")),
			
			"Подсказки по растениям: " + (plantsMarkers ? MSG.BLU("Включен") : MSG.YEL("Выключен")),
			"Подсказки по руде: " + (miningMarkers ? MSG.BLU("Включен") : MSG.YEL("Выключен")),
			"Подсказки по эссенции: " + (energyMarkers ? MSG.BLU("Включен") : MSG.YEL("Выключен"))
		)
	}
	
	function sendStatus(msg) {
		MSG.chat([...arguments].join('\n\t - '))
	}
	
	mod.command.add("сбор", (arg) => {
		if (!arg) {
			mod.settings.enabled = !mod.settings.enabled;
			if (!mod.settings.enabled) {
				plantsMarkers = false
				miningMarkers = false
				energyMarkers = false
				for (let itemId of mobid) {
					despawnItem(itemId)
				}
			}
			MSG.chat("Сбор " + (mod.settings.enabled ? MSG.BLU("Включен") : MSG.YEL("Выключен")))
		} else {
			switch (arg) {
				case "warn":
					mod.settings.sendToAlert = !mod.settings.sendToAlert
					MSG.chat("Предупреждающее сообщение " + (mod.settings.sendToAlert ? MSG.BLU("Включен") : MSG.YEL("Выключен")))
					break
				case "not":
					mod.settings.sendToNotice = !mod.settings.sendToNotice
					MSG.chat("Уведомление " + (mod.settings.sendToNotice ? MSG.BLU("Включен") : MSG.YEL("Выключен")))
					break
					
				case "status":
					СборStatus()
					break
				
				case "растения":
					plantsMarkers = !plantsMarkers
					MSG.chat("Подсказки по растениям -  " + (plantsMarkers ? MSG.BLU("Показаны") : MSG.YEL("Скрыты")))
					break
				case "руда":
					miningMarkers = !miningMarkers
					MSG.chat("Подсказки по руде -  " + (miningMarkers ? MSG.BLU("Показаны") : MSG.YEL("Скрыты")))
					break
				case "эссенция":
					energyMarkers = !energyMarkers
					MSG.chat("Подсказки по эссенции - " + (energyMarkers ? MSG.BLU("Показаны") : MSG.YEL("Скрыты")))
					break
				
				default :
					MSG.chat("Сбор " + MSG.RED("Неверный параметр!"))
					break
			}
		}
	})
	
	mod.game.me.on('change_zone', (zone, quick) => {
		mobid = []
	})
	
	mod.hook('S_SPAWN_COLLECTION', 4, (event) => {
		if (mod.settings.enabled) {
			if (plantsMarkers && (gatherMarker = mod.settings.plants.find(obj => obj.id === event.id))) {
				MSG.alert(("Обнаружено [" + gatherMarker.name + "] " + gatherMarker.msg), 44)
				MSG.raids( "Обнаружено [" + gatherMarker.name + "] " + gatherMarker.msg)
			} else if (miningMarkers && (gatherMarker = mod.settings.mining.find(obj => obj.id === event.id))) {
				MSG.alert(("Обнаружено [" + gatherMarker.name + "] " + gatherMarker.msg), 44)
				MSG.raids( "Обнаружено [" + gatherMarker.name + "] " + gatherMarker.msg)
			} else if (energyMarkers && (gatherMarker = mod.settings.energy.find(obj => obj.id === event.id))) {
				MSG.alert(("Обнаружено [" + gatherMarker.name + "] " + gatherMarker.msg), 44)
				MSG.raids( "Обнаружено [" + gatherMarker.name + "] " + gatherMarker.msg)
			} else {
				return true
			}
			
			spawnItem(event.gameId, event.loc)
			mobid.push(event.gameId)
		}
	})
	
	mod.hook('S_DESPAWN_COLLECTION', 2, (event) => {
		if (mobid.includes(event.gameId)) {
			gatherMarker = []
			despawnItem(event.gameId)
			mobid.splice(mobid.indexOf(event.gameId), 1)
		}
	})
	
	function spawnItem(gameId, loc) {
		loc.z = loc.z - 100
		mod.send('S_SPAWN_DROPITEM', 8, {
			gameId: gameId*100n,
			loc: loc,
			item: mod.settings.markerId,
			amount: 1,
			expiry: 999999,
			owners: [
				{playerId: mod.game.me.playerId}
			]
		})
	}
	
	function despawnItem(gameId) {
		mod.send('S_DESPAWN_DROPITEM', 4, {
			gameId: gameId*100n
		})
	}
	
}
