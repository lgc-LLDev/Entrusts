import { description, version } from '../package.json'

export const PLUGIN_NAME = 'Entrusts'
export const PLUGIN_VERSION = <[number, number, number]>(
  version.split('.').map((v) => Number(v))
)
export const PLUGIN_DESCRIPTION = description
export const PLUGIN_EXTRA = { Author: 'student_2333', License: 'Apache-2.0' }

export const DATA_PATH = `./plugins/${PLUGIN_NAME}`
if (!file.exists(DATA_PATH)) file.mkdir(DATA_PATH)
