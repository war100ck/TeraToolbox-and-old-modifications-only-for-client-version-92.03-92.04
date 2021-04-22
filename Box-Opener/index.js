module.exports = function BoxOpener(mod) {
	let hooks = [],
		boxEvent = null,
		gacha_detected = false,
		isLooting = false,
		location = null,
		timer = null,
		statOpened = 0,
		statUsed = 0,
		statStarted = null,
		scanning = false,
		boxId = 166901 // MWA box as default.
	
	mod.game.initialize("inventory")
	
	mod.game.inventory.on('update', () => {
		if (!mod.settings.enabled) return
		
		isLooting = false // event comes only after all S_SYSTEM_MESSAGE_LOOT_ITEM (probably)
		
		if (mod.settings.trash) {
			mod.game.inventory.findAll(mod.settings.trashList).forEach(item => {
				delItem(item)
			})
		}
	})
	
	mod.command.add(["box", "ящик"], (arg, number) => {
		if (!arg) {
			if (!mod.settings.enabled && !scanning) {
				scanning = true
				load()
				sendMessage("Пожалуйста, откройте ящик (коробку), модуль атоматически откроет их все.")
			} else {
				stop()
			}
		} else {
			switch (arg) {
				case "delay":
				case "延迟":
					number = parseInt(number)
					if (isNaN(number) || number < 1) {
						mod.settings.useDelay = false
						sendMessage("Требуется параметр[number]больше 5, установлено значение по умолчанию 0,2 секунды")
					} else {
						mod.settings.useDelay = true
						mod.settings.delay = parseInt(number) * 1000
						sendMessage("Задержка открытия ящика установлена " + (mod.settings.delay / 1000) + " Сек/Время")
					}
					break
				case "trash":
				case "垃圾":
					mod.settings.trash = !mod.settings.trash
					sendMessage("Удаление мусора " + (mod.settings.trash ? "Включкна" : "Отключена"))
					break
				default:
					sendMessage("Неверный параметр!")
				break
			}
		}
	})
	
	mod.hook('C_PLAYER_LOCATION', 5, (event) => {
		location = event
	})
	
	function load() {
		hook('C_USE_ITEM', 3, (event) => {
			if (scanning) {
				scanning = false
				
				boxEvent = event
				boxId = event.id
				sendMessage(
					"\n\t - Выбранная цель: "  + boxId + " - " + mod.game.inventory.find(boxId).data.name +
					"\n\t - Интервал открытия коробки: " + (mod.settings.useDelay ? (mod.settings.delay / 1000) + " Сек/Время" : "Без задержки")
				)
				
				let d = new Date()
				statStarted = d.getTime()
				statOpened = 0
				statUsed = 0
				mod.settings.enabled = true
				timer = setTimeout(useItem, (mod.settings.useDelay ? mod.settings.delay : 200))
			}
		})
		
		hook('S_SYSTEM_MESSAGE_LOOT_ITEM', 1, (event) => {
			if (boxEvent && !isLooting && !gacha_detected) {
				isLooting = true
				statOpened++
				
				if (!mod.settings.useDelay) {
					clearTimeout(timer)
					useItem()
				}
			}
		})
		
		hook('S_GACHA_START', 1, (event) => {
			gacha_detected = true
			mod.send('C_GACHA_TRY', 1, {
				id: event.id
			})
		})
		
		hook('S_GACHA_END', 1, (event) => {
			if (boxEvent) {
				statOpened++
				if (!mod.settings.useDelay) {
					clearTimeout(timer)
					useItem()
				}
			}
		})
		
		hook('S_SYSTEM_MESSAGE', 1, (event) => {
			const msg = mod.parseSystemMessage(event.message)
			
			if (msg.id === 'SMT_CANT_USE_ITEM_COOLTIME') {
				statUsed--
			}
			
			if (msg.id === 'SMT_ITEM_MIX_NEED_METERIAL' || msg.id === 'SMT_CANT_CONVERT_NOW') {
				sendMessage("Ящики больше не открывается, модуль останавливается")
				stop()
			}
			return false
		})
	}
	
	function useItem() {
		if (mod.game.inventory.getTotalAmount(boxEvent.id) > 0) {
			boxEvent.loc = location.loc
			boxEvent.w = location.w
			mod.send('C_USE_ITEM', 3, boxEvent)
			statUsed++
			timer = setTimeout(useItem, (mod.settings.useDelay ? mod.settings.delay : 200))
		} else {
			stop()
		}
	}
	
	function delItem(item) {
		mod.send('C_DEL_ITEM', 3, {
			gameId: mod.game.me.gameId,
			pocket: item.pocket,
			slot: item.slot,
			amount: item.amount
		})
	}
	
	function stop() {
		unload()
		if (scanning) {
			scanning = false
			sendMessage("Модель автоотркрытия ящиков остановлен")
		} else {
			clearTimeout(timer)
			mod.settings.enabled = false
			gacha_detected = false
			boxEvent = null
			if (statOpened == 0) {
				statOpened = statUsed
			}
			let d = new Date()
			let t = d.getTime()
			let timeElapsedMSec = t-statStarted
			d = new Date(1970, 0, 1) // Epoch
			d.setMilliseconds(timeElapsedMSec)
			let h = addZero(d.getHours())
			let m = addZero(d.getMinutes())
			let s = addZero(d.getSeconds())
			sendMessage("Количество открытий: " + statOpened +
				"\n\t - Общее время: " + h + ":" + m + ":" + s +
				"\n\t - Среднее время открытия 1-го ящика: " + ((timeElapsedMSec / statOpened) / 1000).toPrecision(2) + " мл.сек/сек"
			)
			statOpened = 0
			statUsed = 0
		}
	}
	
	function addZero(i) {
		if (i < 10) {
			i = "0" + i
		}
		return i
	}
	
	function unload() {
		if (hooks.length) {
			for (let h of hooks) {
				mod.unhook(h)
			}
			hooks = []
		}
	}
	
	function hook() {
		hooks.push(mod.hook(...arguments))
	}
	
	function sendMessage(msg) { mod.command.message(msg) }
}
