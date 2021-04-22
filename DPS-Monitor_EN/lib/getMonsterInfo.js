const path = require('path')
const fs = require('fs')
const xmldom = require('xmldom')

const errorHandler = {
	warning(msg) {
		console.log('xml parser warning' + msg)
	},
	
	error(msg) {
		console.log('xml parser error' + msg)
	},
	
	fatalError(msg) {
		console.log('xml parser fatal error' + msg)
	},
}

let monsterfile,
	doc = null

function MonsterInfo(r) {
	this.region = r
	monsterfile = path.join(__dirname, '../monsters-' + this.region + '.xml')
	
	if (fs.existsSync(monsterfile)) {
		const parser = new xmldom.DOMParser({ errorHandler })
		doc = parser.parseFromString(fs.readFileSync(monsterfile, "utf-8"), 'text/xml')
		if (!doc) {
			console.log('ERROR xml doc :' + monsterfile)
			return
		}
	}
	
	this.getNPCInfoFromXml = function(npc) {
		var zone, mon
		if (!doc) return false
		try {
			var zone = doc.getElementsByTagName("Zone")
			for (var i in zone) {
				if (zone[i].getAttribute("id") == Number(npc.huntingZoneId)) {
					npc.zoneName = zone[i].getAttribute("name")
					break
				}
			}
			var mon = zone[i].getElementsByTagName("Monster")
			for (var j in mon) {
				if (mon[j].getAttribute("id") == Number(npc.templateId)) {
					npc.npcName = mon[j].getAttribute("name")
					break
				}
			}
		} catch (err) {
			return false
		}
		return true
	}
}

module.exports = MonsterInfo
