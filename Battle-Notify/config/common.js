module.exports = [
	/* 
	异常事件 配置说明(不区分大小写)
	message:	{icon}					异常图标
				{duration}				异常的剩余持续时间
				{stacks}				此异常的层数
				{name}					指定目标的游戏内名称
				{nextEnrage}			下一次愤怒的HP百分比 只适用于BOSS
				{green}					绿
				{yellow}				黄
				{orange}				橙
				{red}					红
				{violet}				粉
				{blue}					蓝
				{darkblue}				深蓝
				{lightblue}				亮蓝
				{white}					白
				{grey}					灰
				{gray}					灰

	type:		"Added"					当目标添加了此异常
				"AddedOrRefreshed"		在目标上添加或刷新了此异常
				"Refreshed"				目标的此异常得到更新
				"Expiring"				目标的此异常即将消失
				"Removed"				目标的此异常已经移除
				"Missing"				目标缺少此异常
				"MissingDuringCombat"	类似于Missing, 但只有在战斗时才会触发

	target:		"Self"					你的角色
				"MyBoss"				你正在攻击的BOSS
				"Party"					任何队员, 不包括你自己
				"PartyIncludingSelf"	任何队员, 包括你自己

	time_remaining:						指定触发时间 - 单位秒(s)

	abnormalities:						https://github.com/neowutran/TeraDpsMeterData/tree/master/hotdot/ hotdot-TW.tsv
	*/
	/* {	message: "{icon} {green}愤怒已开始 {duration}",
		type: "added",
		target: "MyBoss",
		abnormalities: 8888888
	},
	{	message: "{icon} {yellow}愤怒快结束 {duration}",
		type: "expiring",
		target: "MyBoss",
		abnormalities: 8888888,
		time_remaining: [10, 3]
	},
	{	message: "{icon} {red}愤怒已结束 {white}下次 {nextEnrage}",
		type: "removed",
		target: "MyBoss",
		abnormalities: 8888888
	}, */
	// 元素
	{	message: "{#ff7eff}疫病長槍 [BOSS-减抗] {duration} {icon}",
		type: "added",
		target: "MyBoss",
		abnormalities: [
			701700,
			701701,
			701702,
			701703,
			701704,
			701705,
			701706,
			701707,
			701708,
			
			701720,
			701721,
			701722,
			701723,
			701724,
			701725,
			701726,
			701727,
			701728,
			
			701820,
			701821,
			701822,
			701823,
			701824,
			701825,
			701826,
			701827,
			701828
		]
	},
	{	message: "{#ffcc00}守護精靈 [护盾] [擊倒/僵硬免疫] {duration} {icon}",
		type: "added",
		target: "Self",
		abnormalities: 702001
	},
	/* {	message: "{#00FF00}生命精靈 [移速+恢复] [跌倒解除] {duration} {icon}",
		type: "added",
		target: "Self",
		abnormalities: 702002
	},
	{	message: "{#ff7eff}閃電精靈 [力量+  15] [跌倒解除] {duration} {icon}",
		type: "added",
		target: "Self",
		abnormalities: 702003
	},
	{	message: "{#FF0000}破壞精靈 [爆威+ 0.6] [跌倒解除] {duration} {icon}",
		type: "added",
		target: "Self",
		abnormalities: 702004
	}, */
	// 祭祀
	{	message: "{#00FF00}守護盔甲 [护盾+] [擊倒/僵硬免疫] {duration} {icon}",
		type: "added",
		target: "Self",
		abnormalities: [800300, 800301, 800302, 800303, 800304]
	},
	/* {	message: "{#ff7d00}全神卷軸 [力量+] [爆擊威力增加+] {duration} {icon}",
		type: "added",
		target: "Self",
		abnormalities: [805710, 805711, 805712, 805713]
	}, */
	{	message: "{#ff7d00}審判卷軸 [力量+20] [爆擊+30] - {duration} {icon}",
		type: "added",
		target: "Self",
		abnormalities: [805800, 805803]
	},
	// 枪骑
	{	message: "{#56B4E9}信賴之力 [力量+30%] [抗打+91%] 45s {icon}",
		type: "added",
		target: "Self",
		abnormalities: [200230, 200231, 200232]
	},
	{	message: '{#00ffff}戰鬥意志 [攻速+20%] [怪伤 +5%] {duration} {icon}',
		type: "added",
		target: "Self",
		abnormalities: [200701, 200700, 201903, 201905]
	},
	{	message: "{#0196ff}戰線維護 [击倒/僵直免疫] {duration} {icon}",
		type: "added",
		target: "Self",
		abnormalities: 201600
	},
	{	message: "{#ffcc00}天界盾牌 [无敌+移速] [擊倒/僵硬/昏厥免疫] {duration} {icon}",
		type: "added",
		target: "Self",
		abnormalities: 201807
	},
	// 全体
	{	message: "{icon}戰鬥秘藥 - 未激活",
		type: "MissingDuringCombat",
		target: "Self",
		abnormalities: [
			4030, 4031, 4040,	// 萬能戰鬥秘藥
			4020, 4021, 4024,	// 高級戰鬥秘藥
			4010, 4011, 4014,	// 中級戰鬥秘藥
			4000, 4001, 4004	// 初級戰鬥秘藥
		],
		rewarn_timeout: 5
	}
]
