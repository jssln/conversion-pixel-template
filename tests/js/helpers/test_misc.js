import assert from 'assert';
import miscUtils from '../../../src/js/helpers/misc';

describe('misc.js', () => {
  describe('getRandomString', () => {
    it('creates a random 5-character string', () => {
      assert.equal(miscUtils.getRandomString().length, 5);
    })
  });

  describe('isValidObject', () => {
    it('validates an object', () => {
      assert.equal(miscUtils.isValidObject({}), true);
    });

    it('does not validate a non-object', () => {
      assert.equal(miscUtils.isValidObject(null), false);
      assert.equal(miscUtils.isValidObject(), false);
      assert.equal(miscUtils.isValidObject("1"), false);
      assert.equal(miscUtils.isValidObject(1), false);
    });
  });
});
