import { debounce, isNumber } from 'lodash';
import Deferred from 'simple-deferred2';

const asyncFragmentation = <T>(func: (params: T[]) => Promise<any[]>, options?: { maxCount?: number }) => {
  const queue: {deferred: Deferred<any>, param: T}[] = [];

  const debounceFunc = debounce(async () => {
    if (!options?.maxCount) {
      const _q = queue.splice(0, queue.length);
      const res = await func(_q.map(({ param }) => param));
      res.forEach((r, index) => {
        _q[index].deferred.resolve!(r);
      });
    } else if (isNumber(options?.maxCount)) {
      const fragmentationCount = Math.ceil(queue.length / options.maxCount); 

      for (let i = 0; i < fragmentationCount; i++) {
        const _q = queue.splice(0, options.maxCount);
        const res = await func(_q.map(({ param }) => param));
        res.forEach((r, index) => {
          _q[index].deferred.resolve!(r);
        });
      }
    }
  }, 0);

  return (param: T) => {
    const deferred: Deferred<any> = new Deferred();
    queue.push({
      deferred,
      param 
    });

    debounceFunc();

    return deferred.promise;
  };
};

export default asyncFragmentation;