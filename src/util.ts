import { formatError } from 'form-api-ex';

/**
 * 延时
 * @param time 时长，单位 ms
 */
export function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * 输出错误到控制台
 * @param e 错误
 */
export function logError(e: unknown) {
  logger.error(formatError(e));
}

export function formatDate(
  options: {
    withTime?: boolean;
    date?: Date;
  } = {}
): string {
  const date = options.date ?? new Date();
  const withTime = options.withTime ?? true;

  const yr = date.getFullYear();
  const mon = date.getMonth() + 1;
  const day = date.getDate();
  let formatted = `${yr}-${mon}-${day}`;

  if (withTime) {
    const padNum = (n: number): string => n.toString().padStart(2, '0');

    const hr = date.getHours();
    const min = padNum(date.getMinutes());
    const sec = padNum(date.getSeconds());
    formatted += ` ${hr}:${min}:${sec}`;
  }

  return formatted;
}

export function countContainerItem(container: Container, itemType: string) {
  let count = 0;
  // log(container.getAllItems().map((v) => `${v.type}:${v.count}`));

  for (const it of container.getAllItems())
    if (it.type === itemType) count += it.count;

  return count;
}

export function removeContainerItem(
  container: Container,
  type: string,
  amount: number
) {
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

    if (removedCount >= amount) return;
  }
}

export function clearObject(obj: any): {} {
  // eslint-disable-next-line guard-for-in
  for (const k in obj) delete obj[k];
  return obj;
}
