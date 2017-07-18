import assert from 'assert';
import urlUtils from '../../../src/js/helpers/url';

describe('url.js', () => {
  describe('serializeParams', () => {
    it('serializes objects', () => {
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
  });

  describe('buildUrl', () => {
    it('builds a URL and does any necessary escaping', () => {
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
});
