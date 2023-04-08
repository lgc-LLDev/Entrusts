"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const form_1 = require("./form");
const util_1 = require("./util");
mc.listen('onUseItem', (player, item) => {
    const openItems = [
        ...(config_1.config.onlyUseOpenItem ? [] : config_1.config.entrustItems).map((v) => [v.type, [v.type]]),
        ...Object.entries(config_1.config.openItems),
    ];
    for (const [eit, items] of openItems) {
        if (eit === item.type) {
            (0, util_1.wrapAsyncFunc)(form_1.entrustMenu)(player, config_1.config.allInOne ? undefined : items);
            return false;
        }
    }
    return true;
});
