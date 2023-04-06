"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const form_1 = require("./form");
const util_1 = require("./util");
mc.listen('onUseItem', (player, item) => {
    for (const eit of config_1.config.entrustItems) {
        if ((config_1.config.onlyUseOpenItem ? false : eit.type === item.type) ||
            eit.openItem.includes(item.type)) {
            (0, util_1.wrapAsyncFunc)(form_1.entrustMenu)(player, config_1.config.allInOne ? undefined : item.type);
            return false;
        }
    }
    return true;
});
