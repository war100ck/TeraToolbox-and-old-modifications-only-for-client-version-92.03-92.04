const DefaultSettings = {
    "enabled": false,
    "autoGetting":         true, // 提取鱼饵
    "autoCrafting":        true, // 合成鱼饵
    "filterGolden":        true, // 保留金鱼
    "autoSelling":         true, // 出售鱼类
    "autoDismantling":     true, // 分解鱼类
    "discardFilets":       true, // 丢弃鱼肉
    "discardCount":        1000, // 丢弃数量
    "reUseFishSalad":      true, // 食用沙拉
    "autoFishSalad": [
        206020,                  // 魚沙拉
        206040                   // [活動] 魚沙拉
    ],
    "autoUse":             true, // 喂养跟班
    "autoUseAt":             50, // 触发能量(1% ~ 100%)
    "autoFoods": [
        206046,                  // 普通飼料
        206047,                  // 優質飼料
        206048                   // 高級飼料
    ],
    "autoGifts": [
        206049,                  // 小狗雕像
        206050,                  // 豬雕像
        206051                   // 波波利雕像
    ],
    "useRandomDelay":      true, // 拉钩延迟
    "startDelay":  [1000, 2000], // 开始游戏 最低 最高 毫秒(ms)
    "catchDelay":  [2000, 8000], // 完成游戏 最低 最高 毫秒(ms)
    "moveItemDelay": [200, 500], // 添加 鱼 的延迟
    "castDistance":           3, // 抛竿蓄力层数 0 ~ 18 (系统<=3)
    "craftableBaits": [          // 鱼饵/蚯蚓-Buff-制作配方 关联信息
        // 最初阶
        {abnormalityId:   70271, itemId: 206000, maxAmount:  60, recipeId: null},
        {abnormalityId:   70281, itemId: 206005, maxAmount: 300, recipeId: null},
        // 初阶
        {abnormalityId:   70272, itemId: 206001, maxAmount:  60, recipeId: 204100},
        {abnormalityId:   70282, itemId: 206006, maxAmount: 300, recipeId: 204100},
        // 中阶
        {abnormalityId:   70273, itemId: 206002, maxAmount:  60, recipeId: 204101},
        {abnormalityId:   70283, itemId: 206007, maxAmount: 300, recipeId: 204101},
        // 高阶
        {abnormalityId:   70274, itemId: 206003, maxAmount:  60, recipeId: 204102},
        {abnormalityId:   70284, itemId: 206008, maxAmount: 300, recipeId: 204102},
        // 最高阶
        {abnormalityId:   70275, itemId: 206004, maxAmount:  60, recipeId: 204103},
        {abnormalityId:   70285, itemId: 206009, maxAmount: 300, recipeId: 204103},
        // 填塞式集魚餌
        {abnormalityId:   70276, itemId: 206053, maxAmount:  60, recipeId: null},
        // [活動] 福袋路亞
        {abnormalityId: 5050003, itemId: 223133, maxAmount:  50, recipeId: null}
    ],
    "rods": [                    // 钓竿 关联信息
        206700, "Старая удочка",
        206701, 206702, 206703, 206704, 206705, 206706, 206707, 206708, "Стальная удочка     I - VIII",
        206711, 206712, 206713, 206714, 206715, 206716, 206717, 206718, "Удочка из ясеня     I - VIII",
        206721, 206722, 206723, 206724, 206725, 206726, 206727, 206728, "Волшебная удочка I - VIII"
    ],
    "autoDismantleFishes": [     // 自动分解的鱼类
        206400, // [0等级]罗汉鱼
        206401, // [0等級]蓝颊鲫鱼

        206402, // [1等级]鳌虾
        206403, // [1等级]小丑鱼

        206404, // [2等级]神仙鱼
        206405, // [2等级]黑色小丑鱼

        206406, // [3等级]鱿鱼
        206407, // [3等级]鲫鱼

        206408, // [4等级]海鳗
        206409, // [4等级]拟刺尾鲷
        206410, // [4等级]河鳗

        206411, // [5等级]章鱼
        206412, // [5等级]四鳍旗鱼
        206413, // [5等级]鲑鱼

        206414, // [6等级]魟鱼
        206415, // [6等级]花鲶
        206416, // [6等级]平口油鲶
        206417, // [6等级]鲤鱼

        206418, // [7等级]食人鲨
        206419, // [7等级]银鲑
        206420, // [7等级]电鳗
        206421, // [7等级]黄鳍鲔

        206422, // [8等级]黑点刺魟
        206423, // [8等级]石章鱼
        206424, // [8等级]血红赤枪鱼
        206425, // [8等级]彩虹鲤

        206426, // [9等级]太平洋黑鲔
        206427, // [9等级]金色螯虾
        206428, // [9等级]赤红鱿鱼
        206429, // [9等级]古代藓苔鲑鱼
        206430, // [9等级]黄金鳗

        206431, // [10等级]红鲨	
        206432, // [10等级]巴鲣	
        206433, // [10等级]翡翠蓝枪鱼
        206434, // [10等级]悲鸣鲨鱼
        206435, // [10等级]血红鳗

        206436, // [1等級]海葵
        206437, // [2等級]寄居蟹
        206438, // [2等級]烏賊
        206439, // [3等級]核心海葵
        206440, // [3等級]風鈴水母
        206441, // [4等級]馬尾鬥魚
        206442, // [4等級]食人鯧
        206443, // [5等級]風船水母
        206444, // [5等級]鸚鵡螺
        206445, // [6等級]絨球
        206446, // [6等級]電魟
        206447, // [7等級]彩虹海葵
        206448, // [7等級]血紅鮪
        206449, // [8等級]紅眼食人鯧
        206450, // [8等級]阿勒卡夫馬尾鬥魚
        206451, // [9等級]粉紅鯰魚
        206452, // [9等級]星光魷
        206453, // [9等級]電鯽
        206454, // [10等級]黃金水母
        206455, // [10等級]血紅鮭
        206456, // [10等級]擬態章魚

        206500, // [大物]巨鯰(主线)
        206501, // [大物]黃金鯊(主线)
        206502, // [大物]神仙烏鳢(主线)
        206503, // [大物]黄金雨伞旗鱼
        206504, // [大物]女王鮭(主线)
        206505, // [大物]黃金章魚(主线)

        206506, // [大物]巨型螯虾
        206507, // [大物]黄金魟鱼
        206508, // [大物]黑尾鳍鲔
        206509, // [大物]黄金鲫鱼
        206510, // [大物]菊石
        206511, // [大物]彩虹水母
        206512, // [大物]阿勒卡夫食人鯧
        206513, // [大物]雲彩海葵
        206514  // [大物]風鈴馬尾鬥魚

    ],
    "autoSellFishes": [          // 自动出售的鱼类
        206400, // Stone Moroko
        206401, // Azurecheek Carp
        206402, // Crayfish
        206403, // Clownfish
        206404, // Angelfish
        206405, // Black-fin Clownfish
        206406, // Squid
        206407, // Crucian Carp
        206408, // Sea Eel
        206409, // Tang Fish
        206410, // Freshwater Eel
        206411, // Octopus
        206412, // Marlin
        206413, // Prince Salmon
        206414, // Mottled Ray
        206415, // Catfish
        206416, // Channel Catfish
        206417, // Eldritch Carp
        206418, // Gula Shark
        206419, // Chroma Salmon
        206420, // Electric Eel
        206421, // Yellowfin
        206422, // Dipturus
        206423, // Stone Octopus
        206424, // Crimson Marlin
        206425, // Prism Carp
        206426, // Bluefin
        206427, // Golden Crayfish
        206428, // Crimson Squid
        206429, // Mossback
        206430, // Golden Eel
        206431, // Crimson Shark
        206432, // Specklefin
        206433, // Makaira
        206434, // Gluda Shark
        206435, // Shrieking Eel
        206436,
        206437,
        206438,
        206439,
        206440,
        206441,
        206442,
        206443,
        206444,
        206445,
        206446,
        206447,
        206448,
        206449,
        206450,
        206451,
        206452,
        206453,
        206454,
        206455,
        206456,

        206500, // Giant Blue
        206501, // Golden Shark
        206502, // Fairy Snakehead
        206503, // Golden Sailfish
        206504, // Queen Salmon
        206505, // Golden Octopus
        206506, // Giant Blue
        206507, // Golden Ray
        206508, // Darkfin
        206509, // Golden Carp
        206510,
        206511,
        206512,
        206513,
        206514
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
					if (option == "craftableBaits" || option == "autoDismantleFishes" || option == "autoSellFishes") continue
                    if (settings[option]) {
                        settings[option] = oldsettings[option]
                    }
                }
                break;
        }
        return settings;
    }
}
