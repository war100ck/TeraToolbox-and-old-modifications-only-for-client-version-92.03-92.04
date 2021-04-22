const DefaultSettings = {
    "enabled": false,
    "sendToAlert":  true, // Предупреждение на экране
    "sendToNotice": true, // Главное уведомление
    "markerId":    88704, // 光柱提示物 88704 ---古龍貝勒古斯的頭
    "plants": [
        {id: 1, name: 'Редкий', msg: 'Густой кустарник'},
        {id: 2, name: 'Растения', msg: 'Дикая кукуруза'},
        {id: 3 ,name: 'Растения', msg: 'Дикая морковка'},
        {id: 4, name: 'Растения', msg: 'Кадмильский гриб'},
        {id: 5, name: 'Растения', msg: 'Старая тыква'},
        {id: 6, name: 'Растения', msg: 'Яблоня'}
    ],
    "mining": [
        {id: 101, name: 'Редкий', msg: 'Валун'},
        {id: 102, name: 'Руда', msg: 'Кобаловая руда'},
        {id: 103, name: 'Руда', msg: 'Шадметаллическая руда'},
        {id: 104, name: 'Руда', msg: 'Зерметаллическая руда'},
        {id: 105, name: 'Руда', msg: 'Норметаллическая руда'},
        {id: 106, name: 'Руда', msg: 'Галенит'}
    ],
    "energy": [
        {id: 201, name: 'Редкий', msg: 'Бесцветный кристалл'},
        {id: 202, name: 'Эссенция', msg: 'Красный кристалл'},
        {id: 203, name: 'Эссенция', msg: 'Зеленый кристалл'},
        {id: 204, name: 'Эссенция', msg: 'Голубой кристалл'},
        {id: 205, name: 'Эссенция', msg: 'Белый кристалл'},
        {id: 206, name: 'Эссенция', msg: 'Зараженный цветок'}
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
        if (from_ver + 1 < to_ver) {
            // Recursively upgrade in one-version steps
            settings = MigrateSettings(from_ver, from_ver + 1, settings);
            return MigrateSettings(from_ver + 1, to_ver, settings);
        }
        
        // If we reach this point it's guaranteed that from_ver === to_ver - 1, so we can implement
        // a switch for each version step that upgrades to the next version. This enables us to
        // upgrade from any version to the latest version without additional effort!
        switch(to_ver) {
            default:
                let oldsettings = settings
                
                settings = Object.assign(DefaultSettings, {});
                
                for(let option in oldsettings) {
                    if(settings[option]) {
                        settings[option] = oldsettings[option]
                    }
                }
                
                break;
        }
        
        return settings;
    }
}
