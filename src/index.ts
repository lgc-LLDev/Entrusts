// LiteLoaderScript Dev Helper
/// <reference path="../../HelperLib/src/index.d.ts"/>

import {
  PLUGIN_DESCRIPTION,
  PLUGIN_EXTRA,
  PLUGIN_NAME,
  PLUGIN_VERSION,
} from './const';

import './listener';
import './command';

logger.setTitle(PLUGIN_NAME);

ll.registerPlugin(
  PLUGIN_NAME,
  PLUGIN_DESCRIPTION,
  PLUGIN_VERSION,
  PLUGIN_EXTRA
);
