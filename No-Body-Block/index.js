module.exports = function NoBodyBlock(mod) {
	const partyMembers = new Set()
	const cache = Object.create(null)
	const partyObj = Object.create(null)
	
	const removeBodyBlock = () => {
		for (let i = partyMembers.values(), step; !(step = i.next()).done;) {
			partyObj.leader = step.value
			partyObj.unk1   = cache.unk1
			partyObj.unk2   = cache.unk2
			partyObj.unk3   = cache.unk3
			mod.send('S_PARTY_INFO', 1, partyObj)
		}
	}
	
	partyObj.unk4 = 1
	
	let interval = null
	
	mod.game.on('enter_game', () => {
		interval = setInterval(removeBodyBlock, 3000)
	})
	
	mod.hook('S_PARTY_INFO', 1, (event) => {
		Object.assign(cache, event)
	})
	
	mod.hook('S_PARTY_MEMBER_LIST', 7, (event) => {
		partyMembers.clear()
		for (let i = 0, arr = event.members, len = arr.length; i < len; ++i) {
			const member = arr[i]
			if (!member.online) continue
			partyMembers.add(member.gameId)
		}
	})
}
