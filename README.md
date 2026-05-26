# simple-async-fragmentation

对异步方法进行自动批处理/分片。将同一事件循环内的多次单独调用合并为一次批量调用，减少请求次数，提升性能。

## 安装

```bash
npm i simple-async-fragmentation
```

## 工作原理

```
调用(1) ─┐
调用(2) ─┼─▶ debounce ─▶ 批量处理([1,2,3]) ─▶ 结果分发
调用(3) ─┘
```

同一个事件循环（同步代码）中发起的多次调用会被自动收集，在下一个微任务中合并为一次批量处理，每个调用者独立获得对应的返回结果。

## 使用

### 基础用法 — 自动合并

不设置 `maxCount` 时，所有同步期内的调用会合并为一次：

```ts
import asyncFragmentation from 'simple-async-fragmentation';

const batchQuery = async (ids: number[]) => {
  // ids === [1, 2, 3]，只调用一次
  const results = await fetchItemsByIds(ids);
  return results;
};

const query = asyncFragmentation<number>(batchQuery);

const [r1, r2, r3] = await Promise.all([
  query(1),
  query(2),
  query(3),
]);
```

### 分片处理 — 设置 maxCount

设置 `maxCount` 后，每次批量处理最多处理指定数量的参数，超出部分自动分片：

```ts
import asyncFragmentation from 'simple-async-fragmentation';

let callCount = 0;
const batchQuery = async (ids: number[]) => {
  callCount++;
  return ids.map((id) => `result-${id}`);
};

const query = asyncFragmentation<number>(batchQuery, { maxCount: 2 });

const [r1, r2, r3, r4] = await Promise.all([
  query(1),
  query(2),
  query(3),
  query(4),
]);

// callCount === 2（分两次调用：[1,2] 和 [3,4]）
// r1 === 'result-1', r2 === 'result-2', r3 === 'result-3', r4 === 'result-4'
```

## API

### `asyncFragmentation<T>(handler, options?)`

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `handler` | `(params: T[]) => Promise<any[]>` | 批量处理函数，接收参数数组，返回对应的结果数组 |
| `options.maxCount` | `number` | 可选，每次批量处理的最大参数数量，超出自动分片 |

**返回值：** `(param: T) => Promise<any>` — 包装后的单参数调用函数

## 适用场景

- 批量查询接口（多个 ID 合并为一次请求）
- 数据库批量操作
- 需要合并短时间内的多次异步调用

## License

[MIT](./LICENSE)
