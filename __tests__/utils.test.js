import getNameFromUrl from '../src/utils';

test('getFolderNameFromUrl test', () => {
  expect(getNameFromUrl('http://example.com/', '.html')).toEqual('example-com.html');
  expect(getNameFromUrl('https://example.com', '.html')).toEqual('example-com.html');

  expect(getNameFromUrl('http://example.com/test', '.html')).toEqual('example-com-test.html');

  expect(getNameFromUrl('https://example.com/test?a=2&b=3', '.html')).toEqual('example-com-test-a-2-b-3.html');
});
