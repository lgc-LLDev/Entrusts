"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeContainerItem = exports.countContainerItem = exports.formatDate = exports.wrapAsyncFunc = exports.logError = exports.formatError = exports.sleep = void 0;
/**
 * 延时
 * @param time 时长，单位 ms
 */
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
exports.sleep = sleep;
/**
 * 格式化错误堆栈
 * @param e 错误对象
 * @returns 格式化后的错误
 */
function formatError(e) {
    return e instanceof Error ? `${e.stack}\n${e.message}` : String(e);
}
exports.formatError = formatError;
/**
 * 输出错误到控制台
 * @param e 错误
 */
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
    // log(container.getAllItems().map((v) => `${v.type}:${v.count}`));
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
