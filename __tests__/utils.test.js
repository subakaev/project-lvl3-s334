import getFolderNameFromUrl from '../src/utils';

test('getFolderNameFromUrl test', () => {
  expect(getFolderNameFromUrl('http://example.com')).toEqual('example-com.html');
  expect(getFolderNameFromUrl('https://example.com')).toEqual('example-com.html');

  expect(getFolderNameFromUrl('http://example.com/test')).toEqual('example-com-test.html');

  expect(getFolderNameFromUrl('https://example.com/test?a=2&b=3')).toEqual('example-com-test-a-2-b-3.html');
});
