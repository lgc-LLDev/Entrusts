import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { description, version } from '../package.json';

export const PLUGIN_NAME = 'Entrusts';
export const PLUGIN_VERSION = <[number, number, number]>(
  version.split('.').map((v) => Number(v))
);
export const PLUGIN_DESCRIPTION = description;
export const PLUGIN_EXTRA = { Author: 'student_2333', License: 'Apache-2.0' };

export const dataPath = join('./plugins', PLUGIN_NAME);
if (!existsSync(dataPath)) mkdirSync(dataPath);
