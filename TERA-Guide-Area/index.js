const Vec3 = require('tera-vec3');

module.exports = function Tera_Guide_Area(mod) {
	let Enabled            =  true; // 总开关
	// 定义变量
	let hooks              = [],
		whichzone          = null,  // 登陆地区(zone)
		whichmode          = null,  // 副本地图(huntingZoneId)
		whichboss          = null,  // 区域位置(templateId)
		bossGameId         = null,  // BOSS gameId
		boss_HP            = 0,     // BOSS 血量%
		bossLoc            = {},    // BOSS 坐标
		bossAngle          = 0,     // BOSS 角度
		skillid            = 0,     // BOSS 攻击技能编号
		uid1      = 999999999n,     // 龙头UID
		uid2      = 899999999n,     // 花朵UID
		offsetLoc          = {};    // 偏移坐标
	// 控制命令
	mod.command.add(["area"], () => {
		Enabled = !Enabled;
		mod.command.message("TERA Guide(Area) " + (Enabled ? "Включен(ON)" : "Отключен(OFF)"));
	});
	// 切换场景
	mod.game.me.on('change_zone', (zone, quick) => {
		whichzone = zone;
		whichmode = zone % 9000;
		
		if (mod.game.me.inDungeon) {
			if (whichmode < 100) whichmode = whichmode + 400;
			load();
		} else {
			whichmode = null;
			unload();
		}
	});
	
	function load() {
		if (!hooks.length) {
			hook('S_BOSS_GAGE_INFO',        3, sBossGageInfo);
			hook('S_SPAWN_NPC',            11, sSpawnNpc);
			hook('S_SPAWN_PROJECTILE',      5, sSpawnProjectile);
			hook('S_ACTION_STAGE',          9, sActionStage);
		}
	}
	
	function hook() {
		hooks.push(mod.hook(...arguments));
	}
	
	function unload() {
		if (hooks.length) {
			for (let h of hooks) {
				mod.unhook(h);
			}
			hooks = [];
		}
		reset();
	}
	
	function reset() {
		// 清除所有定时器
		mod.clearAllTimeouts();
		// 清除BOSS信息
		whichboss          = null;
		bossGameId         = null;
	}
	
	function sBossGageInfo(event) {
		if (!whichboss || whichboss != event.templateId) whichboss = event.templateId;
		if (!bossGameId || bossGameId != event.id) bossGameId = event.id;
		
		boss_HP = (Number(event.curHp) / Number(event.maxHp));
		if (boss_HP <= 0 || boss_HP == 1) reset();
	}
	
	function sSpawnNpc(event) {
		if (!Enabled || !whichmode) return;
		// 移除 恶灵岛上级                             1号门   2号门   3号门
		if ([459, 759].includes(event.huntingZoneId) && [2003, 200,210, 211].includes(event.templateId)) return false;
		/* 
		const boxTempIds = [
			//      1      2      3      4      5      6
			      75953, 75955, 75957, 75959, 75961, 75963,
			75941,                                         75942, // 1
			75943,                                         75944, // 2
			75945,                                         75946, // 3
			75947,                                         75948, // 4
			75949,                                         75950, // 5
			75951,                                         75952, // 6
			      75954, 75956, 75958, 75960, 75962, 75964
			-------------------------- 入口 --------------------------
		];
		 */
		
	}
	
	function sSpawnProjectile(event) {
		if (!Enabled || !whichmode) return;
		// 恶灵岛上级 尾王飞弹位置
		if ([459, 759].includes(whichmode) && event.templateId==1003 && event.skill.id==3107) {
			SpawnPoint(event.dest, event.w, 4000, 1, 0, 0);
		}
	}
	
	function sActionStage(event) {
		// 模块关闭 或 不在副本中
		if (!Enabled || !whichmode) return;
		
		// 金鳞船 - 海浪老兵(弓箭) 陷阱炸弹
		if (whichmode==3020 && event.templateId==1700 && event.skill.id==1105) {
			SpawnPoint(event.loc, event.w, 5000, 1, 0, 0);
		}
		
		if (whichboss!=event.templateId) return;
		
		bossLoc   = event.loc;             // BOSS的 x y z 坐标
		bossAngle = event.w;               // BOSS的角度
		skillid   = event.skill.id % 1000; // 愤怒简化 取1000余数运算
		
		// DW_1王
		
		// DW_2王 303360
		if (whichmode==466 && event.templateId==46602) {
			if (event.stage!=0) return;
			if ([311, 312, 313, 314].includes(skillid)) { // 举球 内外圈
				SpawnThing(bossLoc, bossAngle, 4000, 3,   0,   0,   0,  360,  10, 330);
			}
		}
		// FI_1王 303120
		if ([459, 759].includes(whichmode) && [1001, 1004].includes(event.templateId)) {
			if (event.stage!=0) return;
			if (event.skill.id==3107) { // 重击
				SpawnThing(bossLoc, bossAngle, 2000, 2,  90, 100,   0, 1000, 170);
				SpawnThing(bossLoc, bossAngle, 2000, 2, 270, 100,   0, 1000, 190);
			}
			if (event.skill.id==1106||event.skill.id==2106) { // 旋转攻击
				SpawnThing(bossLoc, bossAngle, 3000, 3,   0,   0,   0,  360,  10, 330);
			}
		}
		// FI_2王 303150
		
		// FI_3王 303140
		
		// RM_1王 300860
		if ([770, 970].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0) return;
			if (skillid==107) { // 前喷
				SpawnThing(bossLoc, bossAngle, 3000, 2,   0,   0,   0,  500, 130);
				SpawnThing(bossLoc, bossAngle, 3000, 2,   0,   0,   0,  500, 230);
			}
		}
		// RM_2王 300870
		if ([770, 970].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0) return;
			if (skillid==111) { // 直线攻击
				SpawnThing(bossLoc, bossAngle, 2000, 2,  90,  80,   0,  500, 180);
				SpawnThing(bossLoc, bossAngle, 2000, 2, 270,  80,   0,  500, 180);
			}
			if (skillid==106) { //插地眩晕
				SpawnThing(bossLoc, bossAngle, 2000, 3, 180,  50,   0,  360,  18, 180);
			}
		}
		// RM_3王 303260
		if ([770, 970].includes(whichmode) && event.templateId==3000) {
			if (event.stage!=0) return;
			if (skillid==106) { // 前推坦
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,  50,   0,  530, 145);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,  50,   0,  530, 250);
				SpawnThing(bossLoc, bossAngle, 2000, 3,   0,  50, 145,  250,   8, 530);
			}
			if (skillid==110) { // 尾巴横扫
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  620, 158);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  620, 202);
				SpawnThing(bossLoc, bossAngle, 2000, 3,   0,   0, 202,  158,   4, 620);
			}
			if (skillid==113 && skillid==116) { // 鉴定 内外圈
				SpawnThing(bossLoc, bossAngle, 3000, 3,   0,   0,   0,  360,  10, 290);
			}
			if (skillid==322) { // 命运圈
				SpawnThing(bossLoc, bossAngle, 6000, 3,   0,   0,   0,  360,  12, 230);
				SpawnThing(bossLoc, bossAngle, 6000, 3,   0,   0,   0,  360,   8, 420);
				SpawnThing(bossLoc, bossAngle, 6000, 3,   0,   0,   0,  360,   4, 620);
			}
		}
		// VS_1王 303340
		if ([781, 981].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0) return;
			if (skillid==401) { // 右刀
				SpawnThing(bossLoc, bossAngle, 1500, 2,   0,   0,   0,  500, 180);
				SpawnThing(bossLoc, bossAngle, 1500, 2,   0,   0,   0,  500,   0);
				SpawnPoint(bossLoc, bossAngle, 1500, 1, 270, 250);
			}
			if (skillid==402) { // 左刀
				SpawnThing(bossLoc, bossAngle, 1500, 2,   0,   0,   0,  500, 180);
				SpawnThing(bossLoc, bossAngle, 1500, 2,   0,   0,   0,  500,   0);
				SpawnPoint(bossLoc, bossAngle, 1500, 1,  90, 250);
			}
			if (skillid==304) { // 内外圈
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,  10, 300);
			}
		}
		// VS_2王 303350
		if ([781, 981].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0) return;
			if (skillid==131) { // 右刀
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  500, 175);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  500,   5);
				SpawnPoint(bossLoc, bossAngle, 2000, 1, 270, 250);
			}
			if (skillid==130) { // 左刀
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  500, 180);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  500,   0);
				SpawnPoint(bossLoc, bossAngle, 2000, 1,  90, 250);
			}
		}
		// VS_3王 303330
		if ([781, 981].includes(whichmode) && event.templateId==3000) {
			if (event.stage!=0) return;
			if (skillid==116 && whichmode==781) { // 下级 前盾砸 132
				SpawnThing(bossLoc, bossAngle, 5000, 2, 180,  50,   0,  500, 115);
				SpawnThing(bossLoc, bossAngle, 5000, 2, 180,  50,   0,  500, 245);
			} 
			if (skillid==116 && whichmode==981) { // 上级 甜甜圈 140
				SpawnThing(bossLoc, bossAngle, 8000, 3, 180,  35,   0,  360,  18, 200);
				SpawnThing(bossLoc, bossAngle, 8000, 3, 180,  35,   0,  360,  10, 360);
				SpawnThing(bossLoc, bossAngle, 8000, 3, 180,  35,   0,  360,   8, 520);
			}
			if (skillid==138) { // 滚开 内外圈 601 602
				SpawnThing(bossLoc, bossAngle, 5000, 3, 180,  35,   0,  360,  10, 300);
			}
		}
		// RK_1王 303400
		if ([735, 935].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0) return;
			if (skillid==315||skillid==319) { // 披萨_1 前右
				mod.setTimeout(() => {
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800, 180);
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800, 135);
				}, 1000);
			}
			if (skillid==311||skillid==323) { // 披萨_2 右上
				mod.setTimeout(() => {
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800, 135);
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800,  90);
				}, 1000);
			}
			
			if (skillid==312||skillid==324) { // 披萨_3 右下
				mod.setTimeout(() => {
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800,  90);
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800,  45);
				}, 1000);
			}
			
			if (skillid==316||skillid==320) { // 披萨_4 后右
				mod.setTimeout(() => {
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800,  45);
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800,   0);
				}, 1000);
			}
			
			if (skillid==313||skillid==321) { // 披萨_5 后左
				mod.setTimeout(() => {
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800,   0);
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800, 315);
				}, 1000);
			}
			
			if (skillid==317||skillid==325) { // 披萨_6 左下
				mod.setTimeout(() => {
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800, 315);
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800, 270);
				}, 1000);
			}
			
			if (skillid==318||skillid==322) { // 披萨_7 左上
				mod.setTimeout(() => {
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800, 270);
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800, 225);
				}, 1000);
			}
			
			if (skillid==314||skillid==326) { // 披萨_8 前左
				mod.setTimeout(() => {
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800, 225);
				SpawnThing(bossLoc, bossAngle,14000, 2,   0,   0,   0,  800, 180);
				}, 1000);
			}
		}
		// RK_2王 303420
		if ([735, 935].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0) return;
			if (skillid==108) { // 后喷
				SpawnThing(bossLoc, bossAngle, 3000, 2,   0,   0,   0,  380,  60);
				SpawnThing(bossLoc, bossAngle, 3000, 2,   0,   0,   0,  380, 300);
				SpawnThing(bossLoc, bossAngle, 3000, 3,   0,   0, 300,   60,  10, 380);
			}
			if (skillid==105) { // 旋转
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,  10, 278);
			}
			if (skillid==305) { // 吸附
				SpawnThing(bossLoc, bossAngle, 3000, 3,   0,   0,   0,  360,  18, 200);
			}
			if (skillid==304) { // 爆炸
				SpawnThing(bossLoc, bossAngle, 4000, 3,   0,   0,   0,  360,   8, 400);
			}
		}
		// RK_3王 303410
		if ([735, 935].includes(whichmode) && event.templateId==3000) {
			if (event.stage!=0) return;
			if (skillid==128) { // 火箭拳 后喷 131
				mod.setTimeout(() => {
				SpawnThing(bossLoc, bossAngle, 3000, 2,   0,  40,   0, 1200,  60);
				SpawnThing(bossLoc, bossAngle, 3000, 2,   0,  40,   0, 1200, 300);
				}, 2000);
			}
			if (skillid==323||skillid==324||skillid==305) { // 雷达 / 鉴定
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,  10, 300);
			}
		}
		// RR_1王 303450
		
		// RR_2王 303460
		
		// RR_3王 303490
		
		// AA_1王 303470
		
		// AA_2王 303480
		
		// AA_3王 303440
		if ([720, 920, 3017].includes(whichmode) && event.templateId==3000) {
			if (event.stage!=0) return;
			if (skillid==109) { // 右刀
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  500, 180);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  500,   0);
				SpawnPoint(bossLoc, bossAngle, 2000, 1, 270, 250);
			}
			if (skillid==111) { // 左刀
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  500, 180);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  500,   0);
				SpawnPoint(bossLoc, bossAngle, 2000, 1,  90, 250);
			}
		}
		// DRC_1王 304070
		if ([783, 983, 3018].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0) return;
			if (skillid==108) { // 后跳(眩晕)
				SpawnThing(bossLoc, bossAngle, 2000, 3,   0,  70,   0,  360,   8, 470);
			}
			if (skillid==119) { // 蓄力捶地
				SpawnThing(bossLoc, bossAngle, 2000, 3,   0,  90,   0,  360,   8, 420);
			}
		}
		// DRC_2王 304080
		if ([783, 983, 3018].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0) return;
			if (skillid==105) { // 点名(击飞)
				SpawnThing(bossLoc, bossAngle, 3000, 2,   0,   0,   0,  600, 180);
			}
			if (skillid==318) { // 上级 属性攻击 - 草地圈范围
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,   4, 680);
			}
		}
		// DRC_3王 303540
		if ([783, 983, 3018].includes(whichmode) && event.templateId==3000) {
			if (event.stage!=0) return;
			if (skillid==303) { // S攻击 右
				SpawnThing(bossLoc, bossAngle, 5000, 2,   0,   0,   0,  400,  90);
				SpawnThing(bossLoc, bossAngle, 5000, 2,   0,   0,   0,  400, 270);
				SpawnPoint(bossLoc, bossAngle, 2000, 1,  80, 250);
				SpawnPoint(bossLoc, bossAngle, 2000, 1, 260, 250);
			}
			if (skillid==306) { // S攻击 左
				SpawnThing(bossLoc, bossAngle, 5000, 2,   0,   0,   0,  400,  90);
				SpawnThing(bossLoc, bossAngle, 5000, 2,   0,   0,   0,  400, 270);
				SpawnPoint(bossLoc, bossAngle, 2000, 1, 100, 250);
				SpawnPoint(bossLoc, bossAngle, 2000, 1, 280, 250);
			}
		}
		// GLS_1王 304050
		if ([782, 982, 3019].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0) return;
			if (skillid==107) { // 后喷
				SpawnThing(bossLoc, bossAngle, 3000, 2,   0,   0,   0,  500,  45);
				SpawnThing(bossLoc, bossAngle, 3000, 2,   0,   0,   0,  500, 315);
			}
		}
		// GLS_2王 304060
		if ([782, 982, 3019].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0) return;
			if (skillid==116) { // 前砸后砸 横向对称轴
				SpawnThing(bossLoc, bossAngle, 5000, 2,   0,   0,   0,  500,  90);
				SpawnThing(bossLoc, bossAngle, 5000, 2,   0,   0,   0,  500, 270);
			}
			if (skillid==114) { // 三连拍
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,  10, 250);
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,   4, 620);
			}
			if (skillid==301) { // 捶地+旋转
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,  10, 260);
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,   4, 580);
			}
			if (skillid==302) { // 旋转+捶地
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,  10, 260);
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,   4, 680);
			}
		}
		// GLS_3王 303550
		if ([782, 982, 3019].includes(whichmode) && event.templateId==3000) {
			if ([146, 154].includes(skillid)) {// 右扩散电圈标记
				SpawnPoint(bossLoc, bossAngle, 4000, 1, 325, 370);
			}
			if ([148, 155].includes(skillid)) {// 左扩散电圈标记
				SpawnPoint(bossLoc, bossAngle, 4000, 1,  25, 388);
			}
			if ([139, 150].includes(skillid)) { // 飞天半屏右攻击
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  300, 180);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  500,   0);
				SpawnPoint(bossLoc, bossAngle, 2000, 1, 270, 250);
			}
			if ([141, 152].includes(skillid)) { // 飞天半屏左攻击
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  300, 180);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  500,   0);
				SpawnPoint(bossLoc, bossAngle, 2000, 1,  90, 250);
			}
		}
		// GV_1王 303890
		if ([3101, 3201].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0) return;
			// 直线后喷
			if (skillid==127||skillid==107) {
				SpawnThing(bossLoc, bossAngle, 2000, 2,  90, 140,   0,  800,   7);
				SpawnThing(bossLoc, bossAngle, 2000, 2, 270, 140,   0,  800, 353);
			}
			// 扇形后喷
			if (skillid==131||skillid==111) {
				SpawnThing(bossLoc, bossAngle, 2000, 2, 180, 100,   0,  800,  68);
				SpawnThing(bossLoc, bossAngle, 2000, 2, 180, 100,   0,  800, 292);
			}
			// 左右喷射
			/* if (skillid==132||skillid==112) {
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  800, 163);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  800, 192);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  800, 343);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  800,  22);
			} */
			// 前后喷射
			if (skillid==139||skillid==119) {
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  800,  70);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  800, 110);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  800, 250);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  800, 290);
			}
			// 内外圈
			if (skillid==313||skillid==314) {
				SpawnThing(bossLoc, bossAngle, 4000, 3, 180,  88,   0,  360,  10, 300);
			}
			// 右手蓄力
			if (skillid==148) {
				SpawnThing(bossLoc, bossAngle, 4000, 3, 160, 150,   0,  360,  10, 320);
			}
			// 左手蓄力
			if (skillid==149) {
				SpawnThing(bossLoc, bossAngle, 4000, 3, 200, 150,   0,  360,  10, 320);
			}
		}
		// GV_2王 303840
		if ([3101, 3201].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0) return;
			// 前插 后喷
			if (skillid==108) {
				SpawnThing(bossLoc, bossAngle, 4000, 2,  90,  80,   0, 1000,  17);
				SpawnThing(bossLoc, bossAngle, 4000, 2, 270,  80,   0, 1000, 343);
			}
			// 点名 前推
			if (skillid==236) {
				SpawnThing(bossLoc, bossAngle, 4000, 2,  90,  80,   0, 1000, 163);
				SpawnThing(bossLoc, bossAngle, 4000, 2, 270,  80,   0, 1000, 197);
			}
			// 内外圈
			if (skillid==231||skillid==232) {
				SpawnThing(bossLoc, bossAngle, 3000, 3,   0,   0,   0,  360,  10, 300);
			}
		}
		// AQ_1王 303480
		if (whichmode==3023 && event.templateId==1000) {
			if (event.stage!=0) return;
			// 左手拉
			if ([1111,2111, 1113,2113].includes(event.skill.id)) {
				SpawnThing(bossLoc, bossAngle, 2000, 2, 270, 200,   0,  300, 180);
				SpawnThing(bossLoc, bossAngle, 2000, 2, 270, 200,   0,  500,   0);
				SpawnThing(bossLoc, bossAngle, 2000, 2,  90,  20,   0,  300, 180);
				SpawnThing(bossLoc, bossAngle, 2000, 2,  90,  20,   0,  500,   0);
			}
			// 右手拉
			if ([1112,2112, 1114,2114].includes(event.skill.id)) {
				SpawnThing(bossLoc, bossAngle, 2000, 2,  90, 200,   0,  300, 180);
				SpawnThing(bossLoc, bossAngle, 2000, 2,  90, 200,   0,  500,   0);
				SpawnThing(bossLoc, bossAngle, 2000, 2, 270,  20,   0,  300, 180);
				SpawnThing(bossLoc, bossAngle, 2000, 2, 270,  20,   0,  500,   0);
			}
			// 重击
			if (event.skill.id==3107) {
				SpawnThing(bossLoc, bossAngle, 2000, 2,  90,  75,   0, 1000, 172);
				SpawnThing(bossLoc, bossAngle, 2000, 2, 270,  75,   0, 1000, 188);
			}
			// 后扫半圈
			if (event.skill.id==1115||event.skill.id==2115) {
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0, 150,  340, 260);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0, 150,  340,  90);
				SpawnThing(bossLoc, bossAngle, 2000, 3,   0,   0, 260,   90,  20, 150);
				SpawnThing(bossLoc, bossAngle, 2000, 3,   0,   0, 260,   90,  12, 245);
				SpawnThing(bossLoc, bossAngle, 2000, 3,   0,   0, 260,   90,  10, 340);
			}
			
			if (event.skill.id==3115) { // 旋转攻击
				SpawnThing(bossLoc, bossAngle, 3000, 3,   0,   0,   0,  360,  10, 320);
			}
			if (event.skill.id==3116) { // 小圈 | 旋转攻击
				mod.setTimeout(() => {
				SpawnThing(bossLoc, bossAngle, 3000, 3,   0,   0,   0,  360,  10, 320);
				}, 2000);
			}
			// 前插
			if (event.skill.id==1110||event.skill.id==2110) {
				SpawnThing(bossLoc, bossAngle, 3000, 3, 180, 160,   0,  360,  12, 220);
			}
		}
		// AQ_2王 303490
		if (whichmode==3023 && event.templateId==2000) {
			if (event.stage!=0) return;
			// 插地板
			if (skillid==181) {
				SpawnThing(bossLoc, bossAngle, 3000, 2,  90,  75,   0, 1000, 172);
				SpawnThing(bossLoc, bossAngle, 3000, 2, 270,  75,   0, 1000, 188);
			}
			// 后退 | 前搓
			if (skillid==202) {
				SpawnThing(bossLoc, bossAngle, 3000, 2,  90,  90,   0,  500,   0);
				SpawnThing(bossLoc, bossAngle, 3000, 2,  90,  90,   0,  500, 180);
				SpawnThing(bossLoc, bossAngle, 3000, 2, 270,  90,   0,  500,   0);
				SpawnThing(bossLoc, bossAngle, 3000, 2, 270,  90,   0,  500, 180);
			}
		}
		// SI_3王 545040
		if (whichmode==3020 && event.templateId==2200) {
			// 直线骷髅
			if (skillid==129) {
				SpawnThing(bossLoc, bossAngle, 2000, 2,  90,  75,   0,  800, 180);
				SpawnThing(bossLoc, bossAngle, 2000, 2, 270,  75,   0,  800, 180);
			}
			// 蓄力(晕坦)
			if (skillid==108) {
				SpawnThing(bossLoc, bossAngle, 2000, 3, 180, 170,   0,  360,  20, 120);
			}
			// 后擒 -> 扩散4圈
			if (skillid==133 && event.stage==1) {
				bossLoc = event.dest;
				bossAngle = event.w;
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,  10, 300);
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,   4, 600);
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,   4, 900);
			}
			// 三连击 开始技能
			/* if (skillid==121) {			// 124 前砸 -> 125 转圈
				SpawnThing(bossLoc, bossAngle, 3000, 3, 180, 170,   0,  360,  10, 290);
				mod.setTimeout(() => {
				SpawnThing(bossLoc, bossAngle, 2000, 3,   0,   0,   0,  360,  10, 280);
				SpawnThing(bossLoc, bossAngle, 2000, 3,   0,   0,   0,  360,   4, 560);
				}, 3000);
			}
			if (skillid==122) {			// 125 转圈  -> 124 前砸
				SpawnThing(bossLoc, bossAngle, 2000, 3,   0,   0,   0,  360,  10, 280);
				SpawnThing(bossLoc, bossAngle, 3000, 3,   0,   0,   0,  360,   4, 560);
				mod.setTimeout(() => {
				SpawnThing(bossLoc, bossAngle, 3000, 3, 180, 170,   0,  360,  10, 290);
				}, 3000);
			} */
		}
		// 凯尔 304260
		if ([3026, 3126].includes(whichmode) && [1000, 1001, 1002].includes(event.templateId)) {
			if (event.stage!=0) return;
			if ([103, 153].includes(skillid)) { // 尾巴(击飞!!)
				SpawnThing(bossLoc, bossAngle, 1500, 2,   0,   0,   0,  500,  40);
				SpawnThing(bossLoc, bossAngle, 1500, 2,   0,   0,   0,  500, 280);
				SpawnThing(bossLoc, bossAngle, 1500, 3,   0,   0, 280,   40,   8, 500);
			}
			if ([108, 158].includes(skillid)) { // 右转(击退!!)
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  440, 130);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  440,  40);
				SpawnThing(bossLoc, bossAngle, 2000, 3,   0,   0, 130,   40,   8, 440);
			}
			if ([109, 159].includes(skillid)) { // 左转(击退!!)
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  440, 230);
				SpawnThing(bossLoc, bossAngle, 2000, 2,   0,   0,   0,  440, 320);
				SpawnThing(bossLoc, bossAngle, 2000, 3,   0,   0, 320,  230,   8, 440);
			}
			if ([212, 213, 214, 215].includes(skillid)) { // 内外鉴定
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,   8, 440);
			}
			if (skillid==154) { // 寒气_小
				SpawnThing(bossLoc, bossAngle, 5000, 3, 180,  80,   0,  360,   8, 520);
			}
			/* if (skillid==155) { // 八方陨石_小
				SpawnThing(bossLoc, bossAngle, 3000, 3, 135, 500,   0,  360,  20, 110);
				SpawnThing(bossLoc, bossAngle, 3250, 3, 315, 500,   0,  360,  20, 110);
				SpawnThing(bossLoc, bossAngle, 3500, 3,  45, 500,   0,  360,  20, 110);
				SpawnThing(bossLoc, bossAngle, 3750, 3, 235, 500,   0,  360,  20, 110);
				SpawnThing(bossLoc, bossAngle, 4000, 3,  90, 500,   0,  360,  20, 110);
				SpawnThing(bossLoc, bossAngle, 4250, 3, 270, 500,   0,  360,  20, 110);
				SpawnThing(bossLoc, bossAngle, 4500, 3,   0, 500,   0,  360,  20, 110);
				SpawnThing(bossLoc, bossAngle, 4750, 3, 180, 500,   0,  360,  20, 110);
				
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,  10, 350);
			}
			if (skillid==105) { // 八方陨石_大
				SpawnThing(bossLoc, bossAngle, 3000, 3, 135, 500,   0,  360,  10, 270);
				SpawnThing(bossLoc, bossAngle, 3250, 3, 315, 500,   0,  360,  10, 270);
				SpawnThing(bossLoc, bossAngle, 3500, 3,  45, 500,   0,  360,  10, 270);
				SpawnThing(bossLoc, bossAngle, 3750, 3, 232, 500,   0,  360,  10, 270);
				SpawnThing(bossLoc, bossAngle, 4000, 3,  90, 500,   0,  360,  10, 270);
				SpawnThing(bossLoc, bossAngle, 4250, 3, 270, 500,   0,  360,  10, 270);
				SpawnThing(bossLoc, bossAngle, 4500, 3,   0, 500,   0,  360,  10, 270);
				SpawnThing(bossLoc, bossAngle, 4750, 3, 180, 500,   0,  360,  10, 270);
			} */
		}
		// 狂气 545050
		if (whichmode==3027 && event.templateId==1000) {
			if (event.stage!=0) return;
			if ([116, 140].includes(skillid)) { // 斩击
				SpawnThing(bossLoc, bossAngle, 3000, 3, 180, 180,   0,  360,   8, 460);
			}
			if (skillid==302) { // 甜甜圈
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,  12, 240);
				SpawnThing(bossLoc, bossAngle, 5000, 3,   0,   0,   0,  360,   8, 480);
			}
		}
	}
	
	/* location         1.参照坐标
	   angle            2.参照角度
	   duration         3.持续时间
	   type             4.类型
	   offsetAngle      5.偏移角度
	   offsetDistance   6.偏移距离
	   min              7.最小距离(圆形度数)
	   max              8.最大距离(圆形度数)
	   rotateAngle      9.旋转角度(圆形间隔)
	   rotateRadius     0.直线忽略(圆形半径) */
	
	function SpawnThing(location, angle, duration, type, offsetAngle, offsetDistance, minRadius, maxRadius, rotateAngle, rotateRadius) {
		// 偏移坐标(OffsetLocation)
		if (type!=1 && offsetDistance!=0) {
			SpawnPoint(location, angle, 100, 0, offsetAngle, offsetDistance);
			location = offsetLoc;
		} else {
			location = bossLoc;
		}
		
		if (type==1) { // 构建标记(SpawnPoint)
			SpawnPoint(location, angle, duration, type, offsetAngle, offsetDistance);
		}
		if (type==2) { // 构建直线(SpawnString)
			for (var interval=50; interval<=maxRadius; interval+=50) {
				if (interval<minRadius) continue;
				SpawnPoint(location, angle, duration, type, rotateAngle, interval);
			}
		}
		if (type==3) { // 构建圆弧(SpawnCircle)
			for (var interval=0; interval<360; interval+=rotateAngle) {
				if (minRadius<maxRadius) {
					if (interval<minRadius || interval>maxRadius) continue;
				} else {
					if (interval<minRadius && interval>maxRadius) continue;
				}
				SpawnPoint(location, angle, duration, type, interval, rotateRadius);
			}
		}
	}
	
	function SpawnPoint(location, angle, duration, type, offsetAngle, offsetDistance) {
		var r = null, rads = null, finalrad = null, spawnx = null, spawny = null;
		r = angle - Math.PI;
		rads = (offsetAngle * Math.PI/180);
		finalrad = r - rads;
		spawnx = location.x + offsetDistance * Math.cos(finalrad);
		spawny = location.y + offsetDistance * Math.sin(finalrad);
		
		offsetLoc = new Vec3(spawnx, spawny, location.z);
		
		if (type == 1) {
			SpawnD(uid1, offsetLoc);
			setTimeout(DespawnD, duration, uid1);
			uid1--;
		} else {
			SpawnC(uid2, offsetLoc, r);
			setTimeout(DespawnC, duration, uid2);
			uid2--;
		}
	}
	
	function SpawnD(uid1, loc) {
		mod.send('S_SPAWN_DROPITEM', 8, {
			gameId: uid1,
			loc: loc,
			item: 98260,
			amount: 1,
			expiry: 600000,
			owners: [{}]
		});
	}
	
	function DespawnD(uid1) {
		mod.send('S_DESPAWN_DROPITEM', 4, {
			gameId: uid1
		});
	}
	
	function SpawnC(uid2, loc, w) {
		mod.send('S_SPAWN_COLLECTION', 4, {
			gameId : uid2,
			id : 413,
			amount : 1,
			loc : loc,
			w : w
		});
	}
	
	function DespawnC(uid2) {
		mod.send('S_DESPAWN_COLLECTION', 2, {
			gameId : uid2
		});
	}
	
}
