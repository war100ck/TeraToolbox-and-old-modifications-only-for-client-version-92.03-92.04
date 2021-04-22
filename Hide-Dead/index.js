module.exports = function HideDead(mod) {
	mod.hook('S_DESPAWN_NPC', 3, (event) => {
		if (event.type == 5) {
			event.type = 1
			return true
		}
	})
}
