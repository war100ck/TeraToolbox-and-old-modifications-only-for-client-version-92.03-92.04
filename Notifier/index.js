const Notifiers = require('./notifiers/notify'),
	fs = require('fs'),
	path = require('path'),
	decodehtml = require('./decodeHTML')
	
require('./notifiers/dependencies/activeWindowTitle')

class Notifier {
	constructor(dispatch) {
		this.dispatch = dispatch;
	}
	
/////Exports
	notifyafk(args,afktimeout) {
		if(afktimeout !== undefined) console.log('[TERA NOTIFIER] One or more of your modules is still using timeout for notifyafk, which is deprecated.')
			
		try{	
			if(activeWindow.title() !== this.dispatch.settings.processTitle) {
				if(!args.icon) args.icon = path.join(__dirname,this.dispatch.settings.iconfile)
		
				args.message = decodehtml.decodeHTMLEntities(args.message)
				Notifiers.notify(args)
				return true
			}
			else
				return false
		}
		catch(e) {console.log(e)}
	}

	notify(args) {
		if(!args.icon) args.icon = path.join(__dirname,this.dispatch.settings.iconfile)
			
		args.message = decodehtml.decodeHTMLEntities(args.message)	
		Notifiers.notify(args)
	}
	
	message(msg) {
		msg = decodehtml.decodeHTMLEntities(msg);
		
		Notifiers.notify({
			title: 'TERA',
			message: msg,
			wait:false, 
			icon:path.join(__dirname,this.dispatch.settings.iconfile),
			sound:'Notification.IM', 
		})
	}
	
	messageafk(msg,afktimeout) {
		if(afktimeout !== undefined) console.log('[TERA NOTIFIER] One or more of your modules is still using timeout for messageafk, which is deprecated.')
		
		//In case our little program run into any errors.
		try {
			if(activeWindow.title() !== this.dispatch.settings.processTitle) {
				this.message(msg)
				return true
			}
			else 
				return false
		}
		catch(e) {console.log(e)}
	}
	
}

function sendAlert(msg){
	msg = decodehtml.decodeHTMLEntities(msg);
		
	Notifiers.notify({
		title: 'TERA',
		message: msg,
		wait:false, 
		icon:path.join(__dirname,this.dispatch.settings.iconfile),
		sound:'Notification.IM', 
	})
}


let map = new WeakMap() 

module.exports = function Require(dispatch) {
	let mapbase = dispatch.base || dispatch.dispatch
	if(map.has(mapbase)) return map.get(mapbase) //Update .base to .dispatch

	let notifier = new Notifier(dispatch)
	map.set(mapbase, notifier)
	return notifier
}