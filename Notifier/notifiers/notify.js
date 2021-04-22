const os = require('os');
const utils = require('./lib/utils');
let notifierType = 'toast';
try {
	const config = require('../config.json') //Seren
	notifierType = config.data ? config.data.notifierType.toLowerCase():config.notifierType.toLowerCase() //Seren, too many legacy support...
}
catch(e){}

if(notifierType !== 'toast' && notifierType !== 'balloon') console.log('[Tera Notifier] Error in config. Use toast or balloon only'); //Seren

// All notifiers
//var NotifySend = require('./notifiers/notifysend');
//var NotificationCenter = require('./notifiers/notificationcenter');
const WindowsToaster = require('./notifiers/toaster');
const Growl = require('./notifiers/growl');
const WindowsBalloon = require('./notifiers/balloon');

let options = { withFallback: true };



switch (os.type()) {
  /*case 'Linux':
    module.exports = new NotifySend(options);
    module.exports.Notification = NotifySend;
    break;
  case 'Darwin':
    module.exports = new NotificationCenter(options);
    module.exports.Notification = NotificationCenter;
    break;*/
  case 'Windows_NT':
    if (utils.isLessThanWin8() || notifierType == 'balloon') { //Seren
	  if(notifierType == 'balloon') options.withFallback = false;
      module.exports = new WindowsBalloon(options);
      module.exports.Notification = WindowsBalloon;
    } else {
      module.exports = new WindowsToaster(options);
      module.exports.Notification = WindowsToaster;
    }
    break;
  default:
    if (os.type().match(/BSD$/)) {
      //module.exports = new NotifySend(options);
      //module.exports.Notification = NotifySend;
    } else {
      module.exports = new Growl(options);
      module.exports.Notification = Growl;
    }
}

// Expose notifiers to give full control.
//module.exports.NotifySend = NotifySend;
//module.exports.NotificationCenter = NotificationCenter;
module.exports.WindowsToaster = WindowsToaster;
module.exports.WindowsBalloon = WindowsBalloon;
module.exports.Growl = Growl;
