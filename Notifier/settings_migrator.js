"use strict"

const DefaultSettings = {
	notifierType: "toast",
	processTitle: "TERA",
	iconfile: "tera.png"
}

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        // Migrate legacy config file
        return Object.assign(Object.assign({}, DefaultSettings), settings);
    } else if (from_ver === null) {
        // No config file exists, use default settings
        return DefaultSettings;
    } else {
		
		if (from_ver + 1 < to_ver) {

            settings = MigrateSettings(from_ver, from_ver + 1, settings);
            return MigrateSettings(from_ver + 1, to_ver, settings);
        }

        switch(to_ver) {			
			case 2:
				console.log('[TERA Notifier] Hello o/! This module has switched to using an node addon')
				console.log('[TERA Notifier] to determine whether you are AFK from TERA!')
				console.log('[TERA Notifier] DM me @Seren in any of the proxy discords if you find issues!')
				delete settings.AFK_TIMEOUT
				settings.processTitle = "TERA"
				settings.iconfile = "tera.png"
				return settings
				break
		}
		
    }
}