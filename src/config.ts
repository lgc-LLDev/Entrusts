import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Schema from 'schemastery';
import { dataPath } from './const';

export const configFilePath = join(dataPath, 'config.json');
export const entrustsFilePath = join(dataPath, 'entrusts.json');

export interface EntrustItem {
  /** 物品标准类型名 */
  type: string;
  /** 物品显示名 */
  name: string;
  /** 需求物品数量 */
  amount: number;
}

export type ConfigEntrustItem = Omit<EntrustItem, 'amount'>;

export interface Config {
  /** 任务可以提交的奖励物品标准类型名及显示名称列表 */
  entrustItems: ConfigEntrustItem[];
  /** 任务可以提交的需求物品标准类型名及显示名称列表 */
  rewardItems: ConfigEntrustItem[];
  /** 所有奖励物品的任务表单是否放在一起 */
  allInOne: boolean;
}

export type Entrust<T extends boolean = boolean> = {
  /** 任务名称 */
  name: string;
  /** 任务提交者 xuid */
  submitor: string;
  /** 任务提交时间 `Date.toJson()` */
  submitTime: string;
  /** 任务提交的奖励物品 */
  submitItem: EntrustItem;
  /** 任务需要的物品 */
  requirement: EntrustItem;
  /** 任务是否已完成 */
  completed?: T;
} & (T extends true
  ? {
      completed: true;
      /** 任务完成者 */
      completor: string;
      /** 任务完成时间 `Date.toJson()` */
      completeTime: string;
    }
  : {});

export type EntrustList = Entrust[];

export const configEntrustItemSchema: Schema<ConfigEntrustItem> = Schema.object(
  {
    type: Schema.string().required(),
    name: Schema.string().required(),
  }
);
export const entrustItemSchema: Schema<EntrustItem> = Schema.object({
  type: Schema.string().required(),
  name: Schema.string().required(),
  amount: Schema.number().required(),
});

export const configSchema: Schema<Config> = Schema.object({
  entrustItems: Schema.array(configEntrustItemSchema).default([
    { type: 'minecraft:emerald', name: '绿宝石' },
  ]),
  rewardItems: Schema.array(configEntrustItemSchema).default([
    { type: 'minecraft:diamond', name: '钻石' },
  ]),
  allInOne: Schema.boolean().default(false),
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
  Object.assign(config, readConfig(configFilePath, configSchema));
  Object.assign(entrusts, readConfig(entrustsFilePath, entrustListSchema));
}

export function writeConfig() {
  writeFile(configFilePath, config);
}

export function writeEntrusts() {
  writeFile(entrustsFilePath, entrusts);
}
