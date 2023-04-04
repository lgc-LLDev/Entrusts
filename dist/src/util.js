"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeContainerItem = exports.countContainerItem = exports.formatDate = exports.wrapAsyncFunc = exports.logError = exports.formatError = exports.sleep = void 0;
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
exports.sleep = sleep;
function formatError(e) {
    return e instanceof Error ? `${e.stack}\n${e.message}` : String(e);
}
exports.formatError = formatError;
function logError(e) {
    logger.error(formatError(e));
}
exports.logError = logError;
function wrapAsyncFunc(func) {
    return (...args) => {
        setTimeout(() => func(...args).catch(logError), 0);
    };
}
exports.wrapAsyncFunc = wrapAsyncFunc;
function formatDate(options = {}) {
    const date = options.date ?? new Date();
    const withTime = options.withTime ?? true;
    const yr = date.getFullYear();
    const mon = date.getMonth() + 1;
    const day = date.getDate();
    let formatted = `${yr}-${mon}-${day}`;
    if (withTime) {
        const padNum = (n) => n.toString().padStart(2, '0');
        const hr = date.getHours();
        const min = padNum(date.getMinutes());
        const sec = padNum(date.getSeconds());
        formatted += ` ${hr}:${min}:${sec}`;
    }
    return formatted;
}
exports.formatDate = formatDate;
function countContainerItem(container, itemType) {
    let count = 0;
    for (const it of container.getAllItems())
        if (it.type === itemType)
            count += it.count;
    return count;
}
exports.countContainerItem = countContainerItem;
function removeContainerItem(container, type, amount) {
    const items = container.getAllItems();
    let removedCount = 0;
    for (let i = 0; i < items.length; i += 1) {
        const it = items[i];
        if (it.type === type) {
            const { count } = it;
            const willRemove = count <= amount ? count : amount;
            container.removeItem(i, willRemove);
            removedCount += willRemove;
        }
        if (removedCount >= amount)
            return;
    }
}
exports.removeContainerItem = removeContainerItem;
