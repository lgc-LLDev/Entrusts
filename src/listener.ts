import { config } from './config';
import { entrustMenu } from './form';
import { wrapAsyncFunc } from './util';

mc.listen('onUseItem', (player, item) => {
  const openableItems = Object.values(config.entrustItems).map((v) => v.type);
  if (openableItems.includes(item.type)) {
    wrapAsyncFunc(entrustMenu)(player, config.allInOne ? undefined : item.type);
    return false;
  }
  return true;
});
