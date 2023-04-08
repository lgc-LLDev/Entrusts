"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeEntrusts = exports.writeConfig = exports.reloadConfig = exports.entrusts = exports.config = exports.readConfig = exports.writeFile = exports.entrustListSchema = exports.entrustSchema = exports.configSchema = exports.entrustItemSchema = exports.itemConfigSchema = exports.entrustsFilePath = exports.configFilePath = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const schemastery_1 = __importDefault(require("schemastery"));
const const_1 = require("./const");
const util_1 = require("./util");
exports.configFilePath = (0, path_1.join)(const_1.dataPath, 'config.json');
exports.entrustsFilePath = (0, path_1.join)(const_1.dataPath, 'entrusts.json');
exports.itemConfigSchema = schemastery_1.default.object({
    type: schemastery_1.default.string().required(),
    name: schemastery_1.default.string().required(),
    icon: schemastery_1.default.string(),
});
exports.entrustItemSchema = schemastery_1.default.object({
    type: schemastery_1.default.string().required(),
    name: schemastery_1.default.string().required(),
    icon: schemastery_1.default.string(),
    amount: schemastery_1.default.number().required(),
});
exports.configSchema = schemastery_1.default.object({
    entrustItems: schemastery_1.default.array(exports.itemConfigSchema).default([
        {
            type: 'minecraft:emerald',
            name: '绿宝石',
            icon: 'textures/items/emerald',
        },
    ]),
    rewardItems: schemastery_1.default.array(exports.itemConfigSchema).default([
        {
            type: 'minecraft:diamond',
            name: '钻石',
            icon: 'textures/items/diamond',
        },
    ]),
    openItems: schemastery_1.default.dict(schemastery_1.default.array(schemastery_1.default.string())).default({}),
    allInOne: schemastery_1.default.boolean().default(false),
    onlyUseOpenItem: schemastery_1.default.boolean().default(false),
    cmdOnlyOp: schemastery_1.default.boolean().default(false),
});
exports.entrustSchema = schemastery_1.default.object({
    name: schemastery_1.default.string().required(),
    submitor: schemastery_1.default.string().required(),
    submitTime: schemastery_1.default.string().required(),
    submitItem: exports.entrustItemSchema.required(),
    requirement: exports.entrustItemSchema.required(),
    completed: schemastery_1.default.boolean().default(false),
    completor: schemastery_1.default.string(),
    completeTime: schemastery_1.default.string(),
});
exports.entrustListSchema = schemastery_1.default.array(exports.entrustSchema).default([]);
function writeFile(path, obj) {
    (0, fs_1.writeFileSync)(path, JSON.stringify(obj, null, 2), { encoding: 'utf-8' });
}
exports.writeFile = writeFile;
function readConfig(path, validator) {
    const content = (0, fs_1.existsSync)(path)
        ? JSON.parse((0, fs_1.readFileSync)(path, { encoding: 'utf-8' }))
        : null;
    const validated = validator(content);
    writeFile(path, validated);
    return validated;
}
exports.readConfig = readConfig;
exports.config = readConfig(exports.configFilePath, exports.configSchema);
exports.entrusts = readConfig(exports.entrustsFilePath, exports.entrustListSchema);
function reloadConfig() {
    (0, util_1.clearObject)(exports.config);
    Object.assign(exports.config, readConfig(exports.configFilePath, exports.configSchema));
    (0, util_1.clearObject)(exports.entrusts);
    Object.assign(exports.entrusts, readConfig(exports.entrustsFilePath, exports.entrustListSchema));
}
exports.reloadConfig = reloadConfig;
function writeConfig() {
    writeFile(exports.configFilePath, exports.config);
}
exports.writeConfig = writeConfig;
function writeEntrusts() {
    writeFile(exports.entrustsFilePath, exports.entrusts);
}
exports.writeEntrusts = writeEntrusts;
