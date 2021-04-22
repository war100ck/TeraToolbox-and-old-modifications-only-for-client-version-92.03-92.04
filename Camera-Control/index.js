module.exports = function CameraControl(mod) {
	mod.command.add(["cam", "视距"], (arg) => {
		if (!arg) {
			mod.settings.enabled = !mod.settings.enabled
			sendMessage("Camera-Control: " + (mod.settings.enabled ? "On" : "Off"))
			if (!mod.settings.enabled) {
				setCamera(500)
			}
		} else if (!isNaN(arg) && parseInt(arg) > 0) {
			mod.settings.setDistance = arg
			setCamera(mod.settings.setDistance)
			sendMessage("调整视距为 " + mod.settings.setDistance)
		} else {
			sendMessage("无效的参数!")
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
