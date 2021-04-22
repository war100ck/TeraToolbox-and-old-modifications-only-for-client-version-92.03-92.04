String.prototype.clr = function (hexColor) { return `<font color='#${hexColor}'>${this}</font>` }

const fs = require('fs')
const path = require('path')
const https = require('https')
const TeraDataUrl = 'https://raw.githubusercontent.com/neowutran/TeraDpsMeterData/master/'

let monsterFileName, monsterFileURL, skillsFileName, skillsFileURL

function Update(r) {
	this.region = r
	
	monsterFileName = 'monsters-' + this.region + '.xml'
	skillsFileName  = 'skills-'   + this.region + '.tsv'
	monsterFileURL  = path.join(TeraDataUrl, 'monsters', monsterFileName)
	skillsFileURL   = path.join(TeraDataUrl, 'skills',   skillsFileName)
	
	download(monsterFileURL, monsterFileName)
	download(skillsFileURL,  skillsFileName)
	
	if (!fs.existsSync(path.join(__dirname, '..', 'history'))) {
		fs.mkdirSync(path.join(__dirname, '..', 'history'))
	}
}

async function download(url, dest, cb) {
	return new Promise(resolve  => {
		var file = fs.createWriteStream(path.join(__dirname, dest))
		var request = https.get(url, function (response) {
			response.pipe(file)
		}).on('error', function (err) { // Handle errors
			console.log(err)
			fs.unlinkSync(path.join(__dirname, dest)) // Delete the file async. (But we don't check the result)
			reject(err)
		})
		file.on('finish', function () {
			file.close(cb)
			console.log('[TDM] Обновлено...' + path.join(__dirname, '..', dest))
			resolve('success')
			
			try {
				fs.renameSync(path.join(__dirname, dest), path.join(__dirname, '..', dest))
			} catch(_) {
				
			}
		})
		file.on('error', function (err) {
			fs.unlinkSync(path.join(__dirname, dest))
			console.log(err)
			reject(err)
		})
		// console.log('[TDM] 更新中...' + url)
	})
}

module.exports = Update
