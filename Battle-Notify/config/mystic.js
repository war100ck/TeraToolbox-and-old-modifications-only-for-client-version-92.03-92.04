module.exports = [
	{	message: "{icon}痛苦咒縛 - 未激活",
		type: "MissingDuringCombat",
		target: "MyBoss",
		abnormalities: [27030, 27160, 700800, 700820],
		rewarn_timeout: 4
	},
	//{	message: "{icon}精神結界 - 未激活",
	//	type: "MissingDuringCombat",
	//	target: "Self",
	//	abnormalities: [700330, 700300],
	//	rewarn_timeout: 4
	//},
	{	message: "{icon}憤怒結界 - 未開",
		type: "MissingDuringCombat",
		target: "Self",
		abnormalities: [700600, 700601, 700602, 700603, 700630, 700631],
		rewarn_timeout: 4
	},
	{	message: "{icon}守護精靈 - 抗打",
		type: "MissingDuringCombat",
		target: "Self",
		abnormalities: 27120,
		rewarn_timeout: 4
	},
	{	message: "{icon}元素化 - 未開",
		type: "MissingDuringCombat",
		target: "Self",
		abnormalities: [702000, 702005],
		rewarn_timeout: 4
	}
]
