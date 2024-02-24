'use strict';

var version$1 = "0.3.0";
var description = "玩家可发布的委托系统";

const PLUGIN_NAME = 'Entrusts';
const PLUGIN_VERSION = (version$1.split('.').map((v) => Number(v)));
const PLUGIN_DESCRIPTION = description;
const PLUGIN_EXTRA = { Author: 'student_2333', License: 'Apache-2.0' };
const DATA_PATH = `./plugins/${PLUGIN_NAME}`;
if (!file.exists(DATA_PATH))
    file.mkdir(DATA_PATH);

var version = "0.5.2";

const NAME = 'FormAPIEx';
(version.split('.').map((v) => Number(v)));
const FormClose = Symbol(`${NAME}_FormClose`);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * 格式化错误堆栈
 * @param e 错误对象
 * @returns 格式化后的错误
 */
function formatError(e) {
    return e instanceof Error ? `${e.message}\n${e.stack}` : String(e);
}
/**
 * 在 sync function 中使用 setTimeout 调用 async function，解决 LLSE 回调调用 async 函数会出现的玄学 bug
 * @param func async function
 * @returns wrapped sync function
 */
function wrapAsyncFunc(func) {
    return (...args) => {
        setTimeout(() => func(...args).catch((e) => logger.error(formatError(e))), 0);
    };
}
/**
 * 使用 json 序列化及反序列化深复制对象
 * @param obj 对象
 * @returns 复制后对象
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function sendFormAsync(player, form) {
    return new Promise((resolve) => {
        player.sendForm(form, (_, data) => setTimeout(() => resolve(data === null || data === undefined ? FormClose : data), 0));
    });
}

var _CustomFormEx_objects;
/**
 * 使用 CustomFormObject 构建自定义表单对象
 * @param formTitle 表单标题
 * @param objects 表单元素
 * @returns 构建好的表单
 */
function buildCustomForm(formTitle, objects) {
    const form = mc.newCustomForm();
    form.setTitle(formTitle);
    for (const obj of objects) {
        switch (obj.type) {
            case 'label': {
                form.addLabel(obj.text);
                break;
            }
            case 'input': {
                const { title, placeholder, defaultVal } = obj;
                form.addInput(title, placeholder ?? '', defaultVal ?? '');
                break;
            }
            case 'switch': {
                const { title, defaultVal } = obj;
                form.addSwitch(title, defaultVal ?? false);
                break;
            }
            case 'dropdown': {
                const { title, items, defaultVal } = obj;
                form.addDropdown(title, items, defaultVal ?? 0);
                break;
            }
            case 'slider': {
                const { title, min, max, step, defaultVal } = obj;
                form.addSlider(title, min, max, step ?? 1, defaultVal ?? min);
                break;
            }
            case 'stepSlider': {
                const { title, items, defaultVal } = obj;
                form.addStepSlider(title, items, defaultVal ?? 0);
                break;
            }
            // no default
        }
    }
    return form;
}
class CustomFormEx {
    /**
     * @param title 表单标题
     */
    constructor(title = '') {
        /** 表单标题 */
        this.title = '';
        _CustomFormEx_objects.set(this, []);
        this.title = title;
    }
    /**
     * 获取表单元素列表
     */
    get objects() {
        return deepClone(__classPrivateFieldGet(this, _CustomFormEx_objects, "f"));
    }
    /**
     * 获取表单元素数量
     */
    get length() {
        return __classPrivateFieldGet(this, _CustomFormEx_objects, "f").length;
    }
    /**
     * 设置表单标题
     * @param val 标题
     * @returns 自身，便于链式调用
     */
    setTitle(val) {
        this.title = val;
        return this;
    }
    // add object
    // 格式化之后着色有问题
    // prettier-ignore
    /**
     * 向表单尾部添加一个元素
     * @param id 元素 id
     * @param obj 元素
     * @returns 自身，便于链式调用
     */
    push(id, obj) {
        __classPrivateFieldGet(this, _CustomFormEx_objects, "f").push([id, obj]);
        return this;
    }
    // prettier-ignore
    /**
     * 向表单头部添加一个元素
     * @param id 元素 id
     * @param obj 元素
     * @returns 自身，便于链式调用
     */
    unshift(id, obj) {
        __classPrivateFieldGet(this, _CustomFormEx_objects, "f").unshift([id, obj]);
        return this;
    }
    // prettier-ignore
    /**
     * 向表单插入一个元素
     * @param index 插入位置
     * @param id 元素 id
     * @param obj 元素
     * @returns 自身，便于链式调用
     */
    insert(index, id, obj) {
        __classPrivateFieldGet(this, _CustomFormEx_objects, "f").splice(index, 0, [id, obj]);
        return this;
    }
    // remove object
    /**
     * 删除表单元素
     * @param id 元素 id
     * @returns 自身，便于链式调用
     */
    remove(id) {
        for (let i = 0; i < __classPrivateFieldGet(this, _CustomFormEx_objects, "f").length; i += 1) {
            const [objId] = __classPrivateFieldGet(this, _CustomFormEx_objects, "f")[i];
            if (objId === id) {
                __classPrivateFieldGet(this, _CustomFormEx_objects, "f").splice(i, 1);
                break;
            }
        }
        return this;
    }
    get(id) {
        if (typeof id === 'number')
            return __classPrivateFieldGet(this, _CustomFormEx_objects, "f")[id];
        for (const [objId, val] of __classPrivateFieldGet(this, _CustomFormEx_objects, "f")) {
            if (objId === id)
                return val;
        }
        return null;
    }
    addLabel(arg1, arg2) {
        const id = arg2 ? arg1 : undefined;
        const text = arg2 ?? arg1;
        return this.push(id, { type: 'label', text });
    }
    /**
     * 向表单添加一个输入框
     * @param id 元素 id
     * @param title 输入框标题
     * @param options 附加选项
     * @returns 自身，便于链式调用
     */
    addInput(id, title, options = {}) {
        const { placeholder, default: defaultVal } = options;
        return this.push(id, {
            type: 'input',
            title,
            placeholder,
            defaultVal,
        });
    }
    /**
     * 向表单添加一个开关
     * @param id 元素 id
     * @param title 开关标题
     * @param defaultVal 开关默认状态，默认为 `false`
     * @returns 自身，便于链式调用
     */
    addSwitch(id, title, defaultVal = false) {
        return this.push(id, { type: 'switch', title, defaultVal });
    }
    /**
     * 向表单添加一个下拉框
     * @param id 元素 id
     * @param title 下拉框标题
     * @param items 下拉框元素
     * @param defaultVal 下拉框默认选择元素位置，默认为 `0`
     * @returns 自身，便于链式调用
     */
    addDropdown(id, title, items, defaultVal = 0) {
        return this.push(id, { type: 'dropdown', title, items, defaultVal });
    }
    /**
     * 向表单添加一个滑块
     * @param id 元素 id
     * @param title 滑块标题
     * @param min 滑块最小值
     * @param max 滑块最大值
     * @param options 附加选项
     * @returns 自身，便于链式调用
     */
    addSlider(id, title, min, max, options = {}) {
        const { step, default: defaultVal } = options;
        return this.push(id, { type: 'slider', title, min, max, step, defaultVal });
    }
    /**
     * 向表单添加一个步进滑块
     * @param id 元素 id
     * @param title 步进滑块标题
     * @param items 步进滑块元素列表
     * @param defaultVal 滑块默认位置，默认为 `0`
     * @returns 自身，便于链式调用
     */
    addStepSlider(id, title, items, defaultVal = 0) {
        return this.push(id, { type: 'stepSlider', title, items, defaultVal });
    }
    // send
    parseReturn(data) {
        const res = {};
        for (let i = 0; i < data.length; i += 1) {
            const [id] = __classPrivateFieldGet(this, _CustomFormEx_objects, "f")[i];
            const val = data[i] ?? undefined;
            if (id)
                res[id] = val;
        }
        return res;
    }
    /**
     * 异步向玩家发送该表单
     * @param player 玩家对象
     * @returns 返回结果，玩家关闭表单或发送失败返回 FormClose
     */
    async sendAsync(player) {
        const data = await sendFormAsync(player, buildCustomForm(this.title, this.objects.map((v) => v[1])));
        if (data === FormClose)
            return FormClose;
        return this.parseReturn(data);
    }
}
_CustomFormEx_objects = new WeakMap();

/**
 * 异步向玩家发送模式表单
 * @param player 玩家对象
 * @param title 表单标题
 * @param content 表单内容
 * @param confirmButton 确认按钮标题
 * @param cancelButton 取消按钮标题
 * @returns 玩家选择的按钮
 */
function sendModalFormAsync(player, title, content, confirmButton = '§a确认', cancelButton = '§c取消') {
    // 不知道怎么回事按取消会返回 null / undefined，干脆直接转 boolean
    return new Promise((resolve) => {
        player.sendModalForm(title, content, confirmButton, cancelButton, (_, data) => setTimeout(() => resolve(!!data), 0));
    });
}

class SimpleFormAsync {
    /**
     * @param options 附加选项
     */
    constructor(options = {}) {
        /** 表单标题 */
        this.title = '';
        /** 表单内容 */
        this.content = '';
        /** 表单按钮 `[ text, image ]` */
        this.buttons = [];
        const { title, content, buttons } = options;
        if (title)
            this.title = title;
        if (content)
            this.content = content;
        if (buttons)
            this.buttons = buttons;
    }
    /**
     * 设置表单标题
     * @param val 标题
     * @returns 自身，便于链式调用
     */
    setTitle(val) {
        this.title = val;
        return this;
    }
    /**
     * 设置表单内容
     * @param val 内容
     * @returns 自身，便于链式调用
     */
    setContent(val) {
        this.content = val;
        return this;
    }
    /**
     * 给表单添加一个按钮
     * @param text 按钮文本
     * @param image 按钮图片
     * @returns 自身，便于链式调用
     */
    addButton(text, image) {
        this.buttons.push([text, image]);
        return this;
    }
    /**
     * 异步向玩家发送该表单
     * @param player 玩家对象
     * @returns 玩家选择的按钮序号，玩家关闭表单或发送失败返回 FormClose
     */
    sendAsync(player) {
        const form = mc
            .newSimpleForm()
            .setTitle(this.title)
            .setContent(this.content);
        this.buttons.forEach(([text, image]) => {
            if (image)
                form.addButton(text, image);
            else
                form.addButton(text);
        });
        return sendFormAsync(player, form);
    }
}

class SimpleFormEx {
    /**
     * @param buttons 表单按钮参数
     */
    constructor(buttons = []) {
        /** 表单标题 */
        this.title = '';
        /**
         * 表单内容
         *
         * 可用变量
         * - `{{currentPage}}` - 当前页数
         * - `{{maxPage}}` - 最大页数
         * - `{{count}}` - 条目总数
         */
        this.content = '§a第 §e{{currentPage}} §f/ §6{{maxPage}} §a页 §7| §a共 §e{{count}} §a条';
        /** 表单按钮参数列表 */
        this.buttons = [];
        /**
         * 表单按钮格式化函数
         * @param v 表单按钮对应的参数
         * @param index 按钮对应的位置
         * @param array 整个表单按钮参数列表
         * @returns 格式化后的按钮 `[ text, image ]`
         */
        // eslint-disable-next-line class-methods-use-this
        this.formatter = (v) => [`§3${String(v)}`];
        /** 表单是否可翻页 */
        this.canTurnPage = false;
        /** 表单是否显示跳页按钮 */
        this.canJumpPage = false;
        /** 表单每页最大项目数 */
        this.maxPageNum = 15;
        /** 表单是否显示搜索按钮 */
        this.hasSearchButton = false;
        // eslint-disable-next-line class-methods-use-this
        /**
         * 表单按钮搜索函数
         * @param buttons 整个表单按钮参数列表
         * @param param 搜索关键词参数
         * @returns 搜索到的按钮参数列表
         */
        this.searcher = (buttons, param) => {
            const params = param.toLowerCase().split(/\s/g);
            const formatted = this.formatButtons(buttons).map((v) => v[0].toLowerCase());
            const result = [];
            for (const it of formatted) {
                const score = params.reduce((acc, cur) => acc + (it.includes(cur) ? 1 : 0), 0);
                if (score)
                    result.push([score, buttons[formatted.indexOf(it)]]);
            }
            return result.sort(([a], [b]) => b - a).map((v) => v[1]);
        };
        this.buttons = buttons;
    }
    /**
     * 格式化给定按钮
     * @param buttons 表单按钮参数列表
     * @returns 格式化后的按钮
     */
    formatButtons(buttons = this.buttons) {
        return buttons.map(this.formatter);
    }
    /**
     * @returns 表单最大页数
     */
    getMaxPageNum() {
        return this.canTurnPage
            ? Math.ceil(this.buttons.length / this.maxPageNum)
            : 1;
    }
    /**
     * 获取对应页数的按钮参数列表
     * @param page 页码
     * @returns 按钮参数列表
     */
    getPage(page = 1) {
        if (page > this.getMaxPageNum())
            return [];
        return this.buttons.slice((page - 1) * this.maxPageNum, page * this.maxPageNum);
    }
    /**
     * 异步向玩家发送搜索表单
     * @param player 玩家对象
     * @param defaultVal 搜索框默认内容
     * @returns 选择的搜索结果按钮参数。返回 null 为没搜到, FormClose 为取消搜索
     */
    async sendSearchForm(player, defaultVal = '') {
        const form = new CustomFormEx(this.title);
        const res = await form
            .addInput('param', '请输入你要搜索的内容', { default: defaultVal })
            .sendAsync(player);
        if (res === FormClose)
            return FormClose;
        const searched = this.searcher(this.buttons, res.param);
        if (!searched.length) {
            await new SimpleFormAsync({
                title: this.title,
                content: '§6没有搜索到结果',
            }).sendAsync(player);
            return null;
        }
        const searchForm = new SimpleFormEx();
        searchForm.title = this.title;
        searchForm.content = `§a为您找到了 §l§6${searched.length} §r§a个结果\n${searchForm.content}`;
        searchForm.buttons = searched;
        searchForm.formatter = this.formatter;
        searchForm.canTurnPage = this.canTurnPage;
        searchForm.canJumpPage = this.canJumpPage;
        searchForm.maxPageNum = this.maxPageNum;
        searchForm.hasSearchButton = false;
        const selected = await searchForm.sendAsync(player);
        return selected === FormClose ? FormClose : selected;
    }
    /**
     * 异步向玩家发送表单
     * @param player 玩家对象
     * @param page 页码
     * @returns 给定的按钮参数，表单被玩家关闭或发送失败返回 FormClose
     */
    async sendAsync(player, page = 1) {
        const buttons = this.canTurnPage ? this.getPage(page) : this.buttons;
        const formattedButtons = this.formatButtons(buttons);
        const maxPage = this.getMaxPageNum();
        const pageAboveOne = maxPage > 1;
        const hasJumpBtn = this.canJumpPage && pageAboveOne;
        const hasPreviousPage = page > 1 && pageAboveOne;
        const hasNextPage = page < maxPage && pageAboveOne;
        if (hasPreviousPage)
            formattedButtons.unshift(['§2<- 上一页']);
        if (hasJumpBtn)
            formattedButtons.unshift(['§1跳页']);
        if (this.hasSearchButton)
            formattedButtons.unshift(['§1搜索']);
        if (hasNextPage)
            formattedButtons.push(['§2下一页 ->']);
        const formatContent = (content) => {
            const count = this.buttons.length;
            const formatMap = {
                currentPage: page,
                maxPage,
                count,
            };
            for (const [key, val] of Object.entries(formatMap)) {
                content = content.replaceAll(`{{${key}}}`, String(val));
            }
            return content;
        };
        const resultIndex = await new SimpleFormAsync({
            title: this.title,
            content: formatContent(this.content),
            buttons: formattedButtons,
        }).sendAsync(player);
        if (resultIndex === FormClose)
            return FormClose;
        let offset = 0;
        if (this.hasSearchButton) {
            if (resultIndex === offset) {
                const res = await this.sendSearchForm(player);
                return res === null || res === FormClose
                    ? this.sendAsync(player, page)
                    : res;
            }
            offset += 1;
        }
        if (hasJumpBtn) {
            if (resultIndex === offset) {
                const res = await new CustomFormEx(this.title)
                    .addSlider('num', '请选择你要跳转的页数', 1, maxPage, {
                    default: page,
                })
                    .sendAsync(player);
                return this.sendAsync(player, res === FormClose ? page : res.num);
            }
            offset += 1;
        }
        if (hasPreviousPage) {
            if (resultIndex === offset) {
                return this.sendAsync(player, page - 1);
            }
            offset += 1;
        }
        if (hasNextPage && resultIndex + 1 === formattedButtons.length) {
            return this.sendAsync(player, page + 1);
        }
        const realIndex = resultIndex - offset;
        return buttons[realIndex];
    }
}

var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", { value, configurable: true });

// packages/cosmokit/src/misc.ts
function noop() {
}
__name$1(noop, "noop");
function isNullable(value) {
  return value === null || value === void 0;
}
__name$1(isNullable, "isNullable");
function isPlainObject(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}
__name$1(isPlainObject, "isPlainObject");
function filterKeys(object, filter) {
  return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
}
__name$1(filterKeys, "filterKeys");
function mapValues(object, transform) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
}
__name$1(mapValues, "mapValues");
function is(type, value) {
  if (arguments.length === 1)
    return (value2) => is(type, value2);
  return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
__name$1(is, "is");
function clone(source) {
  if (!source || typeof source !== "object")
    return source;
  if (Array.isArray(source))
    return source.map(clone);
  if (is("Date", source))
    return new Date(source.valueOf());
  if (is("RegExp", source))
    return new RegExp(source.source, source.flags);
  return mapValues(source, clone);
}
__name$1(clone, "clone");
function deepEqual(a, b, strict) {
  if (a === b)
    return true;
  if (!strict && isNullable(a) && isNullable(b))
    return true;
  if (typeof a !== typeof b)
    return false;
  if (typeof a !== "object")
    return false;
  if (!a || !b)
    return false;
  function check(test, then) {
    return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
  }
  __name$1(check, "check");
  return check(Array.isArray, (a2, b2) => a2.length === b2.length && a2.every((item, index) => deepEqual(item, b2[index]))) ?? check(is("Date"), (a2, b2) => a2.valueOf() === b2.valueOf()) ?? check(is("RegExp"), (a2, b2) => a2.source === b2.source && a2.flags === b2.flags) ?? Object.keys({ ...a, ...b }).every((key) => deepEqual(a[key], b[key], strict));
}
__name$1(deepEqual, "deepEqual");
function pick(source, keys, forced) {
  if (!keys)
    return { ...source };
  const result = {};
  for (const key of keys) {
    if (forced || source[key] !== void 0)
      result[key] = source[key];
  }
  return result;
}
__name$1(pick, "pick");
function omit(source, keys) {
  if (!keys)
    return { ...source };
  const result = { ...source };
  for (const key of keys) {
    Reflect.deleteProperty(result, key);
  }
  return result;
}
__name$1(omit, "omit");
function defineProperty(object, key, value) {
  return Object.defineProperty(object, key, { writable: true, value, enumerable: false });
}
__name$1(defineProperty, "defineProperty");

// packages/cosmokit/src/array.ts
function contain(array1, array2) {
  return array2.every((item) => array1.includes(item));
}
__name$1(contain, "contain");
function intersection(array1, array2) {
  return array1.filter((item) => array2.includes(item));
}
__name$1(intersection, "intersection");
function difference(array1, array2) {
  return array1.filter((item) => !array2.includes(item));
}
__name$1(difference, "difference");
function union(array1, array2) {
  return Array.from(/* @__PURE__ */ new Set([...array1, ...array2]));
}
__name$1(union, "union");
function deduplicate(array) {
  return [...new Set(array)];
}
__name$1(deduplicate, "deduplicate");
function remove(list, item) {
  const index = list.indexOf(item);
  if (index >= 0) {
    list.splice(index, 1);
    return true;
  } else {
    return false;
  }
}
__name$1(remove, "remove");
function makeArray(source) {
  return Array.isArray(source) ? source : isNullable(source) ? [] : [source];
}
__name$1(makeArray, "makeArray");

// packages/cosmokit/src/binary.ts
function arrayBufferToBase64(buffer) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(buffer).toString("base64");
  }
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
__name$1(arrayBufferToBase64, "arrayBufferToBase64");
function base64ToArrayBuffer(base64) {
  if (typeof Buffer !== "undefined") {
    const buf = Buffer.from(base64, "base64");
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
  }
  const binary = atob(base64.replace(/\s/g, ""));
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer;
}
__name$1(base64ToArrayBuffer, "base64ToArrayBuffer");

// packages/cosmokit/src/string.ts
function capitalize(source) {
  return source.charAt(0).toUpperCase() + source.slice(1);
}
__name$1(capitalize, "capitalize");
function uncapitalize(source) {
  return source.charAt(0).toLowerCase() + source.slice(1);
}
__name$1(uncapitalize, "uncapitalize");
function camelCase(source) {
  return source.replace(/[_-][a-z]/g, (str) => str.slice(1).toUpperCase());
}
__name$1(camelCase, "camelCase");
function paramCase(source) {
  return uncapitalize(source).replace(/_/g, "-").replace(/.[A-Z]+/g, (str) => str[0] + "-" + str.slice(1).toLowerCase());
}
__name$1(paramCase, "paramCase");
function snakeCase(source) {
  return uncapitalize(source).replace(/-/g, "_").replace(/.[A-Z]+/g, (str) => str[0] + "_" + str.slice(1).toLowerCase());
}
__name$1(snakeCase, "snakeCase");
function trimSlash(source) {
  return source.replace(/\/$/, "");
}
__name$1(trimSlash, "trimSlash");
function sanitize(source) {
  if (!source.startsWith("/"))
    source = "/" + source;
  return trimSlash(source);
}
__name$1(sanitize, "sanitize");

// packages/cosmokit/src/time.ts
var Time;
((Time2) => {
  Time2.millisecond = 1;
  Time2.second = 1e3;
  Time2.minute = Time2.second * 60;
  Time2.hour = Time2.minute * 60;
  Time2.day = Time2.hour * 24;
  Time2.week = Time2.day * 7;
  let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
  function setTimezoneOffset(offset) {
    timezoneOffset = offset;
  }
  Time2.setTimezoneOffset = setTimezoneOffset;
  __name$1(setTimezoneOffset, "setTimezoneOffset");
  function getTimezoneOffset() {
    return timezoneOffset;
  }
  Time2.getTimezoneOffset = getTimezoneOffset;
  __name$1(getTimezoneOffset, "getTimezoneOffset");
  function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
    if (typeof date === "number")
      date = new Date(date);
    if (offset === void 0)
      offset = timezoneOffset;
    return Math.floor((date.valueOf() / Time2.minute - offset) / 1440);
  }
  Time2.getDateNumber = getDateNumber;
  __name$1(getDateNumber, "getDateNumber");
  function fromDateNumber(value, offset) {
    const date = new Date(value * Time2.day);
    if (offset === void 0)
      offset = timezoneOffset;
    return new Date(+date + offset * Time2.minute);
  }
  Time2.fromDateNumber = fromDateNumber;
  __name$1(fromDateNumber, "fromDateNumber");
  const numeric = /\d+(?:\.\d+)?/.source;
  const timeRegExp = new RegExp(`^${[
    "w(?:eek(?:s)?)?",
    "d(?:ay(?:s)?)?",
    "h(?:our(?:s)?)?",
    "m(?:in(?:ute)?(?:s)?)?",
    "s(?:ec(?:ond)?(?:s)?)?"
  ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
  function parseTime(source) {
    const capture = timeRegExp.exec(source);
    if (!capture)
      return 0;
    return (parseFloat(capture[1]) * Time2.week || 0) + (parseFloat(capture[2]) * Time2.day || 0) + (parseFloat(capture[3]) * Time2.hour || 0) + (parseFloat(capture[4]) * Time2.minute || 0) + (parseFloat(capture[5]) * Time2.second || 0);
  }
  Time2.parseTime = parseTime;
  __name$1(parseTime, "parseTime");
  function parseDate(date) {
    const parsed = parseTime(date);
    if (parsed) {
      date = Date.now() + parsed;
    } else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) {
      date = `${( new Date()).toLocaleDateString()}-${date}`;
    } else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) {
      date = `${( new Date()).getFullYear()}-${date}`;
    }
    return date ? new Date(date) : /* @__PURE__ */ new Date();
  }
  Time2.parseDate = parseDate;
  __name$1(parseDate, "parseDate");
  function format(ms) {
    const abs = Math.abs(ms);
    if (abs >= Time2.day - Time2.hour / 2) {
      return Math.round(ms / Time2.day) + "d";
    } else if (abs >= Time2.hour - Time2.minute / 2) {
      return Math.round(ms / Time2.hour) + "h";
    } else if (abs >= Time2.minute - Time2.second / 2) {
      return Math.round(ms / Time2.minute) + "m";
    } else if (abs >= Time2.second) {
      return Math.round(ms / Time2.second) + "s";
    }
    return ms + "ms";
  }
  Time2.format = format;
  __name$1(format, "format");
  function toDigits(source, length = 2) {
    return source.toString().padStart(length, "0");
  }
  Time2.toDigits = toDigits;
  __name$1(toDigits, "toDigits");
  function template(template2, time = /* @__PURE__ */ new Date()) {
    return template2.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
  }
  Time2.template = template;
  __name$1(template, "template");
})(Time || (Time = {}));

var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_src = __commonJS({
  "packages/schemastery/packages/core/src/index.ts"(exports, module) {
    var kSchema = Symbol.for("schemastery");
    globalThis.__schemastery_index__ ??= 0;
    var Schema = /* @__PURE__ */ __name(function(options) {
      const schema = /* @__PURE__ */ __name(function(data, options2) {
        return Schema.resolve(data, schema, options2)[0];
      }, "schema");
      if (options.refs) {
        const refs2 = mapValues(options.refs, (options2) => new Schema(options2));
        const getRef = /* @__PURE__ */ __name((uid) => refs2[uid], "getRef");
        for (const key in refs2) {
          const options2 = refs2[key];
          options2.sKey = getRef(options2.sKey);
          options2.inner = getRef(options2.inner);
          options2.list = options2.list && options2.list.map(getRef);
          options2.dict = options2.dict && mapValues(options2.dict, getRef);
        }
        return refs2[options.uid];
      }
      Object.assign(schema, options);
      if (typeof schema.callback === "string") {
        try {
          schema.callback = new Function("return " + schema.callback)();
        } catch {
        }
      }
      Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
      Object.setPrototypeOf(schema, Schema.prototype);
      schema.meta ||= {};
      schema.toString = schema.toString.bind(schema);
      return schema;
    }, "Schema");
    Schema.prototype = Object.create(Function.prototype);
    Schema.prototype[kSchema] = true;
    var refs;
    Schema.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
      if (refs) {
        refs[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
        return this.uid;
      }
      refs = { [this.uid]: { ...this } };
      refs[this.uid] = JSON.parse(JSON.stringify({ ...this }));
      const result = { uid: this.uid, refs };
      refs = void 0;
      return result;
    }, "toJSON");
    Schema.prototype.set = /* @__PURE__ */ __name(function set(key, value) {
      this.dict[key] = value;
      return this;
    }, "set");
    Schema.prototype.push = /* @__PURE__ */ __name(function push(value) {
      this.list.push(value);
      return this;
    }, "push");
    function mergeDesc(original, messages) {
      const result = typeof original === "string" ? { "": original } : { ...original };
      for (const locale in messages) {
        const value = messages[locale];
        if (value?.$description || value?.$desc) {
          result[locale] = value.$description || value.$desc;
        } else if (typeof value === "string") {
          result[locale] = value;
        }
      }
      return result;
    }
    __name(mergeDesc, "mergeDesc");
    function getInner(value) {
      return value?.$value ?? value?.$inner;
    }
    __name(getInner, "getInner");
    function extractKeys(data) {
      return Object.fromEntries(Object.entries(data ?? {}).filter(([key]) => !key.startsWith("$")));
    }
    __name(extractKeys, "extractKeys");
    Schema.prototype.i18n = /* @__PURE__ */ __name(function i18n(messages) {
      const schema = Schema(this);
      schema.meta.description = mergeDesc(schema.meta.description, messages);
      if (schema.dict) {
        schema.dict = mapValues(schema.dict, (inner, key) => {
          return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
        });
      }
      if (schema.list) {
        schema.list = schema.list.map((inner, index) => {
          return inner.i18n(mapValues(messages, (data = {}) => {
            if (Array.isArray(getInner(data)))
              return getInner(data)[index];
            if (Array.isArray(data))
              return data[index];
            return extractKeys(data);
          }));
        });
      }
      if (schema.inner) {
        schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
          if (getInner(data))
            return getInner(data);
          return extractKeys(data);
        }));
      }
      if (schema.sKey) {
        schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
      }
      return schema;
    }, "i18n");
    Schema.prototype.extra = /* @__PURE__ */ __name(function extra(key, value) {
      const schema = Schema(this);
      schema.meta = { ...schema.meta, [key]: value };
      return schema;
    }, "extra");
    for (const key of ["required", "disabled", "collapse", "hidden", "loose"]) {
      Object.assign(Schema.prototype, {
        [key](value = true) {
          const schema = Schema(this);
          schema.meta = { ...schema.meta, [key]: value };
          return schema;
        }
      });
    }
    Schema.prototype.deprecated = /* @__PURE__ */ __name(function deprecated() {
      const schema = Schema(this);
      schema.meta.badges ||= [];
      schema.meta.badges.push({ text: "deprecated", type: "danger" });
      return schema;
    }, "deprecated");
    Schema.prototype.experimental = /* @__PURE__ */ __name(function experimental() {
      const schema = Schema(this);
      schema.meta.badges ||= [];
      schema.meta.badges.push({ text: "experimental", type: "warning" });
      return schema;
    }, "experimental");
    Schema.prototype.pattern = /* @__PURE__ */ __name(function pattern(regexp) {
      const schema = Schema(this);
      const pattern2 = pick(regexp, ["source", "flags"]);
      schema.meta = { ...schema.meta, pattern: pattern2 };
      return schema;
    }, "pattern");
    Schema.prototype.simplify = /* @__PURE__ */ __name(function simplify(value) {
      if (deepEqual(value, this.meta.default))
        return null;
      if (isNullable(value))
        return value;
      if (this.type === "object" || this.type === "dict") {
        const result = {};
        for (const key in value) {
          const schema = this.type === "object" ? this.dict[key] : this.inner;
          const item = schema?.simplify(value[key]);
          if (!isNullable(item))
            result[key] = item;
        }
        return result;
      } else if (this.type === "array" || this.type === "tuple") {
        const result = [];
        value.forEach((value2, index) => {
          const schema = this.type === "array" ? this.inner : this.list[index];
          const item = schema ? schema.simplify(value2) : value2;
          result.push(item);
        });
        return result;
      } else if (this.type === "intersect") {
        const result = {};
        for (const item of this.list) {
          Object.assign(result, item.simplify(value));
        }
        return result;
      } else if (this.type === "union") {
        for (const schema of this.list) {
          try {
            Schema.resolve(value, schema);
            return schema.simplify(value);
          } catch {
          }
        }
      }
      return value;
    }, "simplify");
    Schema.prototype.toString = /* @__PURE__ */ __name(function toString(inline) {
      return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
    }, "toString");
    Schema.prototype.role = /* @__PURE__ */ __name(function role(role, extra) {
      const schema = Schema(this);
      schema.meta = { ...schema.meta, role, extra };
      return schema;
    }, "role");
    for (const key of ["default", "link", "comment", "description", "max", "min", "step"]) {
      Object.assign(Schema.prototype, {
        [key](value) {
          const schema = Schema(this);
          schema.meta = { ...schema.meta, [key]: value };
          return schema;
        }
      });
    }
    var resolvers = {};
    Schema.extend = /* @__PURE__ */ __name(function extend(type, resolve) {
      resolvers[type] = resolve;
    }, "extend");
    Schema.resolve = /* @__PURE__ */ __name(function resolve(data, schema, options = {}, strict = false) {
      if (!schema)
        return [data];
      if (isNullable(data)) {
        if (schema.meta.required)
          throw new TypeError(`missing required value`);
        let current = schema;
        let fallback = schema.meta.default;
        while (current?.type === "intersect" && isNullable(fallback)) {
          current = current.list[0];
          fallback = current?.meta.default;
        }
        if (isNullable(fallback))
          return [data];
        data = clone(fallback);
      }
      const callback = resolvers[schema.type];
      if (!callback)
        throw new TypeError(`unsupported type "${schema.type}"`);
      try {
        return callback(data, schema, options, strict);
      } catch (error) {
        if (!schema.meta.loose)
          throw error;
        return [schema.meta.default];
      }
    }, "resolve");
    Schema.from = /* @__PURE__ */ __name(function from(source) {
      if (isNullable(source)) {
        return Schema.any();
      } else if (["string", "number", "boolean"].includes(typeof source)) {
        return Schema.const(source).required();
      } else if (source[kSchema]) {
        return source;
      } else if (typeof source === "function") {
        switch (source) {
          case String:
            return Schema.string().required();
          case Number:
            return Schema.number().required();
          case Boolean:
            return Schema.boolean().required();
          case Function:
            return Schema.function().required();
          default:
            return Schema.is(source).required();
        }
      } else {
        throw new TypeError(`cannot infer schema from ${source}`);
      }
    }, "from");
    Schema.natural = /* @__PURE__ */ __name(function natural() {
      return Schema.number().step(1).min(0);
    }, "natural");
    Schema.percent = /* @__PURE__ */ __name(function percent() {
      return Schema.number().step(0.01).min(0).max(1).role("slider");
    }, "percent");
    Schema.date = /* @__PURE__ */ __name(function date() {
      return Schema.union([
        Schema.is(Date),
        Schema.transform(Schema.string().role("datetime"), (value) => {
          const date2 = new Date(value);
          if (isNaN(+date2))
            throw new TypeError(`invalid date "${value}"`);
          return date2;
        }, true)
      ]);
    }, "date");
    Schema.extend("any", (data) => {
      return [data];
    });
    Schema.extend("never", (data) => {
      throw new TypeError(`expected nullable but got ${data}`);
    });
    Schema.extend("const", (data, { value }) => {
      if (data === value)
        return [value];
      throw new TypeError(`expected ${value} but got ${data}`);
    });
    function checkWithinRange(data, meta, description) {
      const { max = Infinity, min = -Infinity } = meta;
      if (data > max)
        throw new TypeError(`expected ${description} <= ${max} but got ${data}`);
      if (data < min)
        throw new TypeError(`expected ${description} >= ${min} but got ${data}`);
    }
    __name(checkWithinRange, "checkWithinRange");
    Schema.extend("string", (data, { meta }) => {
      if (typeof data !== "string")
        throw new TypeError(`expected string but got ${data}`);
      if (meta.pattern) {
        const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
        if (!regexp.test(data))
          throw new TypeError(`expect string to match regexp ${regexp}`);
      }
      checkWithinRange(data.length, meta, "string length");
      return [data];
    });
    function decimalShift(data, digits) {
      const str = data.toString();
      if (str.includes("e"))
        return data * Math.pow(10, digits);
      const index = str.indexOf(".");
      if (index === -1)
        return data * Math.pow(10, digits);
      const frac = str.slice(index + 1);
      const integer = str.slice(0, index);
      if (frac.length <= digits)
        return +(integer + frac.padEnd(digits, "0"));
      return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
    }
    __name(decimalShift, "decimalShift");
    function isMultipleOf(data, min, step) {
      step = Math.abs(step);
      if (!/^\d+\.\d+$/.test(step.toString())) {
        return (data - min) % step === 0;
      }
      const index = step.toString().indexOf(".");
      const digits = step.toString().slice(index + 1).length;
      return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
    }
    __name(isMultipleOf, "isMultipleOf");
    Schema.extend("number", (data, { meta }) => {
      if (typeof data !== "number")
        throw new TypeError(`expected number but got ${data}`);
      checkWithinRange(data, meta, "number");
      const { step } = meta;
      if (step && !isMultipleOf(data, meta.min ?? 0, step)) {
        throw new TypeError(`expected number multiple of ${step} but got ${data}`);
      }
      return [data];
    });
    Schema.extend("boolean", (data) => {
      if (typeof data === "boolean")
        return [data];
      throw new TypeError(`expected boolean but got ${data}`);
    });
    Schema.extend("bitset", (data, { bits, meta }) => {
      let value = 0, keys = [];
      if (typeof data === "number") {
        value = data;
        for (const key in bits) {
          if (data & bits[key]) {
            keys.push(key);
          }
        }
      } else if (Array.isArray(data)) {
        keys = data;
        for (const key of keys) {
          if (typeof key !== "string")
            throw new TypeError(`expected string but got ${key}`);
          if (key in bits)
            value |= bits[key];
        }
      } else {
        throw new TypeError(`expected number or array but got ${data}`);
      }
      if (value === meta.default)
        return [value];
      return [value, keys];
    });
    Schema.extend("function", (data) => {
      if (typeof data === "function")
        return [data];
      throw new TypeError(`expected function but got ${data}`);
    });
    Schema.extend("is", (data, { callback }) => {
      if (data instanceof callback)
        return [data];
      throw new TypeError(`expected ${callback.name} but got ${data}`);
    });
    function property(data, key, schema, options) {
      try {
        const [value, adapted] = Schema.resolve(data[key], schema, options);
        if (adapted !== void 0)
          data[key] = adapted;
        return value;
      } catch (e) {
        if (!options?.autofix)
          throw e;
        delete data[key];
        return schema.meta.default;
      }
    }
    __name(property, "property");
    Schema.extend("array", (data, { inner, meta }, options) => {
      if (!Array.isArray(data))
        throw new TypeError(`expected array but got ${data}`);
      checkWithinRange(data.length, meta, "array length");
      return [data.map((_, index) => property(data, index, inner, options))];
    });
    Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
      if (!isPlainObject(data))
        throw new TypeError(`expected object but got ${data}`);
      const result = {};
      for (const key in data) {
        let rKey;
        try {
          rKey = Schema.resolve(key, sKey)[0];
        } catch (error) {
          if (strict)
            continue;
          throw error;
        }
        result[rKey] = property(data, key, inner, options);
        data[rKey] = data[key];
        if (key !== rKey)
          delete data[key];
      }
      return [result];
    });
    Schema.extend("tuple", (data, { list }, options, strict) => {
      if (!Array.isArray(data))
        throw new TypeError(`expected array but got ${data}`);
      const result = list.map((inner, index) => property(data, index, inner, options));
      if (strict)
        return [result];
      result.push(...data.slice(list.length));
      return [result];
    });
    function merge(result, data) {
      for (const key in data) {
        if (key in result)
          continue;
        result[key] = data[key];
      }
    }
    __name(merge, "merge");
    Schema.extend("object", (data, { dict }, options, strict) => {
      if (!isPlainObject(data))
        throw new TypeError(`expected object but got ${data}`);
      const result = {};
      for (const key in dict) {
        const value = property(data, key, dict[key], options);
        if (!isNullable(value) || key in data) {
          result[key] = value;
        }
      }
      if (!strict)
        merge(result, data);
      return [result];
    });
    Schema.extend("union", (data, { list, toString }, options, strict) => {
      for (const inner of list) {
        try {
          return Schema.resolve(data, inner, options, strict);
        } catch (error) {
        }
      }
      throw new TypeError(`expected ${toString()} but got ${JSON.stringify(data)}`);
    });
    Schema.extend("intersect", (data, { list, toString }, options, strict) => {
      let result;
      for (const inner of list) {
        const value = Schema.resolve(data, inner, options, true)[0];
        if (isNullable(value))
          continue;
        if (isNullable(result)) {
          result = value;
        } else if (typeof result !== typeof value) {
          throw new TypeError(`expected ${toString()} but got ${JSON.stringify(data)}`);
        } else if (typeof value === "object") {
          merge(result ??= {}, value);
        } else if (result !== value) {
          throw new TypeError(`expected ${toString()} but got ${JSON.stringify(data)}`);
        }
      }
      if (!strict && isPlainObject(data))
        merge(result, data);
      return [result];
    });
    Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
      const [result, adapted = data] = Schema.resolve(data, inner, options, true);
      if (preserve) {
        return [callback(result)];
      } else {
        return [callback(result), callback(adapted)];
      }
    });
    var formatters = {};
    function defineMethod(name, keys, format) {
      formatters[name] = format;
      Object.assign(Schema, {
        [name](...args) {
          const schema = new Schema({ type: name });
          keys.forEach((key, index) => {
            switch (key) {
              case "sKey":
                schema.sKey = args[index] ?? Schema.string();
                break;
              case "inner":
                schema.inner = Schema.from(args[index]);
                break;
              case "list":
                schema.list = args[index].map(Schema.from);
                break;
              case "dict":
                schema.dict = mapValues(args[index], Schema.from);
                break;
              case "bits": {
                schema.bits = {};
                for (const key2 in args[index]) {
                  if (typeof args[index][key2] !== "number")
                    continue;
                  schema.bits[key2] = args[index][key2];
                }
                break;
              }
              case "callback": {
                schema.callback = args[index];
                schema.callback["toJSON"] ||= () => schema.callback.toString();
                break;
              }
              default:
                schema[key] = args[index];
            }
          });
          if (name === "object" || name === "dict") {
            schema.meta.default = {};
          } else if (name === "array" || name === "tuple") {
            schema.meta.default = [];
          } else if (name === "bitset") {
            schema.meta.default = 0;
          }
          return schema;
        }
      });
    }
    __name(defineMethod, "defineMethod");
    defineMethod("is", ["callback"], ({ callback }) => callback.name);
    defineMethod("any", [], () => "any");
    defineMethod("never", [], () => "never");
    defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
    defineMethod("string", [], () => "string");
    defineMethod("number", [], () => "number");
    defineMethod("boolean", [], () => "boolean");
    defineMethod("bitset", ["bits"], () => "bitset");
    defineMethod("function", [], () => "function");
    defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
    defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
    defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
    defineMethod("object", ["dict"], ({ dict }) => {
      if (Object.keys(dict).length === 0)
        return "{}";
      return `{ ${Object.entries(dict).map(([key, inner]) => {
        return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
      }).join(", ")} }`;
    });
    defineMethod("union", ["list"], ({ list }, inline) => {
      const result = list.map(({ toString: format }) => format()).join(" | ");
      return inline ? `(${result})` : result;
    });
    defineMethod("intersect", ["list"], ({ list }) => {
      return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
    });
    defineMethod("transform", ["inner", "callback", "preserve"], ({ inner }, isInner) => inner.toString(isInner));
    module.exports = Schema;
  }
});
var Schema = require_src();

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
function countContainerItem(container, itemType) {
    let count = 0;
    for (const it of container.getAllItems())
        if (it.type === itemType)
            count += it.count;
    return count;
}
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
function clearObject(obj) {
    for (const k in obj)
        delete obj[k];
    return obj;
}

const CONFIG_FILE_PATH = `${DATA_PATH}/config.json`;
const ENTRUSTS_FILE_PATH = `${DATA_PATH}/entrusts.json`;
const itemConfigSchema = Schema.object({
    type: Schema.string().required(),
    name: Schema.string().required(),
    icon: Schema.string(),
});
const entrustItemSchema = Schema.object({
    type: Schema.string().required(),
    name: Schema.string().required(),
    icon: Schema.string(),
    amount: Schema.number().required(),
});
const configSchema = Schema.object({
    entrustItems: Schema.array(itemConfigSchema).default([
        {
            type: 'minecraft:emerald',
            name: '绿宝石',
            icon: 'textures/items/emerald',
        },
    ]),
    rewardItems: Schema.array(itemConfigSchema).default([
        {
            type: 'minecraft:diamond',
            name: '钻石',
            icon: 'textures/items/diamond',
        },
    ]),
    openItems: Schema.dict(Schema.array(Schema.string())).default({}),
    allInOne: Schema.boolean().default(false),
    onlyUseOpenItem: Schema.boolean().default(false),
    cmdOnlyOp: Schema.boolean().default(false),
});
const entrustSchema = Schema.object({
    name: Schema.string().required(),
    submitor: Schema.string().required(),
    submitTime: Schema.string().required(),
    submitItem: entrustItemSchema.required(),
    requirement: entrustItemSchema.required(),
    completed: Schema.boolean().default(false),
    completor: Schema.string(),
    completeTime: Schema.string(),
});
const entrustListSchema = Schema.array(entrustSchema).default([]);
function writeFile(path, obj) {
    file.writeTo(path, JSON.stringify(obj, null, 2));
}
function readConfig(path, validator) {
    const content = file.exists(path) ? JSON.parse(file.readFrom(path)) : null;
    const validated = validator(content);
    writeFile(path, validated);
    return validated;
}
const config = readConfig(CONFIG_FILE_PATH, configSchema);
const entrusts = readConfig(ENTRUSTS_FILE_PATH, entrustListSchema);
function reloadConfig() {
    clearObject(config);
    Object.assign(config, readConfig(CONFIG_FILE_PATH, configSchema));
    clearObject(entrusts);
    Object.assign(entrusts, readConfig(ENTRUSTS_FILE_PATH, entrustListSchema));
}
function writeEntrusts() {
    writeFile(ENTRUSTS_FILE_PATH, entrusts);
}

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
const itemSearcher = (items, params) => {
    const searchParams = params.trim().split(/\s/g);
    return items.filter(({ name, type }) => {
        for (const p of searchParams)
            if (name.includes(p) || type.includes(p))
                return true;
        return false;
    });
};
async function submitEntrust(player, mission) {
    const inv = player.getInventory();
    const { requirement, submitItem, submitor } = mission;
    const has = countContainerItem(inv, requirement.type) >= requirement.amount;
    if (!has) {
        await sendModalFormAsync(player, '提示', '你背包的对应物品还不够呢……', '§a知道了', '§a知道了');
        return false;
    }
    const { xuid, realName } = player;
    const completed = mission;
    completed.completed = true;
    completed.completor = xuid;
    completed.completeTime = new Date().toJSON();
    writeEntrusts();
    removeContainerItem(inv, requirement.type, requirement.amount);
    player.giveItem(mc.newItem(submitItem.type, 1), submitItem.amount);
    player.tell('§a成功提交委托~');
    const notifyPl = mc.getPlayer(submitor);
    if (notifyPl)
        notifyPl.tell(`§a你发布的委托被 §g${realName} §a完成啦，快来看看吧~`);
    return true;
}
async function getAward(player, mission) {
    entrusts.splice(entrusts.indexOf(mission), 1);
    writeEntrusts();
    const { requirement } = mission;
    player.giveItem(mc.newItem(requirement.type, 1), requirement.amount);
    player.tell('§a成功收取奖励~');
    return true;
}
async function revokeEntrust(player, mission) {
    const ok = await sendModalFormAsync(player, '提示', '§6真的要撤销该委托吗？');
    if (!ok)
        return false;
    entrusts.splice(entrusts.indexOf(mission), 1);
    writeEntrusts();
    if (player.xuid === mission.submitor) {
        const { type, amount } = mission.submitItem;
        player.giveItem(mc.newItem(type, 1), amount);
    }
    player.tell('§a成功撤销该委托');
    return true;
}
function isCompleted(m) {
    return m.completed === true;
}
async function entrustDetail(player, mission) {
    const completed = isCompleted(mission);
    const { name, submitor, submitTime, submitItem, requirement } = mission;
    const completeDetail = completed
        ? `§a完成者§r: §b${data.xuid2name(mission.completor)}\n` +
            `§a完成时间§r: §b${formatDate({
                date: new Date(mission.completeTime),
            })}\n` +
            `§r================\n`
        : '';
    const detail = `${completeDetail}` +
        `§a委托名称§r: §b${name}\n` +
        `§a委托人§r: §b${data.xuid2name(submitor)}\n` +
        `§a委托时间§r: §b${formatDate({ date: new Date(submitTime) })}\n` +
        `§a需求物品§r: §g${requirement.name} (${requirement.type}) x${requirement.amount}\n` +
        `§a奖励物品§r: §a${submitItem.name} (${submitItem.type}) x${submitItem.amount}`;
    const form = new SimpleFormEx();
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
    if (res === FormClose)
        return false;
    const ret = await res[1](player, mission);
    return ret;
}
async function selectItem(player, items) {
    const form = new SimpleFormEx(items);
    form.title = '选择物品';
    form.canJumpPage = true;
    form.canTurnPage = true;
    form.hasSearchButton = true;
    form.formatter = itemFormatter;
    form.searcher = itemSearcher;
    return form.sendAsync(player);
}
async function uploadEntrust(player, items) {
    const entrustInfo = {
        name: `玩家 ${player.realName} 发布的委托`,
        submitor: player.xuid,
        submitTime: '',
        submitItem: {
            ...config.entrustItems[items && items.length
                ? config.entrustItems.findIndex((v) => v.type === items[0])
                : 0],
            amount: 1,
        },
        requirement: {
            ...config.rewardItems[0],
            amount: 1,
        },
    };
    const editName = async () => {
        const form = new CustomFormEx('修改委托名称').addInput('name', '请输入委托名称', { default: entrustInfo.name });
        const res = await form.sendAsync(player);
        if (res !== FormClose) {
            const name = res.name.trim();
            if (!name) {
                await sendModalFormAsync(player, '提示', '委托名称不能为空！请返回修改', '§a好的', '§a好的');
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
        if (countContainerItem(player.getInventory(), item) < amount) {
            await sendModalFormAsync(player, '提示', '你背包需要提交的物品数量还不够呢……返回修改下数量吧', '§a知道了', '§a知道了');
            return false;
        }
        return true;
    };
    const editAmount = async () => {
        const { submitItem, requirement } = entrustInfo;
        const form = new CustomFormEx('修改数量')
            .addInput('requireAmount', '请输入期望§a收到§r的§a需求物品§r数量', {
            default: `${requirement.amount}`,
        })
            .addInput('submitAmount', '请输入期望§g给出§r的§g奖励物品§r数量', {
            default: `${submitItem.amount}`,
        });
        const res = await form.sendAsync(player);
        if (res !== FormClose) {
            const { requireAmount, submitAmount } = res;
            const requireNum = Number(requireAmount);
            const submitNum = Number(submitAmount);
            if (!requireNum || !submitNum || requireNum <= 0 || submitNum <= 0) {
                await sendModalFormAsync(player, '提示', '§c物品数量填写不合法！请返回修改', '§a好的', '§a好的');
                return editAmount();
            }
            if (!(await checkAmount(submitItem.type, submitNum)))
                return editAmount();
            submitItem.amount = submitNum;
            requirement.amount = requireNum;
        }
        return undefined;
    };
    const editRequirement = async () => editItem(entrustInfo.requirement, config.rewardItems);
    const editSubmitItem = async () => editItem(entrustInfo.submitItem, config.entrustItems);
    const upload = async () => {
        entrustInfo.submitTime = new Date().toJSON();
        entrusts.unshift(entrustInfo);
        writeEntrusts();
        const { submitItem } = entrustInfo;
        removeContainerItem(player.getInventory(), submitItem.type, submitItem.amount);
        player.refreshItems();
        player.tell('§a发布委托成功！');
    };
    const detailForm = async () => {
        const { name, requirement, submitItem } = entrustInfo;
        const form = new SimpleFormEx([
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
        if (res === FormClose)
            return false;
        const val = await res[1]();
        if (val === false)
            return false;
        if (val === true &&
            (await checkAmount(submitItem.type, submitItem.amount))) {
            const ok = await sendModalFormAsync(player, '提示', '确认提交委托吗？请确认你的委托内容无误');
            if (ok) {
                await upload();
                return true;
            }
        }
        return detailForm();
    };
    return detailForm();
}
async function getAllAwards(player) {
    const { xuid } = player;
    const willDo = entrusts.filter((v) => v.submitor === xuid && v.completed);
    for (const m of willDo)
        getAward(player, m);
    player.tell(`§a成功获取 §g${willDo.length} §a个委托奖励~`);
    return true;
}
async function entrustList(player, items, isMine = false) {
    const willDisplay = entrusts.filter(isMine
        ? (v) => v.submitor === player.xuid
        : (v) => !v.completed && (!items || items.includes(v.submitItem.type)));
    if (!willDisplay.length) {
        await sendModalFormAsync(player, '提示', isMine
            ? '§b你还没有发布过委托哦，快去发布一个吧！'
            : '§b委托列表空空如也哦', '§a知道了', '§a知道了');
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
    if (res === FormClose)
        return false;
    const ret = await entrustDetail(player, res);
    if (!ret)
        return entrustList(player, items);
    return true;
}
function myEntrusts(player, items) {
    return entrustList(player, items, true);
}
async function entrustMenu(player, items) {
    const form = new SimpleFormEx([
        [`§3委托列表`, entrustList],
        [`§3发布委托`, uploadEntrust],
        [`§3我的委托`, myEntrusts],
        [`§3一键领取`, getAllAwards],
    ]);
    form.title = '委托菜单';
    form.content = '';
    form.formatter = ([v]) => [v];
    const res = await form.sendAsync(player);
    if (res === FormClose)
        return false;
    const ret = await res[1](player, items);
    if (!ret)
        return entrustMenu(player, items);
    return true;
}

mc.listen('onUseItem', (player, item) => {
    const openItems = [
        ...(config.onlyUseOpenItem ? [] : config.entrustItems).map((v) => [v.type, [v.type]]),
        ...Object.entries(config.openItems),
    ];
    for (const [eit, items] of openItems) {
        if (eit === item.type) {
            wrapAsyncFunc(entrustMenu)(player, config.allInOne ? undefined : items);
            return false;
        }
    }
    return true;
});

mc.listen('onServerStarted', () => {
    const cmd = mc.newCommand('entrusts', PLUGIN_NAME, PermType.Any);
    cmd.setEnum('reload', ['reload']);
    cmd.mandatory('reload', ParamType.Enum, 'reload', 1);
    cmd.overload(['reload']);
    cmd.overload([]);
    cmd.setCallback((_, { player }, out, { reload }) => {
        if (config.cmdOnlyOp && player && !player.isOP()) {
            out.error('仅 OP 可执行此命令');
            return false;
        }
        if (reload) {
            if (player && !player.isOP()) {
                out.error('仅 OP 可执行此命令');
                return false;
            }
            try {
                reloadConfig();
            }
            catch (e) {
                out.error(`重载配置失败！\n${formatError(e)}`);
                return false;
            }
            out.success('§a重载配置成功~');
            return true;
        }
        if (!player) {
            out.error('仅玩家能执行此命令');
            return false;
        }
        wrapAsyncFunc(entrustMenu)(player);
        return true;
    });
    cmd.setup();
});

logger.setTitle(PLUGIN_NAME);
ll.registerPlugin(PLUGIN_NAME, PLUGIN_DESCRIPTION, PLUGIN_VERSION, PLUGIN_EXTRA);
