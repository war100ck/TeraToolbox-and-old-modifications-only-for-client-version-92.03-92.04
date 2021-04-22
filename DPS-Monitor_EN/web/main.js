String.prototype.color = function (hexColor) { return '<font color="#' + hexColor +'">' + this + '</font>' }
String.prototype.numberWithCommas = function () { return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
String.prototype.stripHTML = function () { return this.replace(/<[^>]+>/g, '') }

Number.prototype.nFormatter = function (digits) {
	var si = [
		{ value: 1,		symbol: "" },
		{ value: 1E3,	symbol: "K" },
		{ value: 1E6,	symbol: "M" },
		{ value: 1E9,	symbol: "G" },
		{ value: 1E12,	symbol: "T" },
		{ value: 1E15,	symbol: "P" },
		{ value: 1E18,	symbol: "E" }
	]
	var i
	for (i = si.length - 1; i > 0; i--) {
		if (this >= si[i].value) {
			break
		}
	}
	var rx = /\.0+$|(\.[0-9]*[1-9])0+$/
	var space = ''
	for (var j = 0; j < digits; j++) space += ''
	var ret = (this / si[i].value) + space
	return ret.slice(0, digits + 1).replace(rx, "$1") + si[i].symbol
}

var previousDps = ''
var agree = false
var waitForThis = false
var slog = []
var _skillInfo = []
var _name = ''
var	_classId = ''
var _record = {}
var _recordfilename = ''

var enable_color  = '56B4E9',
	disable_color = 'E69F00',
	green_color   = '00FF21',
	red_color     = 'FF3000',
	myName_color  = '00FFFF',
	
	redDPS = 8E6,
	yewDPS = 4E6,
	greDPS = 2E6

var TDMSettings = {
	"notice": true,
	"noticeDamage": 1,
	"bossOnly": true,
	"hideNames": false,
	"skillLog": true,
	"rankSystem": false,
	"allUsers": false,
	"debug": false,
	"partyLengh": 0,
	"NPCsLength": 0,
	"BossLength": 0,
	"myName": 'Anonymous'
}

var enragedSound = new Audio()
var clickSound   = new Audio()
var eventSound   = new Audio()

enragedSound.src = "audio/enraged.mp3"
clickSound.src   = "audio/click.mp3"
eventSound.src   = "audio/event.mp3"

window.onload = function() {
	if (typeof _tera_client_proxy_ === 'undefined') {
		//window.resizeTo(320, 240)
		//document.body.style.zoom="200%"
		ResizeDiv()
	} else {
		_tera_client_proxy_.resize_to(320, 240)
		_tera_client_proxy_.set_title('Tera(DPS) Damage statistics')
	}
	Settings()
	ReadConfig()
	RefreshDPS()
}

window.addEventListener('error', function (e) {
	if (typeof _tera_client_proxy_ !== 'undefined') {
		_tera_client_proxy_.alert(e.message)
	} else {
		alert(e.message)
	}
})

window.addEventListener('resize', function (event) {
	ResizeDiv()
})

function ReadConfig() {
	ajax("Z", setStyleCB)
}

function setStyleCB() {
	document.getElementById("debug").innerHTML = this.responseText
	
	var data = this.responseText.substring(1, this.responseText.length - 1)
	var size = data.split(',')
	
	if (typeof _tera_client_proxy_ !== 'undefined') {
		_tera_client_proxy_.resize_to(Number(size[0]), Number(size[1]))
	}
}

function ResizeDiv() {
	var width = window.innerWidth
	var height = window.innerHeight

	var divhight = 'height:' + (height - 55) + 'px'
	document.getElementById('content').setAttribute("style", divhight)

	var wrapperdivhight = 'height:' + height + 'px'
	
	document.getElementById('wrapper').setAttribute("style", wrapperdivhight)
	document.getElementById('settings').setAttribute("style", divhight)
	document.getElementById('manager').setAttribute("style", divhight)
	document.getElementById('custom').setAttribute("style", divhight)
	document.getElementById('wrapper').style.display = "block"
}

function useBrowser(url) {
	if (typeof _tera_client_proxy_ !== 'undefined') {
		_tera_client_proxy_.resize_to(1024, 768)
	}
	window.location.href = url
}

function useBrowserHelp() {
	var locale = ''
	if (typeof _tera_client_proxy_ !== 'undefined') {
		locale = _tera_client_proxy_.get_locale()
	}
	// _tera_client_proxy_.alert(locale)
	url = 'https://github.com/zc149352394/TDM/blob/master/README.md'
	_tera_client_proxy_.open_web_direct(url)
}

function openweb() {
	_tera_client_proxy_.alert("Warning:")
}

function openWebsite(url) {
	if (typeof _tera_client_proxy_ !== 'undefined') {
		_tera_client_proxy_.open_web_direct(url)
	} else {
		window.location.href = url
	}
}

function openTab(evt, tabName) {
	var i, tabcontent, tablinks
	
	tabcontent = document.getElementsByClassName("tabcontent")
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none"
	}
	
	tablinks = document.getElementsByClassName("tablinks")
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "")
	}
	
	if (evt != null) evt.currentTarget.className += " active"
	
	if (tabName === 'wrapper')  DPS()
	if (tabName === 'settings') Settings()
	if (tabName === 'manager')  Manager()
	if (tabName === 'custom')   Custom()
	
	if (tabName !== 'records') document.getElementById(tabName).style.display = "block"
	if (tabName === 'records') {
		document.getElementById('wrapper').style.display = "block"
		Records()
	}
}

function onClick(val) {
	manager_ajax(val, null)
}

function manager_ajax(url, cb) {
	var x = new XMLHttpRequest()
	pending = true
	x.open("GET", "manager/" + url, true)
	x.onload = cb
	x.send()
	return
}

function ajax(url, cb) {
	var x = new XMLHttpRequest()
	pending = true
	x.open("GET", "api/" + url, true)
	x.onload = cb
	x.send()
	return
}
// Manager tab
function Manager() {
	manager_ajax("R", ManagerCB)
}

function ManagerCB() {
	document.getElementById("manager").innerHTML = this.responseText.substring(1, this.responseText.length - 1)
}
// Custom tab
function Custom() {
	ajax("3C", CustomCB)
}

function CustomCB() {
	var data = JSON.parse(this.responseText)
	var html = ''
	// '<table><tr><td>'
	for (var key in data) {
		html += '<button class=btn onclick="excuteCCmd(event,\'' + key +'\')">' + data[key] + '</button><br>'
	}
	// document.getElementById("debug").innerHTML = html
	document.getElementById("custom").innerHTML = html
}

function excuteCCmd(evt, cmd) {
	// document.getElementById("debug").innerHTML = cmd
	ajax("4C" + cmd, null)
}
// TDM ui
function ToParty() {
	if (!warningMsg()) return
	ajax("1C", null)
}

function ToGuild() {
	if (!warningMsg()) return
	ajax("2C", null)
}

function Whisper() {
	if (!warningMsg()) return
	var n = document.getElementById("name").value
	ajax("0W" + n, null)
}

function warningMsg() {
	if (agree) return true
	if (typeof _tera_client_proxy_ !== 'undefined') {
		_tera_client_proxy_.alert("Warning: Send TDM data not to laugh at others!\nThe risk of your account being blocked as a result of this.\nIf you agree, press the button again..")
	}
	agree = true
	return false
}

function LeaveParty() {
	ajax("L", null)
}

function ExtUI() {
	ajax("E", ExtUICB)
}

function ExtUICB() {
	// console.log(this.responseText)
	var c = JSON.parse(this.responseText)
	if (typeof _tera_client_proxy_ === 'undefined') {
		// window.open(window.location.href, 'TDM', 'titlebar=no, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no')
		window.open(window.location.href, 'TDM', 'height=320,width=240,top=0,left=0,directories=no,titlebar=nostatus=no,toolbar=no,menubar=no,navigationbar=no,location=no,resizable=no,scrollbars=no')
	} else {
		// openWebsite('http://' + c.host + ':'+ c.port)
		openWebsite(window.location.href)
	}
	NoPopUp()
}

function NoPopUp() {
	ajax("P", NoPopUpCB)
}

function NoPopUpCB() {
	if (typeof _tera_client_proxy_ !== 'undefined') {
		_tera_client_proxy_.close()
	}
}

function Reset() {
	ajax("100S", ResetCB)
}

function ResetCB() {
	document.getElementById("content").innerHTML = '<br>'
}
// settings ui
function Notice() {
	ajax("N", Settings)
}

function NoticeDamageAdd() {
	ajax("A", Settings)
}

function BossOnly() {
	ajax("O", Settings)
}

function HideNames() {
	ajax("I", Settings)
}

function SkillLog() {
	ajax("1L", Settings)
}

function RankSystem() {
	ajax("2R", Settings)
}

function AllUsers() {
	ajax("U", Settings)
}

function Debug() {
	ajax("B", Settings)
}
// setting
function Settings() {
	ajax("Y", SettingsCB)
}
// Settings-function buttons
function SettingsCB() {
	TDMSettings = JSON.parse(this.responseText)
	document.getElementById("NoticeDamageAdd").innerHTML = TDMSettings.noticeDamage ? TDMSettings.noticeDamage.toString().numberWithCommas().color(enable_color) : TDMSettings.noticeDamage.toString().numberWithCommas().strike().color(disable_color)
	document.getElementById("Notice").innerHTML = TDMSettings.notice ? 'notice'.color(enable_color) : 'notice'.strike().color(disable_color)
	document.getElementById("BossOnly").innerHTML = TDMSettings.bossOnly ? 'bossOnly'.color(enable_color) : 'bossOnly'.strike().color(disable_color)
	document.getElementById("HideNames").innerHTML = TDMSettings.hideNames ? 'hideNames'.color(enable_color) : 'hideNames'.strike().color(disable_color)
	document.getElementById("SkillLog").innerHTML = TDMSettings.skillLog ? 'skillLog'.color(enable_color) : 'skillLog'.strike().color(disable_color)
	document.getElementById("RankSystem").innerHTML = TDMSettings.rankSystem ? 'rankSystem'.color(enable_color) : 'rankSystem'.strike().color(disable_color)
	document.getElementById("AllUsers").innerHTML = TDMSettings.allUsers ? 'allUsers'.color(enable_color) : 'allUsers'.strike().color(disable_color)
	document.getElementById("Debug").innerHTML = TDMSettings.debug ? 'debug'.color(enable_color) : 'debug'.strike().color(disable_color)
	document.getElementById("debug").innerHTML = 'party:'+ TDMSettings.partyLengh + '| NPCs:' + TDMSettings.NPCsLength + '| Boss:' + TDMSettings.BossLength
}

function numberWithCommas(x) {
	return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
// records tab
function Records() {
	waitForThis = true
	ajax("3R", recordsCB)
}
// History-list of recorded files
function recordsCB() {
	var res = JSON.parse(this.responseText)

	var html = '<table>'
	res.reverse()

	for (var i in res) {
		var viewNum = i
		viewNum++
		if (viewNum < 10) {	
			viewNum = '0' + viewNum
		}

		html += '<tr>'
			html += '<td><button class="btn" onclick="clickRecordsFile(\'' + res[i]+'\')">Project'+ viewNum +'</button></td>'
			html += '<td class="center">' + printDateInFormat(Number(res[i].split('.')[0])) + '</td>'
			//html += '<td class="center">' + monsterName + '</td>'
			html += '<td><button class="btn" onclick="deleteFile(\'' + res[i] + '\')">Delete</button></td>'
		html += '</tr>'

	}
	html += '</table><br>'

	document.getElementById("content").innerHTML = html
}

function printDateInFormat(m) {
	var result = ""
	var d = new Date(m)

	var yy = d.getFullYear()
	var mo = d.getMonth() + 1
	var dd = d.getDate()
	var hh = d.getHours()
	var mm = d.getMinutes()
	var ss = d.getSeconds()

	hh = hh < 10 ? '0' + hh : hh
	mo = mo < 10 ? '0' + mo : mo
	dd = dd < 10 ? '0' + dd : dd
	hh = hh < 10 ? '0' + hh : hh
	mm = mm < 10 ? '0' + mm : mm
	ss = ss < 10 ? '0' + ss : ss

	result += yy + "/" + mo + "/" + dd + " " + hh + ":" + mm + ":" + ss
	return result
}

function deleteFile(filename) {
	ajax("1F" + filename)
	Records()
}

function clickRecordsFile(filename) {
	_recordfilename = filename
	ajax("4R" + filename, clickRecordsCB)
}

function clickRecordsCB() {
	_record = JSON.parse(this.responseText)
	if (_record === '') return
	document.getElementById("content").innerHTML = recordTableDPSFormat(_record, "recordTable")
	sortTable("recordTable")
}
// History-DPS data sheet
function recordTableDPSFormat(data, tableId) {
	data.sort(function (a, b) {
		return b.totalDamage - a.totalDamage
	})

	var dpsmsg = ''
	var enragedBar = 0
	var class_image = ''

	dpsmsg += '<table id="' + tableId + '">'

	for (var i in data) {
		if (data[i].monsterBattleInfo) {
			if (data[i].etimer > 0) {
				enragedBar = data[i].etimer * 100 / 36
				dpsmsg += '<tr>'
					dpsmsg += '<th colspan="6" style="background: url(\'./icons/enraged_bar.jpg\'); background-repeat: no-repeat; background-size: ' + enragedBar + '% 12%;">'
			} else {
				enragedBar = data[i].eCountdown * 10
				dpsmsg += '<tr>'
					dpsmsg += '<th colspan="6" style="background: url(\'./icons/bar.jpg\'); background-repeat: no-repeat; background-size: ' + enragedBar + '% 10%;">'
			}
			dpsmsg += data[i].enraged
			dpsmsg += '<br>' + data[i].monsterBattleInfo + '</th></tr>'

			dpsmsg += '<tr class="titleClr">'
				dpsmsg += '<td>Name</td>'
				dpsmsg += '<td>Class</td>'
				dpsmsg += '<td>DPS</td>'

				dpsmsg += '<td>Total DMG</td>'
				dpsmsg += '<td>Crit</td>'
				dpsmsg += '<td>Dmg of Tot</td>'
			dpsmsg += '</tr>'

			continue
		}

		var nowName = data[i].name
		if (TDMSettings.myName == nowName ) {
			nowName = data[i].name.color(myName_color)
		}

		var nowDPS = data[i].dps
		if (nowDPS > redDPS) {
			nowDPS = data[i].dps.nFormatter(3)
			nowDPS = nowDPS.color(red_color)
		} else if ((yewDPS < nowDPS) && (nowDPS <= redDPS)) {
			nowDPS = data[i].dps.nFormatter(3)
			nowDPS = nowDPS.color(disable_color)
		} else if ((greDPS < nowDPS) && (nowDPS <= yewDPS)) {
			nowDPS = data[i].dps.nFormatter(3)
			nowDPS = nowDPS.color(green_color)
		} else {
			nowDPS = data[i].dps.nFormatter(3)
		}

		var nowCrit = data[i].crit + '%'.color(disable_color)
		if (data[i].class == 6 || data[i].class == 7) {
			nowCrit = data[i].healCrit + '%'.color(enable_color)
		}

		dpsmsg += '<tr>'
			dpsmsg += '<td class="center">' + (TDMSettings.hideNames ? '****' : nowName) + '</td>'
			dpsmsg += '<td class="center"><img onclick="recordedStastics(\''+ i +'\')" src="./class-icons/' + classIdToName(data[i].class).toLowerCase() + '.png' +'" /></td>'
			
			dpsmsg += '<td style="background: url(\'./icons/bar.jpg\'); background-repeat: no-repeat; background-size: ' + data[i].percentage+'% 20%;">'
					+ nowDPS + '</td>'

			dpsmsg += '<td>' + data[i].totalDamage.nFormatter(3) + '</td>'
			dpsmsg += '<td>' + nowCrit + '</td>'
			dpsmsg += '<td>' + data[i].percentage  + '%'.color(disable_color) + '</td>'
		dpsmsg += '</tr>'
	}

	dpsmsg += '</table>'

	return dpsmsg
}

function recordedStastics(index) {
	document.getElementById("content").innerHTML = _record[index].stastics
}
// dps tab
function DPS() {
	// reset recordFilename
	ajax("5R", null)
	
	if (waitForThis == true) return RefreshDPS()
	waitForThis = false
	previousDps = 'NEW'
}

function RefreshDPS() {
	previousDps = 'NEW'
	waitForThis = false
	ajax("1R", refreshCB)
	var i = setInterval(function () {
		if (waitForThis) {
			clearInterval(i)
			return
		}
		ajax("1R", refreshCB)
	}, 1000)
}

function ReloadTDM() {
	ajax("X", refreshCB)
}

function refreshCB() {
	_skillInfo = []
	var res = JSON.parse(this.responseText)
	// console.log(res)
	if (res === '' ) return
	var result = tableDPSFormat(res, "dpsTable")
	if (result === previousDps) return
	if (waitForThis == true) return
	document.getElementById("content").innerHTML = result + '<br>'
	sortTable("dpsTable")

	previousDps = result
}
// Instant-DPS data sheet
function tableDPSFormat(data, tableId) {
	var dpsmsg = ''
	var enragedBar = 0
	var class_image = ''
	
	dpsmsg += '<table id="' + tableId + '">'
	
	for (var i in data) {
		if (data[i].monsterBattleInfo) {
			if (data[i].etimer > 0) {
				enragedBar = data[i].etimer * 100 / 36
				enragedSound.volume = 0.500000
				enragedSound.play()
				dpsmsg += '<tr>'
					dpsmsg += '<th colspan="6" style="background: url(\'./icons/enraged_bar.jpg\'); background-repeat: no-repeat; background-size: ' + enragedBar + '% 12%;">'
			} else {
				enragedSound.pause()
				enragedBar = data[i].eCountdown * 10
				dpsmsg += '<tr>'
					dpsmsg += '<th colspan="6" style="background: url(\'./icons/bar.jpg\'); background-repeat: no-repeat; background-size: ' + enragedBar + '% 10%;">'
			}
			dpsmsg += data[i].enraged
			dpsmsg += '<br>' + data[i].monsterBattleInfo + '</th></tr>'
			
			dpsmsg += '<tr class="titleClr">'
				dpsmsg += '<td>Name</td>'
				dpsmsg += '<td>Class</td>'
				dpsmsg += '<td>DPS</td>'
				
				dpsmsg += '<td>Total DMG</td>'
				dpsmsg += '<td>Crit</td>'
				dpsmsg += '<td>Dmg of Tot</td>'
			dpsmsg += '</tr>'
			
			continue
		}
		
		if (data[i].command) {
			if (data[i].command === 'matching alarm') eventSound.play()
			continue
		}
		
		var nowName = data[i].name
		if (TDMSettings.myName == nowName ) {
			nowName = data[i].name.color(myName_color)
		}
		
		var nowDPS = data[i].dps
		if (nowDPS > redDPS) {
			nowDPS = data[i].dps.nFormatter(3)
			nowDPS = nowDPS.color(red_color)
		} else if ((yewDPS < nowDPS) && (nowDPS <= redDPS)) {
			nowDPS = data[i].dps.nFormatter(3)
			nowDPS = nowDPS.color(disable_color)
		} else if ((greDPS < nowDPS) && (nowDPS <= yewDPS)) {
			nowDPS = data[i].dps.nFormatter(3)
			nowDPS = nowDPS.color(green_color)
		} else {
			nowDPS = data[i].dps.nFormatter(3)
		}
		
		var nowCrit = data[i].crit + '%'.color(disable_color)
		if (data[i].class == 6 || data[i].class == 7) {
			nowCrit = data[i].healCrit + '%'.color(enable_color)
		}
		
		dpsmsg += '<tr>'
			dpsmsg += '<td class="center">' + (TDMSettings.hideNames ? '****' : nowName) + '</td>'
			dpsmsg += '<td class="center"><img onclick="skillLog(\'' + data[i].name.stripHTML() + '\', ' + data[i].class + ')" src="./class-icons/' + classIdToName(data[i].class).toLowerCase() + '.png' + '"/></td>'
			
			dpsmsg += '<td style="background: url(\'./icons/bar.jpg\'); background-repeat: no-repeat; background-size: ' + data[i].percentage +'% 20%;">'
					+ nowDPS + '</td>'
			
			dpsmsg += '<td>' + data[i].totalDamage.nFormatter(3) + '</td>'
			dpsmsg += '<td>' + nowCrit  + '</td>'
			dpsmsg += '<td>' + data[i].percentage  + '%'.color(disable_color) + '</td>'
		dpsmsg += '</tr>'
	}
	
	dpsmsg += '</table>'
	return dpsmsg
}
// skillLog tab
function skillLog(n, c) {
	_name = n
	_classId = c
	waitForThis = true
	ajax(c + "S", getSkillInfoCB)
}

function getSkillInfoCB() {
	_skillInfo = JSON.parse(this.responseText)
	// console.log(_skillInfo)
	ajax("2L" + _name, skillLogCB)
}
// Instant-skill log
function skillLogCB() {
	slog = []
	slog = JSON.parse(this.responseText)
	//console.log(this.responseText)
	var	html = '<button class="btn" onclick="dpsStastic()">DetailedData</button>'

	html += '<table>'
		html += '<tr class="titleClr">'
			html += '<td>Time</td>'
			html += '<td>Skill log</td>'
			html += '<td>Data</td>'
		html += '</tr>'
	//var backward = 0
	slog.reverse()
	for (var i in slog) {
		//backward = slog.length -1 - i
		html += '<tr>'
			html += '<td>' + (new Date(slog[i].Time)).toTimeString().slice(0, 8).color(green_color) + '</td>'
			html += '<td class="center">' + (slog[i].isPet ? slog[i].petName : skillIdToName(slog[i].skillId)).color(disable_color) + '</td>'
			html += '<td>' + (slog[i].crit ? slog[i].damage.nFormatter(3).color(red_color) : slog[i].damage.nFormatter(3)) + '</td>'
		html += '</tr>'
		//console.log(slog[i].damage)
	}
	html += '</table>'

	document.getElementById("content").innerHTML = html
}
// Instant-detailed data sheet
function dpsStastic() {
	var s= []

	// set skill name
	for (var i in slog) {
		if (slog[i].isPet) {
			slog[i]['name'] = slog[i].petName
		} else {
			slog[i]['name'] = skillIdToName(slog[i].skillId)
		}
	}

	for (var i in slog) {
		var t = slog[i]
		var id = t.skillId
		var name = t.name
		var damage = t.damage
		var c = t.crit
		var found = false
		// search skill id and insert data
		for (var j in s) {
			if (s[j].name === name) {
				s[j].wDamage = c ? s[j].wDamage : s[j].wDamage + damage
				s[j].rDamage = c ? s[j].rDamage + damage : s[j].rDamage
				s[j].tDamage = s[j].rDamage + s[j].wDamage
				s[j].crit = c ? s[j].crit + 1 : s[j].crit,
				s[j].hitCount = s[j].hitCount + 1
				// console.log( s[j].wDamage + ' ' + s[j].wDamage)
				found = true
				break
			}
		}
		// not found push a new entity
		if (!found) {
			var d = {
				'name': name,
				'wDamage': c ? 0 : damage,
				'rDamage': c ? damage : 0,
				'tDamage': damage,
				'crit': c ? 1 : 0,
				'hitCount': 1
			}
			s.push(d)
			//console.log('pushed ' + id)
		}
	}
	// console.log(s)
	// sort by total damage
	s.sort(function (a, b) {
		return b.tDamage - a.tDamage
	})

	var html = '<button class="btn" onclick="skillLog(\'' + _name + '\', \'' + _classId + '\')">SkillLog</button>'

	html += '<table>'
		html += '<tr class="titleClr">'
			html += '<td rowspan=2>DetailedData</td>'

			html += '<td>White</td>'
			html += '<td>Red</td>'
			html += '<td>Total</td>'
			html += '<td>Crit</td>'
		html += '</tr>'

		html += '<tr class="titleClr">'
			html += '<td>Average</td>'
			html += '<td>Average</td>'
			html += '<td>Average</td>'
			html += '<td>Red / hop</td>'
		html += '</tr>'
	// console.log(s)
	var avg = 0
	for (var i in s) {
		// console.log(s[i].wDamage +' '+ s[i].rDamage)
		// Skill name
		var t = s[i].wDamage + s[i].rDamage
		html += '<tr>'
		html += '<td class="center">' + s[i].name.color(disable_color) + '</td>'
		// 白字
		avg = 0
		if (s[i].hitCount - s[i].crit != 0) {
			avg = Math.floor(s[i].wDamage/(s[i].hitCount - s[i].crit))
		}
		html += '<td>' + s[i].wDamage.nFormatter(3) + '<br>' + avg.nFormatter(3) + '</td>'
		// 红字
		avg = 0
		if (s[i].crit != 0) {
			avg = Math.floor(s[i].rDamage/(s[i].crit))
		}
		html += '<td class="critClr">' + s[i].rDamage.nFormatter(3) + '<br>' + avg.nFormatter(3) + '</td>'
		// 合计
		avg = 0
		if (s[i].hitCount != 0) {
			avg = Math.floor(s[i].tDamage/(s[i].hitCount))
		}
		html += '<td class="totalClr">' + s[i].tDamage.nFormatter(3) + '<br>' + avg.nFormatter(3) + '</td>'
		// 暴率
		html += '<td class="perClr">' + Math.floor(s[i].crit*100/s[i].hitCount) + '%' + '<br>' + s[i].crit + '/' + s[i].hitCount + '</td>'
		html += '</tr>'
	}
	html += '</table>'

	document.getElementById("content").innerHTML = html
}

function skillIdToName(id) {
	if (_skillInfo.length == 0) return 'skill tsv missing'
	var sid = id.slice(1,id.length)
	return binarySearchSkillName(_skillInfo, sid, 0, _skillInfo.length - 1)
}

function binarySearchSkillName(d, t, s , e) {
	const m = Math.floor((s + e)/2)
	var target = Number(t)
	var id = Number(d[m].id)
	if (target == id) return d[m].skillName
	if (e - 1 == s) return 'undefined'
	if (target > id) return binarySearchSkillName(d, t, m, e)
	if (target < id) return binarySearchSkillName(d, t, s, m)
}

function classIdToName(id) {
	if (id ==  0) return 'Warrior'
	if (id ==  1) return 'Lancer'
	if (id ==  2) return 'Slayer'
	if (id ==  3) return 'Berserker'
	if (id ==  4) return 'Sorcerer'
	if (id ==  5) return 'Archer'
	if (id ==  6) return 'Priest'
	if (id ==  7) return 'Mystic'
	if (id ==  8) return 'Reaper'
	if (id ==  9) return 'Gunner'
	if (id == 10) return 'Brawler'
	if (id == 11) return 'Ninja'
	if (id == 12) return 'Valkyrie'
	return 'common'
}

function sortTable(tabeId) {
	var table, rows, switching, i, x, y, shouldSwitch
	table = document.getElementById(tabeId)
	switching = true
	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
		//start by saying: no switching is done:
		switching = false
		rows = table.getElementsByTagName("TR")
		/*Loop through all table rows (except the
		first, which contains table headers):*/
		for (i = 1; i < rows.length - 1; i++) {
			//start by saying there should be no switching:
			shouldSwitch = false
			/*Get the two elements you want to compare,
			one from current row and one from the next:*/
			x = rows[i].getElementsByTagName("TD")[1]
			y = rows[i + 1].getElementsByTagName("TD")[1]
			//check if the two rows should switch place:
			if (Number(x.innerHTML.replace(',', '')) < Number(y.innerHTML.replace(',', ''))) {
				//if so, mark as a switch and break the loop:
				shouldSwitch = true
				break
			}
		}
		if (shouldSwitch) {
			/*If a switch has been marked, make the switch
			and mark that a switch has been done:*/
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
			switching = true
		}
	}
}

/* 
function Clipboard() {
	var copyText = document.getElementById("txt")
	copyText.select()
	document.execCommand("copy")
}

function printStastics(value) {
	document.getElementById("content").innerHTML = html
}

function validate(evt) {
	var theEvent = evt || window.event
	var key = theEvent.keyCode || theEvent.which
	key = String.fromCharCode( key )
	var regex = /[0-9]|\./
	if (!regex.test(key)) {
		theEvent.returnValue = false
		if (theEvent.preventDefault) {
			theEvent.preventDefault()
		}
	}
}

function nullClientProxy () {
	this.set_title = function (t) {
		document.title = t
	}
	function alert(m) {
		alert(m)
	}
	this.get_locale = function () {}
	this.open_web_direct = function (url) {
		window.location.href = url
	}
	this.close = 0
}
 */
