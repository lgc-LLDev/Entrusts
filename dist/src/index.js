"use strict";
// LiteLoaderScript Dev Helper
/// <reference path="../../HelperLib/src/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
require("./listener");
logger.setTitle(const_1.PLUGIN_NAME);
ll.registerPlugin(const_1.PLUGIN_NAME, const_1.PLUGIN_DESCRIPTION, const_1.PLUGIN_VERSION, const_1.PLUGIN_EXTRA);
