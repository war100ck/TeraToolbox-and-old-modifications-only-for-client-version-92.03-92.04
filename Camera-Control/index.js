module.exports = function CameraControl(mod) {
	const Message = require('../tera-message');
	const MSG = new Message(mod);
	mod.command.add(["cam", "кам"], (arg) => {
		if (!arg) {
			mod.settings.enabled = !mod.settings.enabled
			//sendMessage("Camera-Control: " + (mod.settings.enabled ? "Включено" : "Отключено"))
			MSG.chat("Camera-Control: " + (mod.settings.enabled ? MSG.BLU("Модуль Включен") : MSG.RED("Модуль Отключен")));
			if (!mod.settings.enabled) {
				setCamera(500)
			}
		} else if (!isNaN(arg) && parseInt(arg) > 0) {
			mod.settings.setDistance = arg
			setCamera(mod.settings.setDistance)
			//sendMessage("FOV значение установленно на " + mod.settings.setDistance)
			MSG.chat(MSG.BLU("Дистанция камеры установлена на") + MSG.TIP(mod.settings.setDistance));
		} else {
			sendMessage("Неверный параметр!")
		}
	})
	
	mod.hook('S_SPAWN_ME', 3, (event) => {
		if (mod.settings.enabled) {
			setTimeout(() => {
				setCamera(mod.settings.setDistance)
			}, 3000)
		}
	})
	
	function setCamera(distance) {
		mod.send('S_DUNGEON_CAMERA_SET', 1, {
			enabled: true,
			default: distance,
			max: distance
		})
	}
	
	function sendMessage(msg) { mod.command.message(msg) }
}
