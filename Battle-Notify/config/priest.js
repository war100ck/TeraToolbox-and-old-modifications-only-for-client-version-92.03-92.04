module.exports = [
	{	message: "{icon}連鎖天罰 - 未激活",
		type: "MissingDuringCombat",
		target: "MyBoss",
		abnormalities: [28020, 28090],
		rewarn_timeout: 4
	},
	{	message: "{icon}神聖閃電 - 未激活",
		type: "MissingDuringCombat",
		target: "Self",
		abnormalities: [801500, 801501, 801502, 801503, 801510, 801550],
		rewarn_timeout: 4
	},
	{	message: "{icon}亞倫祝福 - 未激活",
		type: "MissingDuringCombat",
		target: "Self",
		abnormalities: [28050, 805100, 805101, 805102],
		rewarn_timeout: 4
	}
]
