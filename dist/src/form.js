"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entrustMenu = exports.entrustList = exports.myEntrusts = exports.getAllAwards = exports.uploadEntrust = exports.entrustDetail = exports.isCompleted = exports.getAward = exports.submitEntrust = void 0;
const form_api_ex_1 = require("form-api-ex");
const config_1 = require("./config");
const util_1 = require("./util");
const entrustFormatter = (m) => {
    const { name, requirement, completed } = m;
    return [
        `§b${name}\n` +
            `${completed ? '§a已完成 §7| ' : ''}` +
            `§g需求 ${requirement.name} x${requirement.amount}`,
    ];
};
const entrustSearcher = (btns, params) => {
    const searchParams = params.trim().split(/\s/g);
    return btns.filter(({ name, submitItem }) => {
        for (const p of searchParams)
            if (name.includes(p) ||
                submitItem.type.includes(p) ||
                submitItem.name.includes(p))
                return true;
        return false;
    });
};
async function submitEntrust(player, mission) {
    const inv = player.getInventory();
    const { requirement, submitItem, submitor } = mission;
    const has = (0, util_1.countContainerItem)(inv, requirement.type) >= requirement.amount;
    if (!has) {
        await (0, form_api_ex_1.sendModalFormAsync)(player, '提示', '你背包的对应物品还不够呢……', '§a知道了', '§a知道了');
        return false;
    }
    const { xuid, realName } = player;
    const completed = mission;
    completed.completed = true;
    completed.completor = xuid;
    completed.completeTime = new Date().toJSON();
    (0, config_1.writeEntrusts)();
    (0, util_1.removeContainerItem)(inv, requirement.type, requirement.amount);
    player.giveItem(mc.newItem(submitItem.type, 1), submitItem.amount);
    player.tell('§a成功提交委托~');
    const notifyPl = mc.getPlayer(submitor);
    if (notifyPl)
        notifyPl.tell(`§a你发布的委托被 §g${realName} §a完成啦，快来看看吧~`);
    return true;
}
exports.submitEntrust = submitEntrust;
async function getAward(player, mission) {
    config_1.entrusts.splice(config_1.entrusts.indexOf(mission), 1);
    (0, config_1.writeEntrusts)();
    const { requirement } = mission;
    player.giveItem(mc.newItem(requirement.type, 1), requirement.amount);
    player.tell('§a成功收取奖励~');
    return true;
}
exports.getAward = getAward;
function isCompleted(m) {
    return m.completed === true;
}
exports.isCompleted = isCompleted;
async function entrustDetail(player, mission) {
    const { name, submitor, submitTime, submitItem, requirement, completed } = mission;
    const detail = `${isCompleted(mission)
        ? `§a完成者§r: §b${data.xuid2name(mission.completor)}\n` +
            `§a完成时间§r: §b${(0, util_1.formatDate)({
                date: new Date(mission.completeTime),
            })}\n` +
            `§r================\n`
        : ''}` +
        `§a委托名称§r: §b${name}\n` +
        `§a委托人§r: §b${data.xuid2name(submitor)}\n` +
        `§a委托时间§r: §b${(0, util_1.formatDate)({ date: new Date(submitTime) })}\n` +
        `§a需求物品§r: §b${requirement.name} (${requirement.type}) x${requirement.amount}\n` +
        `§a奖励物品§r: §b${submitItem.name} (${submitItem.type}) x${submitItem.amount}`;
    const form = new form_api_ex_1.SimpleFormEx();
    form.title = '委托详情';
    form.content = detail;
    form.formatter = ([t]) => [t];
    if (player.xuid !== submitor)
        form.buttons.push([`§3接取委托`, submitEntrust]);
    if (player.xuid === submitor && completed)
        form.buttons.push([`§3收取奖励`, getAward]);
    form.buttons.push(['§3返回列表', async () => false]);
    const res = await form.sendAsync(player);
    if (!res)
        return false;
    const ret = await res[1](player, mission);
    return ret;
}
exports.entrustDetail = entrustDetail;
async function uploadEntrust(player, item) {
    const form = new form_api_ex_1.CustomFormEx('发布委托')
        .addInput('name', '请输入委托名称', {
        default: `玩家 ${player.realName} 发布的委托`,
    })
        .addDropdown('missionItem', '请选择想要§a提交§r的物品', config_1.config.entrustItems.map((v) => `${v.name} (${v.type})`), item ? config_1.config.entrustItems.findIndex((v) => v.type === item) : 0)
        .addInput('missionAmount', '请输入想要§a提交§r的物品数量', { default: '1' })
        .addDropdown('rewardItem', '请选择想要§g委托§r的物品', config_1.config.rewardItems.map((v) => `${v.name} (${v.type})`))
        .addInput('rewardAmount', '请输入想要§g委托§r的物品数量', { default: '1' });
    const res = await form.sendAsync(player);
    if (!res)
        return false;
    const { name, missionItem, missionAmount, rewardItem, rewardAmount } = res;
    const submitNum = Number(missionAmount);
    const rewardNum = Number(rewardAmount);
    if (!submitNum || !rewardNum || submitNum <= 0 || rewardNum <= 0) {
        await (0, form_api_ex_1.sendModalFormAsync)(player, '提示', '§c物品数量填写不合法！请返回修改', '§a好的', '§a好的');
        return uploadEntrust(player, item);
    }
    const submitItem = {
        ...config_1.config.entrustItems[missionItem],
        amount: submitNum,
    };
    const submitType = submitItem.type;
    const inv = player.getInventory();
    if ((0, util_1.countContainerItem)(inv, submitType) < submitNum) {
        await (0, form_api_ex_1.sendModalFormAsync)(player, '提示', '你背包的对应物品还不够呢……', '§a知道了', '§a知道了');
        return false;
    }
    const requirement = {
        ...config_1.config.rewardItems[rewardItem],
        amount: rewardNum,
    };
    config_1.entrusts.unshift({
        name,
        submitor: player.xuid,
        submitTime: new Date().toJSON(),
        submitItem,
        requirement,
    });
    (0, config_1.writeEntrusts)();
    (0, util_1.removeContainerItem)(inv, submitType, submitNum);
    player.refreshItems();
    player.tell('§a发布委托成功！');
    return true;
}
exports.uploadEntrust = uploadEntrust;
async function getAllAwards(player) {
    const { xuid } = player;
    const willDo = config_1.entrusts.filter((v) => v.submitor === xuid && v.completed);
    for (const m of willDo)
        getAward(player, m);
    player.tell(`§a成功获取 §g${willDo.length} §a个委托奖励~`);
    return true;
}
exports.getAllAwards = getAllAwards;
async function myEntrusts(player) {
    const { xuid } = player;
    const willDisplay = config_1.entrusts.filter((v) => v.submitor === xuid);
    if (!willDisplay.length) {
        await (0, form_api_ex_1.sendModalFormAsync)(player, '提示', '§b你还没有发布过委托哦，快去发布一个吧！', '§a知道了', '§a知道了');
        return false;
    }
    const form = new form_api_ex_1.SimpleFormEx(willDisplay);
    form.title = '我的委托';
    form.canJumpPage = true;
    form.canTurnPage = true;
    form.hasSearchButton = true;
    form.formatter = entrustFormatter;
    form.searcher = entrustSearcher;
    const res = await form.sendAsync(player);
    if (!res)
        return false;
    const ret = await entrustDetail(player, res);
    if (!ret)
        return myEntrusts(player);
    return true;
}
exports.myEntrusts = myEntrusts;
async function entrustList(player, item) {
    const willDisplay = config_1.entrusts.filter((v) => !v.completed && (!item || v.submitItem.type === item));
    if (!willDisplay.length) {
        await (0, form_api_ex_1.sendModalFormAsync)(player, '提示', '§b委托列表空空如也哦', '§a知道了', '§a知道了');
        return false;
    }
    const form = new form_api_ex_1.SimpleFormEx(willDisplay);
    form.title = '委托列表';
    form.canJumpPage = true;
    form.canTurnPage = true;
    form.hasSearchButton = true;
    form.formatter = entrustFormatter;
    form.searcher = entrustSearcher;
    const res = await form.sendAsync(player);
    if (!res)
        return false;
    const ret = await entrustDetail(player, res);
    if (!ret)
        return entrustList(player, item);
    return true;
}
exports.entrustList = entrustList;
async function entrustMenu(player, item) {
    const form = new form_api_ex_1.SimpleFormEx([
        [`§3委托列表`, entrustList],
        [`§3发布委托`, uploadEntrust],
        [`§3我的委托`, myEntrusts],
        [`§3一键领取`, getAllAwards],
    ]);
    form.title = '委托菜单';
    form.content = '';
    form.formatter = ([v]) => [v];
    const res = await form.sendAsync(player);
    if (!res)
        return false;
    const ret = await res[1](player, item);
    if (!ret)
        return entrustMenu(player, item);
    return true;
}
exports.entrustMenu = entrustMenu;
