import { config } from './config';
import { entrustMenu } from './form';
import { wrapAsyncFunc } from './util';

mc.listen('onUseItem', (player, item) => {
  for (const eit of config.entrustItems) {
    if (
      (config.onlyUseOpenItem ? false : eit.type === item.type) ||
      eit.openItem.includes(item.type)
    ) {
      wrapAsyncFunc(entrustMenu)(
        player,
        config.allInOne ? undefined : item.type
      );
      return false;
    }
  }

  return true;
});
