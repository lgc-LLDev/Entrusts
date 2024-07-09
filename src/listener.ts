import { wrapAsyncFunc } from 'form-api-ex'

import { config } from './config'
import { entrustMenu } from './form'

mc.listen('onUseItem', (player, item) => {
  const openItems: [string, string[]][] = [
    ...(config.onlyUseOpenItem ? [] : config.entrustItems).map(
      (v) => [v.type, [v.type]] as [string, string[]],
    ),
    ...Object.entries(config.openItems),
  ]

  for (const [eit, items] of openItems) {
    if (eit === item.type) {
      wrapAsyncFunc(entrustMenu)(player, config.allInOne ? undefined : items)
      return false
    }
  }

  return true
})
