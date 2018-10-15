import getFileNameFromUrl from '../src/utils';

test('getFolderNameFromUrl test', () => {
  expect(getFileNameFromUrl('http://example.com')).toEqual('example-com.html');
  expect(getFileNameFromUrl('https://example.com')).toEqual('example-com.html');

  expect(getFileNameFromUrl('http://example.com/test')).toEqual('example-com-test.html');

  expect(getFileNameFromUrl('https://example.com/test?a=2&b=3')).toEqual('example-com-test-a-2-b-3.html');
});
