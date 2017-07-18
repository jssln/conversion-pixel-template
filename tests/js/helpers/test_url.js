const assert = require('assert');
const urlUtils = require('../../../src/js/helpers/url');

describe('url.js', () => {
  describe('serializeParams', () => {
    const input = {
      a: 'b',
      c: {
        d: 'e',
      },
      f: 1,
    };
    const expected = {
      a: 'b',
      c: '{"d":"e"}',
      f: 1,
    };
    assert.deepEqual(urlUtils.serializeParams(input), expected);
  });

  describe('buildUrl', () => {
    const stringWithQuotes = '{"d":"e"}';
    const encodedStringWithQuotes = encodeURIComponent(stringWithQuotes);
    assert.equal(
      urlUtils.buildUrl(
        'https://www.test.com/',
        {
          a: 'b',
          c: stringWithQuotes,
          f: 1,
        }
      ),
      `https://www.test.com/?a=b&c=${encodedStringWithQuotes}&f=1`
    );
  });
});
