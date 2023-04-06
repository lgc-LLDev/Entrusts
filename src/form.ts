import { CustomFormEx, SimpleFormEx, sendModalFormAsync } from 'form-api-ex';
import { Entrust, ItemConfig, config, entrusts, writeEntrusts } from './config';
import { countContainerItem, formatDate, removeContainerItem } from './util';

const entrustFormatter = (m: Entrust): [string, string | undefined] => {
  const { name, requirement, completed } = m;
  return [
    `§b${name}\n` +
      `${completed ? '§a已完成 §7| ' : ''}` +
      `§g需求 §6${requirement.name} x${requirement.amount}`,
    requirement.icon,
  ];
};

const entrustSearcher = (btns: Entrust[], params: string) => {
  const searchParams = params.trim().split(/\s/g);
  return btns.filter(({ name, submitItem }) => {
    for (const p of searchParams)
      if (
        name.includes(p) ||
        submitItem.type.includes(p) ||
        submitItem.name.includes(p)
      )
        return true;
    return false;
  });
};

export const itemFormatter = ({
  name,
  type,
  icon,
}: ItemConfig): [string, string | undefined] => [`§b${name}\n§7${type}`, icon];

export const itemSearcher = (items: ItemConfig[], params: string) => {
  const searchParams = params.trim().split(/\s/g);
  return items.filter(({ name, type }) => {
    for (const p of searchParams)
      if (name.includes(p) || type.includes(p)) return true;
    return false;
  });
};

export async function submitEntrust(
  player: Player,
  mission: Entrust
): Promise<boolean> {
  const inv = player.getInventory();
  const { requirement, submitItem, submitor } = mission;

  const has = countContainerItem(inv, requirement.type) >= requirement.amount;
  if (!has) {
    await sendModalFormAsync(
      player,
      '提示',
      '你背包的对应物品还不够呢……',
      '§a知道了',
      '§a知道了'
    );
    return false;
  }

  const { xuid, realName } = player;
  const completed = mission as Entrust<true>;
  completed.completed = true;
  completed.completor = xuid;
  completed.completeTime = new Date().toJSON();
  writeEntrusts();

  removeContainerItem(inv, requirement.type, requirement.amount);
  player.giveItem(mc.newItem(submitItem.type, 1)!, submitItem.amount);
  // player.refreshItems();
  player.tell('§a成功提交委托~');

  // 玩家在线，进行通知
  const notifyPl = mc.getPlayer(submitor);
  if (notifyPl)
    notifyPl.tell(`§a你发布的委托被 §g${realName} §a完成啦，快来看看吧~`);

  return true;
}

export async function getAward(
  player: Player,
  mission: Entrust
): Promise<boolean> {
  entrusts.splice(entrusts.indexOf(mission), 1);
  writeEntrusts();

  const { requirement } = mission;
  player.giveItem(mc.newItem(requirement.type, 1)!, requirement.amount);
  player.tell('§a成功收取奖励~');

  return true;
}

export async function revokeEntrust(
  player: Player,
  mission: Entrust
): Promise<boolean> {
  const ok = await sendModalFormAsync(player, '提示', '§6真的要撤销该委托吗？');
  if (!ok) return false;

  entrusts.splice(entrusts.indexOf(mission), 1);
  writeEntrusts();

  if (player.xuid === mission.submitor) {
    const { type, amount } = mission.submitItem;
    player.giveItem(mc.newItem(type, 1)!, amount);
  }

  player.tell('§a成功撤销该委托');
  return true;
}

export function isCompleted(m: Entrust): m is Entrust<true> {
  return m.completed === true;
}

export async function entrustDetail(
  player: Player,
  mission: Entrust
): Promise<boolean> {
  const completed = isCompleted(mission);
  const { name, submitor, submitTime, submitItem, requirement } = mission;

  const completeDetail = completed
    ? `§a完成者§r: §b${data.xuid2name(mission.completor)}\n` +
      `§a完成时间§r: §b${formatDate({
        date: new Date(mission.completeTime),
      })}\n` +
      `§r================\n`
    : '';
  const detail =
    `${completeDetail}` +
    `§a委托名称§r: §b${name}\n` +
    `§a委托人§r: §b${data.xuid2name(submitor)}\n` +
    `§a委托时间§r: §b${formatDate({ date: new Date(submitTime) })}\n` +
    `§a需求物品§r: §g${requirement.name} (${requirement.type}) x${requirement.amount}\n` +
    `§a奖励物品§r: §a${submitItem.name} (${submitItem.type}) x${submitItem.amount}`;

  const form = new SimpleFormEx<
    [string, (p: Player, m: Entrust) => Promise<boolean>]
  >();
  form.title = '委托详情';
  form.content = detail;
  form.formatter = ([t]) => [t];

  if (player.xuid !== submitor)
    form.buttons.push([`§3接取委托`, submitEntrust]);
  if (player.xuid === submitor && completed)
    form.buttons.push([`§3收取奖励`, getAward]);
  if ((player.xuid === submitor || player.isOP()) && !completed)
    form.buttons.push([`§3撤销委托`, revokeEntrust]);
  form.buttons.push(['§3返回列表', async () => false]);

  const res = await form.sendAsync(player);
  if (!res) return false;

  const ret = await res[1](player, mission);
  return ret;
}

export async function selectItem(
  player: Player,
  items: ItemConfig[]
): Promise<ItemConfig | null> {
  const form = new SimpleFormEx(items);
  form.title = '选择物品';
  form.canJumpPage = true;
  form.canTurnPage = true;
  form.hasSearchButton = true;
  form.formatter = itemFormatter;
  form.searcher = itemSearcher;

  return form.sendAsync(player);
}

export async function uploadEntrust(
  player: Player,
  item?: string
): Promise<boolean> {
  const entrustInfo: Entrust = {
    name: `玩家 ${player.realName} 发布的委托`,
    submitor: player.xuid,
    submitTime: '',
    submitItem: {
      ...config.entrustItems[
        item ? config.entrustItems.findIndex((v) => v.type === item) : 0
      ],
      amount: 1,
    },
    requirement: {
      ...config.rewardItems[0],
      amount: 1,
    },
  };

  const editName = async (): Promise<void> => {
    const form = new CustomFormEx('修改委托名称').addInput(
      'name',
      '请输入委托名称',
      { default: entrustInfo.name }
    );

    const res = await form.sendAsync(player);
    if (res) {
      const name = res.name.trim();

      if (!name) {
        await sendModalFormAsync(
          player,
          '提示',
          '委托名称不能为空！请返回修改',
          '§a好的',
          '§a好的'
        );
        return editName();
      }

      entrustInfo.name = name;
    }

    return undefined;
  };

  const editItem = async (
    willEdit: ItemConfig,
    items: ItemConfig[]
  ): Promise<void> => {
    const res = await selectItem(player, items);
    if (res) Object.assign(willEdit, res);
  };

  const editAmount = async (): Promise<void> => {
    const { submitItem, requirement } = entrustInfo;
    const form = new CustomFormEx('修改数量')
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
        await sendModalFormAsync(
          player,
          '提示',
          '§c物品数量填写不合法！请返回修改',
          '§a好的',
          '§a好的'
        );
        return editAmount();
      }

      if (
        countContainerItem(player.getInventory(), submitItem.type) < submitNum
      ) {
        await sendModalFormAsync(
          player,
          '提示',
          '你背包需要提交的物品数量还不够呢……返回修改下数量吧',
          '§a知道了',
          '§a知道了'
        );
        return editAmount();
      }

      submitItem.amount = submitNum;
      requirement.amount = requireNum;
    }

    return undefined;
  };

  const editRequirement = async () =>
    editItem(entrustInfo.requirement, config.rewardItems);

  const editSubmitItem = async () =>
    editItem(entrustInfo.submitItem, config.entrustItems);

  const upload = async () => {
    entrustInfo.submitTime = new Date().toJSON();
    entrusts.unshift(entrustInfo);
    writeEntrusts();

    const { submitItem } = entrustInfo;
    removeContainerItem(
      player.getInventory(),
      submitItem.type,
      submitItem.amount
    );
    player.refreshItems();

    player.tell('§a发布委托成功！');
  };

  const detailForm = async (): Promise<boolean> => {
    const { name, requirement, submitItem } = entrustInfo;

    const form = new SimpleFormEx<[string, () => Promise<boolean | void>]>([
      ['§a提交委托', async () => true],
      ['§3修改委托名称', editName],
      ['§3修改§2需求物品', editRequirement],
      ['§3修改§5奖励物品', editSubmitItem],
      ['§3修改物品数量', editAmount],
      // ['§2返回', async () => false],
    ]);
    form.title = '发布委托';
    form.content =
      `§a委托名称§r: §b${name}\n` +
      `§a需求物品§r: §a${requirement.name} (${requirement.type}) x${requirement.amount}\n` +
      `§a奖励物品§r: §g${submitItem.name} (${submitItem.type}) x${submitItem.amount}`;
    form.formatter = ([v]) => [v];

    const res = await form.sendAsync(player);
    if (!res) return false;

    const val = await res[1]();
    if (val === false) return false;

    if (val === true) {
      const ok = await sendModalFormAsync(
        player,
        '提示',
        '确认提交委托吗？请确认你的委托内容无误'
      );

      if (ok) {
        await upload();
        return true;
      }
    }

    return detailForm();
  };

  return detailForm();
}

export async function getAllAwards(player: Player): Promise<boolean> {
  const { xuid } = player;
  const willDo = entrusts.filter((v) => v.submitor === xuid && v.completed);

  for (const m of willDo) getAward(player, m);

  player.tell(`§a成功获取 §g${willDo.length} §a个委托奖励~`);

  return true;
}

export async function entrustList(
  player: Player,
  item?: string,
  isMine = false
): Promise<boolean> {
  const willDisplay = entrusts.filter(
    isMine
      ? (v) => v.submitor === player.xuid
      : (v) => !v.completed && (!item || v.submitItem.type === item)
  );

  if (!willDisplay.length) {
    await sendModalFormAsync(
      player,
      '提示',
      isMine
        ? '§b你还没有发布过委托哦，快去发布一个吧！'
        : '§b委托列表空空如也哦',
      '§a知道了',
      '§a知道了'
    );
    return false;
  }

  const form = new SimpleFormEx(willDisplay);
  form.title = isMine ? '我的委托' : '委托列表';
  form.canJumpPage = true;
  form.canTurnPage = true;
  form.hasSearchButton = true;
  form.formatter = entrustFormatter;
  form.searcher = entrustSearcher;

  const res = await form.sendAsync(player);
  if (!res) return false;

  const ret = await entrustDetail(player, res);
  if (!ret) return entrustList(player, item);

  return true;
}

export function myEntrusts(player: Player, item?: string): Promise<boolean> {
  return entrustList(player, item);
}

export async function entrustMenu(
  player: Player,
  item?: string
): Promise<boolean> {
  const form = new SimpleFormEx<
    [string, (p: Player, it?: string) => Promise<boolean>]
  >([
    [`§3委托列表`, entrustList],
    [`§3发布委托`, uploadEntrust],
    [`§3我的委托`, myEntrusts],
    [`§3一键领取`, getAllAwards],
  ]);
  form.title = '委托菜单';
  form.content = '';
  form.formatter = ([v]) => [v];

  const res = await form.sendAsync(player);
  if (!res) return false;

  const ret = await res[1](player, item);
  if (!ret) return entrustMenu(player, item);

  return true;
}
