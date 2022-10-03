import { sleep } from "./sleep";

export const withMinLoadTime = async <R>(
  task: () => Promise<R>,
  minLoadTime?: number
): Promise<R> => {
  if (!minLoadTime) {
    return await task();
  }

  const taskResult = task();

  await Promise.allSettled([taskResult, sleep(minLoadTime)]);

  return await taskResult;
};
