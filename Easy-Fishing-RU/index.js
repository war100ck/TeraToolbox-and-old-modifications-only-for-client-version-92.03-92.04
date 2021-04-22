const SettingsUI = require('tera-mod-ui').Settings;

module.exports = function EasyFishing(mod) {
	const Message = require('../tera-message');
	const MSG = new Message(mod);
	
	let CRAFTABLE_BAITS  = null,               // наживка рыбы/Червяк - Buff - Информация о Рецепте
		currentBait      = null,               // Активация наживки / дождевого червя
		lastUsedBait     = null,               // Замороженная наживка / Дождевой Червь
		playerLocation   = {x: 0, y: 0, z: 0}, // Координаты персонажа
		playerAngle      = 0,                  // Угол персонажа
		fishingRod       = 0,                  // Уровень удочки
		
		crafting         = false, // Изготовление наживки
		recipeId         = 204103,// Рецепт наживки 204103->204102->204101->204100
		successCount     = 0,     // Колличество успеха 
		
		waitingInventory = false, // 筛选背包道具
		itemsToProcess   = [],    // 筛选出的道具
		
		spawning         = false, // 召唤跟班
		getting          = false, // 提取鱼饵
		selling          = false, // 出售鱼类
		dismantling      = false, // 分解鱼类
		cannotDismantle  = false, // 鱼肉饱和
		discarding       = false, // 丢弃鱼肉
		useSalad         = false, // 使用沙拉
		
		lastContact      = {},    // 上一次NPC连接
		lastDialog       = {},    // 上一次NPC对话
		
		baitAmount       = 0,     // 鱼饵数量
		
		myServant        = null,  // 跟班信息
		wareExtend       = null,  // 仓库信息
		
		nowDate          = 0,
		beginTime        = 0,
		waitTime         = 0,
		startTime        = 0,
		endTime          = 0,
		
		debugTime        = 120000,
		
		counter          = 0,
		
		log = false;
	
	mod.game.initialize('inventory');
	
	function sendStatus(msg) {
		MSG.chat([...arguments].join('\n\t - '));
	}
	
	function fishStatus() {
		sendStatus(" --- Состояние функции модуля быстрой рыбалки ---",
			"Состояние модуля: " + (mod.settings.enabled         ? MSG.TIP("Включено") : MSG.RED("Отключено")),
			"Наживка из банка: " + (mod.settings.autoGetting     ? MSG.BLU("Включено") : MSG.YEL("Отключено")),
			"Изготовление наживки: " + (mod.settings.autoCrafting    ? MSG.BLU("Включено") : MSG.YEL("Отключено")) + " Рецепт " + MSG.TIP(recipeId),
			"Разбор Золотой рыбы: " + (mod.settings.filterGolden    ? MSG.BLU("Включено") : MSG.YEL("Отключено")),
			"Авто Продажа: " + (mod.settings.autoSelling     ? MSG.BLU("Включено") : MSG.YEL("Отключено")),
			"Авто Разбор: " + (mod.settings.autoDismantling ? MSG.BLU("Включено") : MSG.YEL("Отключено")),
			"Выкинуть рыбное филе: " + (mod.settings.discardFilets   ? MSG.BLU("Включено") : MSG.YEL("Отключено")) + " Колличество выброшенных " + MSG.TIP(mod.settings.discardCount),
			"Авто использывание Салата: " + (mod.settings.reUseFishSalad  ? MSG.BLU("Включено") : MSG.YEL("Отключено")),
			"Кормление питомца: " + (mod.settings.autoUse         ? MSG.BLU("Включено") : MSG.YEL("Отключено")) + " Триггер энергии " + MSG.TIP(mod.settings.autoUseAt + "%"),
			"Случайная задержка: " + (mod.settings.useRandomDelay  ? MSG.BLU("Включено") : MSG.YEL("Отключено")),
			"Дистанция заброса: " + MSG.TIP((mod.settings.castDistance))
		);
	}
	
	function restStatus() {
		mod.clearAllTimeouts();
		
		currentBait    = null,
		lastUsedBait   = null,
		fishingRod     = null,
		
		crafting       = false,
		recipeId       = 204103,
		successCount   = 0,
		
		waitingInventory = false,
		itemsToProcess   = [],
		
		spawning         = false,
		getting          = false,
		selling          = false,
		dismantling      = false,
		cannotDismantle  = false,
		discarding       = false,
		useSalad         = false,
		
		baitAmount       = 0;
	}
	// Settings UI
	let ui = null;
	if (global.TeraProxy.GUIMode) {
		ui = new SettingsUI(mod, require('./settings_structure'), mod.settings, { height: 500 });
		ui.on('update', settings => mod.settings = settings);
		this.destructor = () => {
			if (ui) {
				ui.close();
				ui = null;
			}
		};
	}
	
	mod.command.add("f", (arg, value) => {
		if (!arg) {
			mod.settings.enabled = !mod.settings.enabled;
			MSG.chat("Easy-Fishing: " + (mod.settings.enabled ? MSG.BLU("Модуль Включен") : MSG.YEL("Модуль Отключен")));
			if (mod.settings.enabled) {
				fishStatus();
			} else {
				restStatus();
			}
		} else {
			switch (arg) {
				case "set":
					if (ui) ui.show();
					break;
				case "склад":
					mod.settings.autoGetting = !mod.settings.autoGetting;
					MSG.chat("Авто [получение] рыболовных наживок с хранилища питомца " + (mod.settings.autoGetting ? MSG.BLU("Включено") : MSG.YEL("Отключено")));
					break;
				case "крафт":
					mod.settings.autoCrafting = !mod.settings.autoCrafting;
					MSG.chat("Авто [Изготовление] наживки " + (mod.settings.autoCrafting ? MSG.BLU("Включено") : MSG.YEL("Отключено")));
					break;
				case "голд":
					mod.settings.filterGolden = !mod.settings.filterGolden;
					MSG.chat("Хранение-золотай рыбы " + (mod.settings.filterGolden ? MSG.BLU("Включено") : MSG.YEL("Отключено")));
					break;
				case "продажа":
					mod.settings.autoSelling = !mod.settings.autoSelling;
					MSG.chat("Авто [продажа] рыбы " + (mod.settings.autoSelling ? MSG.BLU("Включена") : MSG.YEL("Отключена")));
					break;
				case "Sellnow":
					startSelling();
					break;
				case "разбор":
					mod.settings.autoDismantling = !mod.settings.autoDismantling;
					MSG.chat("Авто [разобор] рыбы" + (mod.settings.autoDismantling ? MSG.BLU("Включен") : MSG.YEL("Отключен")));
					break;
				case "продать сейчас":
					startDismantling();
					break;
				case "удалить":
					value = parseInt(value);
					if (!isNaN(value)) {
						mod.settings.discardCount = value;
						MSG.chat("Выбрасывать[кол-во] " + MSG.TIP(mod.settings.discardCount));
					} else {
						mod.settings.discardFilets = !mod.settings.discardFilets;
						MSG.chat("Авто [выбросить] филе " + (mod.settings.discardFilets ? MSG.BLU("Включен") : MSG.YEL("Отключен")));
					}
					break;
				case "удалить сейчас":
					startDiscarding();
					break;
				case "салат":
					mod.settings.reUseFishSalad = !mod.settings.reUseFishSalad;
					MSG.chat("Автоматическое использование [Салата] " + (mod.settings.reUseFishSalad ? MSG.BLU("Включен") : MSG.YEL("Отключен")));
					break;
				case "пет":
					value = parseInt(value);
					if (!isNaN(value)) {
						mod.settings.autoUseAt = value;
						MSG.chat("Настройка питания [энергия]% " + MSG.TIP(mod.settings.autoUseAt));
					} else {
						mod.settings.autoUse = !mod.settings.autoUse;
						MSG.chat("Автоматическое [кормление] питомца " + (mod.settings.autoUse ? MSG.BLU("Включен") : MSG.YEL("Отключен")));
					}
					break;
				case "задержка":
					mod.settings.useRandomDelay = !mod.settings.useRandomDelay;
					MSG.chat("Случайное [задержка] вытягивание крючка " + (mod.settings.useRandomDelay ? MSG.BLU("Включен") : MSG.YEL("Отключен")));
					break;
				case "заброс":
					value = parseInt(value);
					if (!isNaN(value)) {
						mod.settings.castDistance = validate(value, 0, 18, 3);
						MSG.chat("Установлен заброс удочки на [расстояние] " + MSG.TIP(mod.settings.castDistance));
					} else {
						MSG.chat("Установка требований к параметру [Расстояние] " + MSG.RED("цифра") + " Тип");
					}
					break;
				case "статус":
					fishStatus();
					break;
				case "log":
					log = !log;
					MSG.chat("log " + (log ? "Включен" : "Отключен"));
					break;
				default :
					MSG.chat("Easy-Fishing: " + MSG.RED("Недопустимый параметр!"));
					break;
			}
		}
	});
	
	mod.game.me.on('change_zone', (zone, quick) => {
		lastContact = {};
		lastDialog = {};
		
		if (zone == 2000) {
			CRAFTABLE_BAITS = mod.settings.craftableBaits.filter(obj => obj.itemId == 206053);
		} else {
			CRAFTABLE_BAITS = mod.settings.craftableBaits.filter(obj => obj.itemId != 206053);
		}
	});
	
	mod.hook('C_NPC_CONTACT', 2, event => {
		Object.assign(lastContact, event);
	});
	
	mod.hook('C_DIALOG', 1, event => {
		Object.assign(lastDialog, event);
	});
	
	mod.hook('C_PLAYER_LOCATION', 5, event => {
		if ([0, 1, 5, 6].includes(event.type)) {
			Object.assign(playerLocation, event.loc);
			playerAngle = event.w;
		}
	});
	
	mod.hook('S_ABNORMALITY_BEGIN', 4, event => {
		if (!mod.game.me.is(event.target)) return;
		
		currentBait = CRAFTABLE_BAITS.find(obj => obj.abnormalityId == event.id) || currentBait;
		lastUsedBait = currentBait || lastUsedBait;
		
		if (currentBait) baitAmount = mod.game.inventory.getTotalAmount(lastUsedBait.itemId);
	});
	
	mod.hook('S_ABNORMALITY_END', 1, event => {
		if (!mod.game.me.is(event.target)) return;
		
		if (currentBait && (event.id == currentBait.abnormalityId)) {
			currentBait = null;
			baitAmount = mod.game.inventory.getTotalAmount(lastUsedBait.itemId);
		}
		
		if (mod.settings.enabled && mod.settings.reUseFishSalad && event.id == 70261) useSalad = true;
	});
	
	mod.hook('S_SYSTEM_MESSAGE', 1, event => {
		var msg = mod.parseSystemMessage(event.message);
		// if (log) mod.log(msg)
		
		switch (msg.id) {
			case 'SMT_ITEM_USED_ACTIVE':
				if (currentBait && !fishingRod) {
					MSG.chat(MSG.TIP("Активирована наживкаа: ") + mod.game.inventory.find(currentBait.itemId).data.name + MSG.BLU(" Можно забрасывать удочку"));
					mod.settings.enabled = true;
				}
				break;
			case 'SMT_ITEM_USED_DEACTIVE':
				if (lastUsedBait) {
					MSG.chat(MSG.RED("Не активно ") + mod.game.inventory.find(lastUsedBait.itemId).data.name + MSG.YEL(" Выключен модуль"));
					mod.settings.enabled = false;
					restStatus();
				}
				break;
			/* 
			'SMT_FISHING_RESULT_SUCCESS' 釣魚成功。
			'SMT_FISHING_RESULT_FAIL' 釣魚失敗。
			'SMT_FISHING_RESULT_CANCLE' 釣魚已取消。
			'SMT_CANNOT_FISHING_NON_BAIT' 要先使用誘餌。
			'SMT_CANNOT_FISHING_NON_AREA' 已離開釣魚區域。
			SMT_FISHING_BITE_WAIT 釣魚中。到有反應為止，請等待。
			SMT_FISHING_BITE_STATE 好像釣到什麼了。請按下 {ActionKey}鍵，將東西釣上來吧。	{autoWaitingTime}秒後，會自動把魚釣起。
			 */
			case 'SMT_CANNOT_FISHING_FULL_INVEN': // 背包空間不足，無法使用。
				if (mod.settings.enabled && !selling && !dismantling) {
					if (mod.settings.autoSelling) {
						if (mod.game.inventory.getTotalAmount(204052) < 30) {
							MSG.chat(MSG.YEL("Рюкзак полон [рыбой]...Пропустить продажу"));
						} else {
							MSG.chat(MSG.TIP("Не достаточно места в [рюкзаке]...Попробуем что то продать"));
							MSG.alert(("Не достаточно места в [рюкзаке]...Попробуем что то продать"), 44);
							startSelling();
							break;
						}
					}
					
					if (mod.settings.autoDismantling) {
						MSG.chat(MSG.YEL("Не достаточно места в [рюкзаке]...Попробуем разобрать"));
						MSG.alert(("Не достаточно места в [рюкзаке]...Попробуем разобрать"), 44);
						startDismantling();
						break;
					}
					
					if (mod.settings.discardCount) {
						MSG.chat(MSG.RED("Рюкзак полон [рыбой]...Попробуем выбросить"));
						MSG.alert(("Рюкзак полон [рыбой]...Попробуем выбросить"), 44);
						startDiscarding();
						break;
					}
				}
				break;
			case 'SMT_ITEM_CANT_POSSESS_MORE': // 背包已滿，無法獲取{ItemName}。
				if (msg.tokens && msg.tokens['ItemName'] === `@item:${lastUsedBait.itemId}`) {
					MSG.chat(MSG.RED("Рюкзак полон [наживкой]...Остановливаем крафт!"));
					crafting = false;
				}
				
				if (msg.tokens && msg.tokens['ItemName'] === '@item:204052') {
					MSG.chat(MSG.RED("Рюкзак полон[рыбным феле]...Остановливаем разбор!"));
					cannotDismantle = true;
				}
				break;
			/* 
			case 'SMT_GENERAL_CANT_REG_ITEM_LIMIT': // 無法再登錄道具。
				MSG.chat(`无法再登录更多道具项目!! - [分解栏]`);
				break;
			 */
		}
	});
	
	function validate(value, lowerBound, upperBound, defaultValue) {
		value = parseInt(value);
		if (isNaN(value)) return defaultValue;
		if (value < lowerBound) return lowerBound;
		if (value > upperBound) return upperBound;
		
		return value;
	}
	
	mod.hook('C_CAST_FISHING_ROD', 2, event => {
		if (!mod.settings.enabled) return;
		
		event.castDistance = validate(mod.settings.castDistance, 0, 18, 3);
		return true;
	});
	
	mod.hook('S_CAST_FISHING_ROD', 1, event => {
		if (!mod.settings.enabled || !mod.game.me.is(event.gameId)) return;
		
		fishingRod = event.fishingRod;
		
		nowDate = new Date();
		beginTime = nowDate.getTime();
		
		if (baitAmount == 0 && currentBait == null && lastUsedBait) {
			MSG.chat(MSG.YEL("~Рыбалка остановлена~ ") + "Текущая [наживка] закончилась..." + MSG.YEL("Попробуем выбрать другую наживку"));
			mod.setTimeout(activeBait, 5000);
		}
		
		if (baitAmount != 0 && !selling && !dismantling && !discarding) {
			if (log) MSG.chat(
				MSG.BLU("~ Рыбалка началась ~ ") + mod.game.inventory.find(currentBait.itemId).data.name +
				MSG.TIP(" x" + baitAmount) + " - " + mod.game.inventory.find(event.fishingRod).data.name
			);
		}
	});
	
	function rand([min, max], lowerBound) {
		lowerBound = isNaN(lowerBound) ? Number.NEGATIVE_INFINITY : lowerBound;
		min = parseInt(min);
		max = parseInt(max);
		
		if (isNaN(min) || isNaN(max)) return lowerBound;
		
		const result = Math.floor(Math.random() * (max - min + 1)) + min;
		
		return result >= lowerBound ? result : lowerBound;
	}
	
	mod.hook('S_FISHING_BITE', 1, event => {
		if (!mod.settings.enabled || !mod.game.me.is(event.gameId)) return;
		
		nowDate = new Date();
		waitTime = (nowDate.getTime() - beginTime);
		if (log) MSG.chat("~Ожидание поклевки~ " + MSG.YEL(waitTime/1000 + " s "));
		
		startTime = rand(mod.settings.startDelay, 1000);
		mod.setTimeout(() => {
			mod.send('C_START_FISHING_MINIGAME', 2, {
				counter: ++counter
			});
			if (log) MSG.chat("~Удочка была заброшена~ " + counter + " Раз " + MSG.YEL(startTime + " ms "));
		}, mod.settings.useRandomDelay ? startTime : 1000);
	});
	
	mod.hook('S_START_FISHING_MINIGAME', 1, event => {
		if (!mod.settings.enabled || !mod.game.me.is(event.gameId)) return;
		
		endTime = rand(mod.settings.catchDelay, 2000);
		mod.setTimeout(() => {
			mod.clearAllTimeouts();
			mod.send('C_END_FISHING_MINIGAME', 2, {
				counter: counter,
				success: true
			});
			
			nowDate = new Date();
			if (log) MSG.chat(
				"~Рыба выловлена~ " + counter + " Раз " + MSG.YEL(endTime + " ms ") + 
				MSG.RED("Lv" + event.level) + " " + MSG.TIP((nowDate.getTime() - beginTime)/1000 + " s ")
			);
		}, mod.settings.useRandomDelay ? endTime : 2000);
		return false;
	});
	
	mod.hook('S_REQUEST_SPAWN_SERVANT', 4, event => {
		if (!mod.game.me.is(event.ownerId) || event.spawnType != 0) return;
		
		spawning = false;
		myServant = event;
		// if (event.energy / (event.type ? 3 : 1) < mod.settings.autoUseAt) {
		if (100 * event.energy / event.energyMax < mod.settings.autoUseAt) {
			var useItemType = (event.type ? mod.settings.autoGifts : mod.settings.autoFoods);
			
			var useItem;
			if (useItem = mod.game.inventory.find(useItemType)) {
				startUseItem(useItem);
				MSG.chat("~Использовать еду~ " + useItem.data.name);
			} else {
				MSG.chat(MSG.RED("Не найдена еда для кормления/дарения"));
			}
		}
	});
	
	mod.hook('S_REQUEST_DESPAWN_SERVANT', 1, event => {
		if (!myServant || myServant.gameId != event.gameId || event.despawnType != 0) return;
		
		myServant = null;
	});
	
	mod.hook('S_UPDATE_SERVANT_INFO', 2, event => {
		if (!myServant || myServant.dbid != event.dbid || myServant.id != event.id) return;
		
		// if (event.energy / (event.type ? 3 : 1) < mod.settings.autoUseAt) {
		if (100 * event.energy / event.energyMax < mod.settings.autoUseAt) {
			var useItemType = (event.type ? mod.settings.autoGifts : mod.settings.autoFoods);
			
			var useItem;
			if (useItem = mod.game.inventory.find(useItemType)) {
				startUseItem(useItem);
				MSG.chat("~Использовать еду~ " + useItem.data.name);
			} else {
				MSG.chat(MSG.RED("Не найдена еда для кормления/дарения"));
			}
		}
	});
	
	mod.hook('S_REQUEST_SERVANT_INFO_LIST', 3, event => {
		if (!mod.settings.enabled || !spawning) return;
		
		var SERVANTS = event.servants;
		if (SERVANTS.length > 0) {
			for (let servant of SERVANTS) {
				if (servant.abilities.find(obj => obj.id == 22)) {
					mod.setTimeout(() => {
						if (log) MSG.chat(MSG.YEL("~Попытка Призыва~ ") + "Домашнее животное / питомец");
						mod.send('C_REQUEST_SPAWN_SERVANT', 1, {
							id: servant.id,
							dbid: servant.dbid
						});
						
						mod.setTimeout(startGettingBait, 5000);
					}, 2000);
					return;
				}
			}
			MSG.party("Не найдено домашних животных / питомцев с [навыками личного склада], функция [Автоматическое извлечение] отключена !!!");
			spawning = false;
			mod.settings.autoGetting = false;
			
			mod.setTimeout(activeBait, 5000);
		} else {
			MSG.party("Домашний питомец не найден, функция автоматического извлечения отключена!!!");
			spawning = false;
			mod.settings.autoGetting = false;
			
			mod.setTimeout(activeBait, 5000);
		}
	});
	
	mod.hook('S_VIEW_WARE_EX', 1, event => {
		if (!mod.settings.enabled || !mod.game.me.is(event.gameId)) return;
		
		wareExtend = event;
	});
	
	function startGettingBait() {
		if (!myServant) {
			mod.setTimeout(startSpawning, 5000);
		} else {
			mod.setTimeout(startGetWare, 5000);
		}
	}
	
	function startSpawning() {
		if (log) MSG.chat(MSG.RED("------Включение системы автоматического призыва питомца------"));
		spawning = true;
		mod.send('C_REQUEST_SERVANT_INFO_LIST', 1, {
			gameId: mod.game.me.gameId
		});
	}
	
	function startGetWare() {
		if (log) MSG.chat(MSG.RED("------Открыть [личный склад] и найти ------ [рыбную наживку]"));
		mod.send('C_SERVANT_ABILITY', 1, {
			gameId: myServant.gameId,
			skill: 22
		});
		
		mod.setTimeout(startGetWareItem, 5000);
	}
	
	function startGetWareItem() {
		var baitIDs = [];
		for (let item of CRAFTABLE_BAITS) {
			baitIDs.push(item.itemId);
		}
		
		var scanningBait;
		
		for (let baitID of baitIDs) {
			if (scanningBait = wareExtend.items.find(item => item.id == baitID)) break;
		}
		
		if (scanningBait) {
			var maxGetBaitAmount = CRAFTABLE_BAITS.find(obj => obj.itemId == scanningBait.id).maxAmount;
			mod.send('C_GET_WARE_ITEM', 3, {
				gameId: mod.game.me.gameId,
				type: wareExtend.type,
				page: wareExtend.offset,
				gold: 0,
				bankSlot: scanningBait.amountTotal,
				dbid: scanningBait.dbid,
				id: scanningBait.id,
				amont: ((scanningBait.amount < maxGetBaitAmount) ? scanningBait.amount : maxGetBaitAmount),
				invenPocket: -1,
				invenSlot: -1
			});
			MSG.chat(MSG.YEL("~Извлечение рыбного филе~ ") + "успех");
			
			mod.setTimeout(() => {
				// MSG.chat(MSG.RED("------关闭[个人仓库]------"));
				// mod.send('S_VIEW_WARE_EX', 1, {
					// gameId: mod.game.me.gameId,
					// action: 1
				// });
				
				if (log) MSG.chat(MSG.YEL("~Отмена призыва~ ") + "Питомца");
				mod.send('C_REQUEST_DESPAWN_SERVANT', 1, {});
				
				mod.setTimeout(activeBait, 5000);
			}, 2000);
			return;
		} else if ((wareExtend.offset+72) < wareExtend.slots) {
			if (log) MSG.chat(MSG.YEL("~Переключение слотов~ ") + MSG.YEL("...Повторный поиск"));
			mod.send('C_VIEW_WARE', 2, {
				gameId: mod.game.me.gameId,
				type: 9,
				offset: (wareExtend.offset+72)
			});
			
			mod.setTimeout(startGetWareItem, 2000);
		} else {
			MSG.party("[Рыбная наживка] не найдена, автоматическая функция [извлечения] отключена !!!");
			if (log) MSG.chat(MSG.YEL("~Отмена призыва~ ") + "Питомеца");
			mod.send('C_REQUEST_DESPAWN_SERVANT', 1, {});
			mod.settings.autoGetting = false;
			
			mod.setTimeout(activeBait, 5000);
		}
	}
	
	function activeBait() {
		var baitIDs = [];
		for (let item of CRAFTABLE_BAITS) {
			baitIDs.push(item.itemId);
		}
		
		var scanningBait;
		if (scanningBait = mod.game.inventory.find(baitIDs)) {
			startUseItem(scanningBait);
			MSG.chat(MSG.TIP("~Активация наживки~ ") + scanningBait.data.name + MSG.BLU(" Возобновление рыбалки!"));
			mod.setTimeout(startFishing, 5000);
		} else if (mod.settings.autoGetting) {
			MSG.chat(MSG.YEL("~Рыбалка приостановлена~  ") + " Текущая [наживка] закончилась..." + MSG.YEL(" Попробем извлечь"));
			mod.setTimeout(startGettingBait, 5000);
		} else if (mod.settings.autoCrafting && mod.game.me.zone != 2000) {
			MSG.chat(MSG.YEL("~Рыбалка приостановлена~  ") + " В рюкзаке закончилась [наживка]..." + MSG.YEL(" Попробуем скрафтить"));
			mod.setTimeout(startCraftingBait, 5000);
		} else {
			MSG.chat(MSG.RED("~Рыбалка остановлена~ ") + "В рюкзаке закончилась [наживка]");
			mod.clearAllTimeouts();
		}
	}
	
	function startFishing() {
		startUseItem(mod.game.inventory.find(fishingRod));
		
		mod.clearAllTimeouts();
		mod.setTimeout(() => {
			// if (!spawning && !getting && !selling && !dismantling && !discarding && !crafting && !useSalad) {
				if (currentBait == null && lastUsedBait) {
					MSG.chat("Время ожидания рыбалки истекло ..." + MSG.BLU("Повторная активация [наживки]"));
					mod.log("Время автоматической рыбалки истекло ... активировать [наживку]");
					mod.setTimeout(activeBait, 5000);
				} else {
					MSG.chat("Время ожидания рыбалки истекло ..." + MSG.BLU("Перезапуск рыбалки, заброс [удочки]"));
					mod.log("Время ожидания рыбалки истекло ...Перезапуск рыбалки, заброс [удочки]");
					mod.setTimeout(startFishing, 5000);
				}
			// }
		}, debugTime);
	}
	
	function startUseItem(item) {
		if (!item) return;
		
		mod.send('C_USE_ITEM', 3, {
			gameId: mod.game.me.gameId,
			id: item.id,
			dbid: item.dbid,
			target: 0n,
			amount: 1,
			dest: {x: 0, y: 0, z: 0},
			loc: playerLocation,
			w: playerAngle,
			unk1: 0,
			unk2: 0,
			unk3: 0,
			unk4: true
		});
	}
	
	mod.hook('C_USE_ITEM', 3, event => {
		if (mod.settings.enabled && mod.settings.rods.includes(event.id)) {
			if (mod.settings.autoSelling && (!lastContact.gameId || !lastDialog.id)) {
				MSG.party("Не доступен NPC [Торговец] или он слишком далеко, автоматическая функция [Продажа] отключена !!!")
				mod.settings.autoSelling = false;
			}
			
			if (useSalad) {
				var useItem;
				if (useItem = mod.game.inventory.find(mod.settings.autoFishSalad)) {
					startUseItem(useItem);
					MSG.chat("~Использывание рыбного салата~ " + useItem.data.name + MSG.BLU(" Возобновление рыбалки!"));
					useSalad = false;
					mod.setTimeout(startFishing, 5000);
					return false;
				}
			}
		}
	});
	
	function startCraftingBait() {
		if (log) MSG.chat(MSG.RED("------Включение системы [Изготовление наживки]------"));
		MSG.alert(("------Включение системы [Изготовление наживки]------"), 44);
		if (!crafting) successCount = 0;
		crafting = true;
		
		mod.send('C_START_PRODUCE', 1, {
			recipe: recipeId,
			unk: 0
		});
	}
	
	mod.hook('S_END_PRODUCE', 1, event => {
		if (!mod.settings.enabled && !crafting) return;
		
		if (event.success) {
			successCount++;
			if (log) MSG.chat(MSG.YEL("~[Изготовление] наживки~ ") + "Задача выполнена успешно" + MSG.BLU(" x " + successCount));
			mod.setTimeout(startCraftingBait, 2000);
		} else if (successCount == 0 && mod.game.inventory.getTotalAmount(204052) < 30 && mod.settings.autoDismantling) {
			crafting = false;
			MSG.chat(MSG.YEL("~[Изготовление] наживки~ ") + "Миссия не удалась..." + MSG.RED("Попробуем разобрать рыбу"));
			mod.setTimeout(startDismantling, 2000);
		} else if (successCount == 0 && recipeId > 204099) {
			recipeId--;
			MSG.chat(MSG.YEL("~[Изготовление] наживки~ ") + "Миссия не удалась..." + "Замена рецепта " + MSG.TIP(recipeId));
			mod.setTimeout(startCraftingBait, 2000);
		} else {
			crafting = false;
			MSG.chat(MSG.YEL("~[Изготовление] наживки~ ") + "Задача полностью завершена" + MSG.BLU(" Возобновление рыбалки!"));
			mod.setTimeout(activeBait, 5000);
			if (recipeId < 204100) {
				MSG.party("Не изучен рецепт [наживкии], отключена функция [автоматического изготовления]!!!");
				mod.settings.autoCrafting = false;
			}
		}
	});
	
	function startSelling() {
		if (log) MSG.chat(MSG.RED("------Включение системы [Авто Продажа]------"));
		MSG.alert(("------Включение системы [Авто Продажа]------"), 44);
		waitingInventory = true;
		itemsToProcess = [];
		selling = true;
		processItems();
	}
	
	function startDismantling() {
		if (log) MSG.chat(MSG.RED("------Включение системы [Авто Разбор]------"));
		MSG.alert(("------Включение системы [Авто Разбор]------"), 44);
		waitingInventory = true;
		itemsToProcess = [];
		dismantling = true;
		processItems();
	}
	
	function startDiscarding() {
		if (log) MSG.chat(MSG.RED("------Включение системы [Авто Удаления]------"));
		MSG.alert(("------Включение системы [Авто Удаления]------"), 44);
		discarding = true;
		processItems();
	}
	
	function processItems() {
		if (waitingInventory && (selling || dismantling)) {
			mod.game.inventory.findAll(mod.settings[selling ? "autoSellFishes" : "autoDismantleFishes"]).forEach(item => {
				itemsToProcess.push({
					id: item.id,
					dbid: item.dbid,
					slot: item.slot,
					amount: item.amount,
					pocket: item.pocket,
					name: item.data.name
				});
			})
			
			if (mod.settings.filterGolden) {
				itemsToProcess = itemsToProcess.filter(obj => obj.id < 206500);
			}
			
			waitingInventory = false;
			
			if (selling) {
				processItemsToSell();
			} else if (dismantling) {
				processItemsToDismantle();
			}
		}
		
		if (discarding) {
			var delItem;
			if (mod.game.me.zone != 2000) {
				delItem = mod.game.inventory.find(204052); // 魚肉
			} else {
				delItem = mod.game.inventory.find(206215); // 磯鱲魚魚片
			}
			
			if (delItem) {
				mod.send('C_DEL_ITEM', 3, {
					gameId: mod.game.me.gameId,
					pocket: delItem.pocket,
					slot: delItem.slot,
					amount: Math.min(delItem.amount, mod.settings.discardCount)
				});
				discarding = false;
				
				MSG.chat(MSG.RED("~Рыбное филе [Выброшено]~ ") + "Задача выполнена" + MSG.BLU(" Возобновление рыбалки!"));
				mod.setTimeout(startFishing, 5000);
			}
		}
	}
	
	function processItemsToSell() {
		if (itemsToProcess.length > 0) {
			if (log) MSG.chat(MSG.TIP("~Добавление товара на [Продажу]~"));
			mod.send('C_NPC_CONTACT', 2, lastContact);
			
			let dialogHook;
			const timeout = mod.setTimeout(() => {
				if (dialogHook) {
					mod.unhook(dialogHook);
					selling = false;
					
					if (mod.settings.autoDismantling) {
						MSG.chat("Тайм-аут сеанса диалого с NPC..." + MSG.RED("Попробуем разобрать"));
						startDismantling();
					}
				}
			}, 5000);
			
			dialogHook = mod.hookOnce('S_DIALOG', 2, event => {
				mod.clearTimeout(timeout);
				mod.send('C_DIALOG', 1, Object.assign(lastDialog, {id: event.id}));
			});
		}
	}
	
	function processItemsToDismantle() {
		if (itemsToProcess.length > 0) {
			if (log) MSG.chat(MSG.PIK("~Добавление [разобраного] предмета~"));
			mod.send('C_REQUEST_CONTRACT', 1, {
				type: 90,
				unk2: 0,
				unk3: 0,
				unk4: 0,
				name: "",
				data: Buffer.alloc(0)
			});
		}
	}
	
	mod.hook('S_REQUEST_CONTRACT', 1, event => {
		if (!mod.settings.enabled || (!dismantling && !selling)) return;
		
		var delay = mod.settings.useRandomDelay ? rand(mod.settings.moveItemDelay, 200) : 200;
		
		switch (event.type) {
			case 9:
				if (itemsToProcess.length > 0) {
					for (let item of itemsToProcess.slice(0, 18)) {
						mod.setTimeout(() => { AddOneItemToSellBasket(event, item) }, delay);
						delay += mod.settings.useRandomDelay ? rand(mod.settings.moveItemDelay, 200) : 200;
					}
					
					itemsToProcess = itemsToProcess.slice(18);
					mod.setTimeout(() => { StarSellBasket(event) }, delay+5000);
				} else {
					selling = false;
					CancelContract(event);
					
					MSG.chat(MSG.TIP("~Рыба [продана]~ ") + " Задача Выполнена " + MSG.BLU(" Возобновление рыбалки!"));
					mod.setTimeout(startFishing, 5000);
				}
			break;
			
			case 90:
				const handleContract = () => {
					for (let item of itemsToProcess.slice(0, 20)) {
						mod.setTimeout(() => {
							if (cannotDismantle) return;
							AddOneItemToDecomposition(event, item)
						}, delay);
						delay += mod.settings.useRandomDelay ? rand(mod.settings.moveItemDelay, 200) : 200;
					}
					
					itemsToProcess = itemsToProcess.slice(20);
					mod.setTimeout(() => {
						StartDecomposition(event);
						
						mod.setTimeout(() => {
							if (cannotDismantle) {
								itemsToProcess = [];
								cannotDismantle = false;
								dismantling = false;
								CancelContract(event);
								
								if (mod.settings.discardFilets && mod.settings.discardCount > 0) {
									MSG.chat("Невозможно [разобрать] больше рыбы..." + MSG.RED("Попробуем отменить"));
									mod.setTimeout(startDiscarding, 5000);
								}
								return;
							}
							
							if (itemsToProcess.length > 0) {
								handleContract();
							} else {
								dismantling = false;
								CancelContract(event);
								
								MSG.chat(MSG.PIK("~[Разобор] рыбы ~ ") + "Задача Выполнена" + MSG.BLU(" Возобновление рыбалки!"));
								if (!currentBait && lastUsedBait) {
									mod.setTimeout(activeBait, 5000);
								} else {
									mod.setTimeout(startFishing, 5000);
								}
							}
						}, 5000);
					}, delay+5000);
				};
				handleContract();
			break;
		}
	});
	
	function AddOneItemToSellBasket(event, item) {
		if (log) MSG.chat("Товар добавлен на продажу: " + MSG.TIP(item.id) + " - " + item.name);
		mod.send('C_STORE_SELL_ADD_BASKET', 2, {
			gameId: mod.game.me.gameId,
			contract: event.id,
			item: item.id,
			amount: item.amount,
			pocket: item.pocket,
			slot: item.slot
		});
	}
	
	function StarSellBasket(event) {
		if (log) MSG.chat(MSG.TIP("------Продажа товара завершена-----") + "Успешно");
		mod.send('C_STORE_COMMIT', 1, {
			gameId: mod.game.me.gameId,
			contract: event.id
		});
	}
	
	function CancelContract(event) {
		mod.send('C_CANCEL_CONTRACT', 1, {
			type: event.type,
			id: event.id
		});
	}
	
	function AddOneItemToDecomposition(event, item) {
		if (log) MSG.chat("Добавить предмет чтобы [разобрать]: " + MSG.PIK(item.id) + " - " + item.name);
		mod.send('C_RQ_ADD_ITEM_TO_DECOMPOSITION_CONTRACT', 1, {
			contract: event.id,
			dbid: item.dbid,
			id: item.id,
			count: 1
		});
	}
	
	function StartDecomposition(event) {
		if (log) MSG.chat(MSG.PIK("------Вся добавленная рыба была [разобрана]------") + "Задача [Авто разбор] была выполнена.");
		mod.send('C_RQ_START_SOCIAL_ON_PROGRESS_DECOMPOSITION', 1, {
			contract: event.id
		});
	}
}
