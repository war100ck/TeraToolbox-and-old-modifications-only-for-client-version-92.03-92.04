const DefaultSettings = {
    "enabled": true,
    "notifications": true, // 文字提示
    "dungeonZoneLoc": [
        /* {
            name: "贝利卡 - 仓库",
            zone: 7005,
            loc: [-341, 8671, 2179],
            w: -3.2
        },
        {
            name: "飞艇下级 - 尾王",
            zone: 9716,
            loc: [49504, 129121, 3722],
            w: -2
        },
        {
            name: "古代地下水道 - 尾王",
            zone: 9777,
            loc: [-112673, -34856, 470],
            w: 2
        },
        {
            name: "Последний БОСС Лакан",  // Последний босс Лакан
            zone: 9781,
            loc: [39419, -113077, 17212],
            w: 2.8
        },*/
        {
            name: "Одиночное испытание Золотой лабиринт -  убей Баракоса",
            zone: 9032,
            loc: [28200, 179815, -1670],
            w: -2
        },
        {
            name: "Одиночное испытание - убей Кошмарную Акашу",
            zone: 9031,
            loc: [72487,134052,-503],
            w: 2
        },
       /* {
            name: "奇丽安森林 - 尾王",
            zone: 9713,
            loc: [52232, 117318, 4383],
            w: 2
        }*/
        {
            name: "Зона входа к Телепорту на Одиночное испытание - Поляна Древней",
            zone: 9714,
            loc: [-10644, -7847, -9855],
            w: -2
        }
    ]
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
                    if (option == "dungeonZoneLoc") continue
                    if (settings[option]) {
                        settings[option] = oldsettings[option]
                    }
                }
                break;
        }
        return settings;
    }
}
