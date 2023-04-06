"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const const_1 = require("./const");
const form_1 = require("./form");
const util_1 = require("./util");
const cmd = mc.newCommand('entrusts', const_1.PLUGIN_NAME, PermType.Any);
cmd.setEnum('reload', ['reload']);
cmd.mandatory('reload', ParamType.Enum, 'reload', 1);
cmd.overload(['reload']);
cmd.overload([]);
cmd.setCallback((_, { player }, out, { reload }) => {
    if (reload) {
        if (player && !player.isOP()) {
            out.error('仅 OP 可执行此命令');
            return false;
        }
        try {
            (0, config_1.reloadConfig)();
        }
        catch (e) {
            out.error(`重载配置失败！\n${(0, util_1.formatError)(e)}`);
            return false;
        }
        out.success('§a重载配置成功~');
        return true;
    }
    if (!player) {
        out.error('仅玩家能执行此命令');
        return false;
    }
    (0, util_1.wrapAsyncFunc)(form_1.entrustMenu)(player);
    return true;
});
cmd.setup();
