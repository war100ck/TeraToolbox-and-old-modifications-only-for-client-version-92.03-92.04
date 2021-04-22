module.exports = function MonitorControl(mod) {
	
	let {
		abnormality,
		crystal
	} = require('./config.json')
	
	mod.hook('S_ABNORMALITY_BEGIN', 3, (event) => {
		if (abnormality.includes(event.id))
			return false
	})
	
	mod.hook('S_ABNORMALITY_REFRESH', 1, (event) => {
		if (crystal.includes(event.id))
			return false
	})
	
	mod.hook('S_START_ACTION_SCRIPT', 3, (event) => {
		return false
	})
	
}
