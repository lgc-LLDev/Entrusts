import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Schema from 'schemastery';
import { dataPath } from './const';
import { clearObject } from './util';

export const configFilePath = join(dataPath, 'config.json');
export const entrustsFilePath = join(dataPath, 'entrusts.json');

export interface ItemConfig {
  /** 物品标准类型名 */
  type: string;
  /** 物品显示名 */
  name: string;
  /** 物品显示图片 */
  icon?: string;
}

export interface EntrustItem extends ItemConfig {
  /** 需求物品数量 */
  amount: number;
}

export interface ConfigEntrustItem extends ItemConfig {
  /** 用于打开该物品委托页面的物品标准类型名列表 */
  openItem: string[];
}

export interface Config {
  /** 委托可以提交的 需求物品 列表 */
  entrustItems: ConfigEntrustItem[];
  /** 委托可以提交的 奖励物品 列表 */
  rewardItems: ItemConfig[];
  /** 所有奖励物品的委托表单是否放在一起 */
  allInOne: boolean;
  /** 是否只使用 openItem 打开委托页面 */
  onlyUseOpenItem: boolean;
}

export type Entrust<T extends boolean = boolean> = {
  /** 委托名称 */
  name: string;
  /** 委托提交者 xuid */
  submitor: string;
  /** 委托提交时间 `Date.toJson()` */
  submitTime: string;
  /** 委托提交的 奖励物品 */
  submitItem: EntrustItem;
  /** 委托请求的 需求物品 */
  requirement: EntrustItem;
  /** 委托是否已完成 */
  completed?: T;
} & (T extends true
  ? {
      completed: true;
      /** 委托完成者 */
      completor: string;
      /** 委托完成时间 `Date.toJson()` */
      completeTime: string;
    }
  : {});

export type EntrustList = Entrust[];

export const itemConfigSchema: Schema<ItemConfig> = Schema.object({
  type: Schema.string().required(),
  name: Schema.string().required(),
  icon: Schema.string(),
});
export const configEntrustItemSchema: Schema<ConfigEntrustItem> = Schema.object(
  {
    type: Schema.string().required(),
    name: Schema.string().required(),
    icon: Schema.string(),
    openItem: Schema.array(Schema.string()).default([]),
  }
);
export const entrustItemSchema: Schema<EntrustItem> = Schema.object({
  type: Schema.string().required(),
  name: Schema.string().required(),
  icon: Schema.string(),
  amount: Schema.number().required(),
});

export const configSchema: Schema<Config> = Schema.object({
  entrustItems: Schema.array(configEntrustItemSchema).default([
    {
      type: 'minecraft:emerald',
      name: '绿宝石',
      icon: 'textures/items/emerald',
      openItem: [],
    },
  ]),
  rewardItems: Schema.array(itemConfigSchema).default([
    { type: 'minecraft:diamond', icon: 'textures/items/diamond', name: '钻石' },
  ]),
  allInOne: Schema.boolean().default(false),
  onlyUseOpenItem: Schema.boolean().default(false),
});

export const entrustSchema: Schema<Entrust> = Schema.object({
  name: Schema.string().required(),
  submitor: Schema.string().required(),
  submitTime: Schema.string().required(),
  submitItem: entrustItemSchema.required(),
  requirement: entrustItemSchema.required(),
  completed: Schema.boolean().default(false),
  completor: Schema.string(),
  completeTime: Schema.string(),
});

export const entrustListSchema: Schema<EntrustList> = Schema.array(
  entrustSchema
).default([]);

export function writeFile<T>(path: string, obj: T) {
  writeFileSync(path, JSON.stringify(obj, null, 2), { encoding: 'utf-8' });
}

export function readConfig<T>(path: string, validator: (v: any) => T): T {
  const content = existsSync(path)
    ? JSON.parse(readFileSync(path, { encoding: 'utf-8' }))
    : null;
  const validated = validator(content);
  writeFile(path, validated);
  return validated;
}

export const config: Config = readConfig(configFilePath, configSchema);
export const entrusts: EntrustList = readConfig(
  entrustsFilePath,
  entrustListSchema
);

export function reloadConfig() {
  clearObject(config);
  Object.assign(config, readConfig(configFilePath, configSchema));

  clearObject(entrusts);
  Object.assign(entrusts, readConfig(entrustsFilePath, entrustListSchema));
}

export function writeConfig() {
  writeFile(configFilePath, config);
}

export function writeEntrusts() {
  writeFile(entrustsFilePath, entrusts);
}
