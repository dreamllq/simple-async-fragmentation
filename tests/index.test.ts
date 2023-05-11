// https://jestjs.io/zh-Hans/docs/api
import asyncFragmentation from '@/index';

test('base', async () => {
  const handle = async (options) => {
    expect(options).toEqual([
      1,
      2,
      3
    ]);
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

  expect(result).toEqual([
    'a',
    'b',
    'c'
  ]);
});

test('maxCount', async () => {
  let count = 0;
  const handle = async (options) => {
    count++;
    expect(options).toEqual([1, 2]);
    return ['a', 'b'];
  };

  const asyncFragmentationHandle = asyncFragmentation<number>(handle, { maxCount: 2 });

  const result = await Promise.all([
    asyncFragmentationHandle(1),
    asyncFragmentationHandle(2),
    asyncFragmentationHandle(1),
    asyncFragmentationHandle(2)
  ]);

  expect(count).toBe(2);
  expect(result).toEqual([
    'a',
    'b',
    'a',
    'b'
  ]);
});