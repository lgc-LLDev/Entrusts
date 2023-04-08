"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entrustMenu = exports.myEntrusts = exports.entrustList = exports.getAllAwards = exports.uploadEntrust = exports.selectItem = exports.entrustDetail = exports.isCompleted = exports.revokeEntrust = exports.getAward = exports.submitEntrust = exports.itemSearcher = exports.itemFormatter = void 0;
const form_api_ex_1 = require("form-api-ex");
const config_1 = require("./config");
const util_1 = require("./util");
const entrustFormatter = (m) => {
    const { name, requirement, completed } = m;
    return [
        `§b${name}\n` +
            `${completed ? '§a已完成 §7| ' : ''}` +
            `§g需求 §6${requirement.name} x${requirement.amount}`,
        requirement.icon,
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
const itemFormatter = ({ name, type, icon, }) => [`§b${name}\n§7${type}`, icon];
exports.itemFormatter = itemFormatter;
const itemSearcher = (items, params) => {
    const searchParams = params.trim().split(/\s/g);
    return items.filter(({ name, type }) => {
        for (const p of searchParams)
            if (name.includes(p) || type.includes(p))
                return true;
        return false;
    });
};
exports.itemSearcher = itemSearcher;
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
async function revokeEntrust(player, mission) {
    const ok = await (0, form_api_ex_1.sendModalFormAsync)(player, '提示', '§6真的要撤销该委托吗？');
    if (!ok)
        return false;
    config_1.entrusts.splice(config_1.entrusts.indexOf(mission), 1);
    (0, config_1.writeEntrusts)();
    if (player.xuid === mission.submitor) {
        const { type, amount } = mission.submitItem;
        player.giveItem(mc.newItem(type, 1), amount);
    }
    player.tell('§a成功撤销该委托');
    return true;
}
exports.revokeEntrust = revokeEntrust;
function isCompleted(m) {
    return m.completed === true;
}
exports.isCompleted = isCompleted;
async function entrustDetail(player, mission) {
    const completed = isCompleted(mission);
    const { name, submitor, submitTime, submitItem, requirement } = mission;
    const completeDetail = completed
        ? `§a完成者§r: §b${data.xuid2name(mission.completor)}\n` +
            `§a完成时间§r: §b${(0, util_1.formatDate)({
                date: new Date(mission.completeTime),
            })}\n` +
            `§r================\n`
        : '';
    const detail = `${completeDetail}` +
        `§a委托名称§r: §b${name}\n` +
        `§a委托人§r: §b${data.xuid2name(submitor)}\n` +
        `§a委托时间§r: §b${(0, util_1.formatDate)({ date: new Date(submitTime) })}\n` +
        `§a需求物品§r: §g${requirement.name} (${requirement.type}) x${requirement.amount}\n` +
        `§a奖励物品§r: §a${submitItem.name} (${submitItem.type}) x${submitItem.amount}`;
    const form = new form_api_ex_1.SimpleFormEx();
    form.title = '委托详情';
    form.content = detail;
    form.formatter = ([t]) => [t];
    if (player.xuid !== submitor)
        form.buttons.push([`§3接取委托`, submitEntrust]);
    if (player.xuid === submitor && completed)
        form.buttons.push([`§3收取奖励`, getAward]);
    if ((player.xuid === submitor || player.isOP()) && !completed) {
        const revokeWrapped = async () => {
            const ret = await revokeEntrust(player, mission);
            return ret ? true : entrustDetail(player, mission);
        };
        form.buttons.push([`§3撤销委托`, revokeWrapped]);
    }
    form.buttons.push(['§3返回列表', async () => false]);
    const res = await form.sendAsync(player);
    if (!res)
        return false;
    const ret = await res[1](player, mission);
    return ret;
}
exports.entrustDetail = entrustDetail;
async function selectItem(player, items) {
    const form = new form_api_ex_1.SimpleFormEx(items);
    form.title = '选择物品';
    form.canJumpPage = true;
    form.canTurnPage = true;
    form.hasSearchButton = true;
    form.formatter = exports.itemFormatter;
    form.searcher = exports.itemSearcher;
    return form.sendAsync(player);
}
exports.selectItem = selectItem;
async function uploadEntrust(player, items) {
    const entrustInfo = {
        name: `玩家 ${player.realName} 发布的委托`,
        submitor: player.xuid,
        submitTime: '',
        submitItem: {
            ...config_1.config.entrustItems[items && items.length
                ? config_1.config.entrustItems.findIndex((v) => v.type === items[0])
                : 0],
            amount: 1,
        },
        requirement: {
            ...config_1.config.rewardItems[0],
            amount: 1,
        },
    };
    const editName = async () => {
        const form = new form_api_ex_1.CustomFormEx('修改委托名称').addInput('name', '请输入委托名称', { default: entrustInfo.name });
        const res = await form.sendAsync(player);
        if (res) {
            const name = res.name.trim();
            if (!name) {
                await (0, form_api_ex_1.sendModalFormAsync)(player, '提示', '委托名称不能为空！请返回修改', '§a好的', '§a好的');
                return editName();
            }
            entrustInfo.name = name;
        }
        return undefined;
    };
    const editItem = async (willEdit, newItems) => {
        const res = await selectItem(player, newItems);
        if (res)
            Object.assign(willEdit, res);
    };
    const checkAmount = async (item, amount) => {
        if ((0, util_1.countContainerItem)(player.getInventory(), item) < amount) {
            await (0, form_api_ex_1.sendModalFormAsync)(player, '提示', '你背包需要提交的物品数量还不够呢……返回修改下数量吧', '§a知道了', '§a知道了');
            return false;
        }
        return true;
    };
    const editAmount = async () => {
        const { submitItem, requirement } = entrustInfo;
        const form = new form_api_ex_1.CustomFormEx('修改数量')
            .addInput('requireAmount', '请输入期望§a收到§r的§a需求物品§r数量', {
            default: `${requirement.amount}`,
        })
            .addInput('submitAmount', '请输入期望§g给出§r的§g奖励物品§r数量', {
            default: `${submitItem.amount}`,
        });
        const res = await form.sendAsync(player);
        if (res) {
            const { requireAmount, submitAmount } = res;
            const requireNum = Number(requireAmount);
            const submitNum = Number(submitAmount);
            if (!requireNum || !submitNum || requireNum <= 0 || submitNum <= 0) {
                await (0, form_api_ex_1.sendModalFormAsync)(player, '提示', '§c物品数量填写不合法！请返回修改', '§a好的', '§a好的');
                return editAmount();
            }
            if (!(await checkAmount(submitItem.type, submitNum)))
                return editAmount();
            submitItem.amount = submitNum;
            requirement.amount = requireNum;
        }
        return undefined;
    };
    const editRequirement = async () => editItem(entrustInfo.requirement, config_1.config.rewardItems);
    const editSubmitItem = async () => editItem(entrustInfo.submitItem, config_1.config.entrustItems);
    const upload = async () => {
        entrustInfo.submitTime = new Date().toJSON();
        config_1.entrusts.unshift(entrustInfo);
        (0, config_1.writeEntrusts)();
        const { submitItem } = entrustInfo;
        (0, util_1.removeContainerItem)(player.getInventory(), submitItem.type, submitItem.amount);
        player.refreshItems();
        player.tell('§a发布委托成功！');
    };
    const detailForm = async () => {
        const { name, requirement, submitItem } = entrustInfo;
        const form = new form_api_ex_1.SimpleFormEx([
            ['§a提交委托', async () => true],
            ['§3修改委托名称', editName],
            ['§3修改§2需求物品', editRequirement],
            ['§3修改§5奖励物品', editSubmitItem],
            ['§3修改物品数量', editAmount],
        ]);
        form.title = '发布委托';
        form.content =
            `§a委托名称§r: §b${name}\n` +
                `§a需求物品§r: §a${requirement.name} (${requirement.type}) x${requirement.amount}\n` +
                `§a奖励物品§r: §g${submitItem.name} (${submitItem.type}) x${submitItem.amount}`;
        form.formatter = ([v]) => [v];
        const res = await form.sendAsync(player);
        if (!res)
            return false;
        const val = await res[1]();
        if (val === false)
            return false;
        if (val === true &&
            (await checkAmount(submitItem.type, submitItem.amount))) {
            const ok = await (0, form_api_ex_1.sendModalFormAsync)(player, '提示', '确认提交委托吗？请确认你的委托内容无误');
            if (ok) {
                await upload();
                return true;
            }
        }
        return detailForm();
    };
    return detailForm();
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
async function entrustList(player, items, isMine = false) {
    const willDisplay = config_1.entrusts.filter(isMine
        ? (v) => v.submitor === player.xuid
        : (v) => !v.completed && (!items || items.includes(v.submitItem.type)));
    if (!willDisplay.length) {
        await (0, form_api_ex_1.sendModalFormAsync)(player, '提示', isMine
            ? '§b你还没有发布过委托哦，快去发布一个吧！'
            : '§b委托列表空空如也哦', '§a知道了', '§a知道了');
        return false;
    }
    const form = new form_api_ex_1.SimpleFormEx(willDisplay);
    form.title = isMine ? '我的委托' : '委托列表';
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
        return entrustList(player, items);
    return true;
}
exports.entrustList = entrustList;
function myEntrusts(player, items) {
    return entrustList(player, items, true);
}
exports.myEntrusts = myEntrusts;
async function entrustMenu(player, items) {
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
    const ret = await res[1](player, items);
    if (!ret)
        return entrustMenu(player, items);
    return true;
}
exports.entrustMenu = entrustMenu;
