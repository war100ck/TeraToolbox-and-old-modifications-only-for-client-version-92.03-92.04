module.exports = function CmdSlash(mod) {
	mod.command.add('r', () => {
		mod.send('C_RESET_ALL_DUNGEON', 1, {})
	})
	
	mod.command.add('d', () => {
		mod.send('C_LEAVE_PARTY', 1, {})
	})
	
	mod.command.add('t', () => {
		mod.send('C_DISMISS_PARTY', 1, {})
	})
	
	mod.command.add('q', () => {
		mod.send('C_RETURN_TO_LOBBY', 1, {})
	})
	
	mod.command.add('b', () => {
		mod.send('S_NPC_MENU_SELECT', 1, {type: 28})
	})
	
	let currentChannel = 0
	
	mod.command.add('c', (arg) => {
		if (isNaN(arg)) {
			changeChannel(currentChannel + 1)
		} else {
			changeChannel(arg)
		}
	})
	
	mod.hook('S_CURRENT_CHANNEL', 2, (event) => {
		currentChannel = event.channel
	})
	
	function changeChannel(newChannel) {
		if (newChannel == currentChannel) return
		--newChannel
		mod.send('C_SELECT_CHANNEL', 1, {
			unk: 1,
			zone: mod.game.me.zone,
			channel: newChannel
		})
	}
}
