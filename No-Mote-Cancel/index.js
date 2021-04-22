module.exports = function NoMoteCancel(mod) {
	let MOTES = [18, 22]
	
	mod.hook('C_CANCEL_SKILL', 3, (event) => {
		if (((mod.game.me.templateId -10101) %100) != 7) return
		
		if (MOTES.includes(Math.floor(event.skill.id / 10000))) {
			return false
		}
	})
}
