module.exports = function AFKer(mod) {
	let lastTimeMoved = Date.now()
	
	mod.hook('C_PLAYER_LOCATION', 5, (event) => {
		if ([0, 1, 5, 6].indexOf(event.type) > -1) {
			lastTimeMoved = Date.now()
		}
	})
	
	mod.hook('C_RETURN_TO_LOBBY', 1, (event) => {
		if ((Date.now() - lastTimeMoved) >= 60*60*1000) {
			return false
		}
	})
}