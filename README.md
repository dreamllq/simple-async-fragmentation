# simple-async-fragmentation

对一次任务周期的异步方法进行批处理/分片

## 安装

```
npm i simple-async-fragmentation
```

## 使用

### base

```ts
import asyncFragmentation from 'simple-async-fragmentation';

const handle = async (options) => {
  // options === [1,2,3] 一次调用
    return [
      'a',
      'b',
      'c'
    ];
  };

  const asyncFragmentationHandle = asyncFragmentation<number>(handle);

  const result = await Promise.all([
    asyncFragmentationHandle(1),
    asyncFragmentationHandle(2),
    asyncFragmentationHandle(3)
  ]);
  // result === ['a', 'b', 'c']
  
```

### 

```ts
import asyncFragmentation from 'simple-async-fragmentation';

let count = 0;
  const handle = async (options) => {
    // options===[1,2] 两次
    count++;
    return ['a', 'b'];
  };

  const asyncFragmentationHandle = asyncFragmentation<number>(handle, { maxCount: 2 });

  const result = await Promise.all([
    asyncFragmentationHandle(1),
    asyncFragmentationHandle(2),
    asyncFragmentationHandle(1),
    asyncFragmentationHandle(2)
  ]);
  // count === 2
  // result === ['a', 'b', 'a', 'b']
```
