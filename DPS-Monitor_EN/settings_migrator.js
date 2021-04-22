const DefaultSettings = {
    "enabled": true,
    "popup":             true, // Display window
    "leaving_msg":       "3Q", // Оставить сообщение
    "notice":            true, // 设置 技能伤害大小 提示
    "notice_damage":  5000000, // 触发大小
    "bossOnly":          true, // DPS仅记录输出BOSS
    "hideNames":        false, // 隐藏昵称
    "skillLog":          true, // 技能日志
    "rankSystem":       false, // 自动上传排行榜系统
    "allUsers": false,
    "debug" : false
};

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        // Migrate legacy config file
        return Object.assign(Object.assign({}, DefaultSettings), settings);
    } else if (from_ver === null) {
        // No config file exists, use default settings
        return DefaultSettings;
    } else {
        // Migrate from older version (using the new system) to latest one
        if (from_ver + 1 < to_ver) { // Recursively upgrade in one-version steps
            settings = MigrateSettings(from_ver, from_ver + 1, settings);
            return MigrateSettings(from_ver + 1, to_ver, settings);
        }
        // If we reach this point it's guaranteed that from_ver === to_ver - 1, so we can implement
        // a switch for each version step that upgrades to the next version. This enables us to
        // upgrade from any version to the latest version without additional effort!
        switch (to_ver) {
            default:
                let oldsettings = settings
                settings = Object.assign(DefaultSettings, {});
                for (let option in oldsettings) {
                    if (settings[option]) {
                        settings[option] = oldsettings[option]
                    }
                }
                break;
        }
        return settings;
    }
}
