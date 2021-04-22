module.exports = function DeathMarkers(mod) {
	let partyMembers = []
	let markers = []
	
	mod.command.add("尸体", (arg) => {
		if (!arg) {
			mod.settings.enabled = !mod.settings.enabled
			if (!mod.settings.enabled) removeAllMarkers()
			sendMessage("Death-Markers: " + (mod.settings.enabled ? "On" : "Off"))
		} else if (arg === "模式") {
			mod.settings.UseJobSpecificMarkers = !mod.settings.UseJobSpecificMarkers
			sendMessage("标记物设置 " + (mod.settings.UseJobSpecificMarkers ? "职业分类" : "统一样式"))
		} else {
			sendMessage("无效的参数!")
		}
	})
	
	mod.game.on('enter_game', () => {
		removeAllMarkers()
		partyMembers = []
	})
	
	mod.hook('S_PARTY_MEMBER_LIST', 7, (event) => {
		partyMembers = event.members
	})
	
	mod.hook('S_DEAD_LOCATION', 2, (event) => {
		spawnMarker(partyMembers.find(obj => obj.gameId == event.gameId), event.loc)
	})
	
	mod.hook('S_SPAWN_USER', 15, (event) => {
		if (event.alive) return
		spawnMarker(partyMembers.find(obj => obj.gameId == event.gameId), event.loc)
	})
	
	mod.hook('S_DESPAWN_USER', 3, (event) => {
		if (event.type == 1) return
		removeMarker(partyMembers.find(obj => obj.gameId == event.gameId))
	})
	
	mod.hook('S_PARTY_MEMBER_STAT_UPDATE', 3, (event) => {
		if ((event.playerId == mod.game.me.playerId) || markers.length <= 0 || !event.alive || event.curHp <= 0) return
		removeMarker(partyMembers.find(obj => obj.playerId == event.playerId))
	})
	
	mod.hook('S_LEAVE_PARTY_MEMBER', 2, (event) => {
		removeMarker(partyMembers.find(obj => obj.playerId == event.playerId))
		partyMembers = partyMembers.filter(obj => obj.playerId != event.playerId)
	})
	
	mod.hook('S_LEAVE_PARTY', 1, (event) => {
		removeAllMarkers()
		partyMembers = []
	})
	
	function spawnMarker(member, loc) {
		if (!mod.settings.enabled || !member || mod.game.me.is(member.gameId)) return
		
		markers.push(member.playerId)
		mod.send('S_SPAWN_DROPITEM', 8, {
			gameId: member.playerId,
			loc: loc,
			item: getSpawnItem(member.class),
			amount: 1
		})
	}
	
	function getSpawnItem(classid) {
		if (!mod.settings.UseJobSpecificMarkers) return mod.settings.DefaultItemSpawn
		switch (classid) {
			case 1:
			case 10:
				return mod.settings.TankItemSpawn
			case 6:
			case 7:
				return mod.settings.HealerItemSpawn
			default:
				return mod.settings.DefaultItemSpawn
		}
	}
	
	function removeMarker(member) {
		if (!member) return
		
		if (markers.includes(member.playerId)) {
			mod.send('S_DESPAWN_DROPITEM', 4, {
				gameId: member.playerId
			})
			markers = markers.filter(obj => obj.playerId != member.playerId)
		}
	}
	
	function removeAllMarkers() {
		for (let i = 0; i < markers.length; i++) { 
			removeMarker(markers[i])
		}
		partyMembers.forEach(obj => removeMarker(obj))
		markers = []
	}
	
	function sendMessage(msg) { mod.command.message(msg) }
}
