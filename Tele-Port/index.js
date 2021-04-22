module.exports = function TelePort(mod) {
	const fs = require("fs")
	const path = require("path")
	const Vec3 = require('tera-vec3')
	
	let myLoc = null,
		myW = null,
		aBook = {}
	
	try {
		aBook = require('./book.json')
	} catch (e) { 
		aBook = {}
	}
	
	mod.command.add(["传送", "tp"], (arg1, arg2) => {
		switch (arg1) {
			case "s":
			case "保存":
				if (arg2) {
					aBook[arg2] = {
						zone: mod.game.me.zone,
						x: myLoc.x,
						y: myLoc.y,
						z: myLoc.z,
						w: myW
					}
					saveBook()
					
					sendMessage("保存坐标 " + arg2)
				}
				break
			case "l":
			case "读取":
				if (arg2) {
					if (!aBook[arg2]) {
						sendMessage("未找到坐标 " + arg2)
					} else if (aBook[arg2].zone != mod.game.me.zone) {
						sendMessage("未存在坐标 " + aBook[arg2].zone + " 区域内")
					} else {
						sendMessage("读取坐标 " + arg2)
						Move(aBook[arg2].x, aBook[arg2].y, aBook[arg2].z, aBook[arg2].w)
					}
				}
				break
			case "d":
			case "删除":
				if (arg2) {
					if (!aBook[arg2]) {
						sendMessage("未找到坐标 " + arg2 + " 进行删除")
					} else {
						delete aBook[arg2]
						saveBook()
						sendMessage("删除坐标 " + arg2)
					}
				}
				break
			
			default:
				sendMessage(
					"当前坐标信息: "
					+ "\n\t - [地区] "  + mod.game.me.zone
					+ "\n\t - [loc.x] " + Math.round(myLoc.x)
					+ "\n\t - [loc.y] " + Math.round(myLoc.y)
					+ "\n\t - [loc.z] " + Math.round(myLoc.z)
					+ "\n\t - [w] "     + Math.round(myW)
				)
				break
		}
	})
	
	mod.hook('C_PLAYER_LOCATION', 5, (event) => {
		myLoc = event.loc
		myW = event.w
		
		if (event.type == 2 || event.type == 10) {
			return false
		}
	})
	
	function Move(x, y, z, w) {
		mod.send('S_INSTANT_MOVE', 3, {
			gameId: mod.game.me.gameId,
			loc: new Vec3(x, y, z),
			w: w
		})
	}
	
	function saveBook() {
		fs.writeFileSync(path.join(__dirname, "book.json"), JSON.stringify(aBook, null, '    '))
	}
	
	function sendMessage(msg) { mod.command.message(msg) }
}
