crypto = require('crypto');
/**
 * Return random set of characters using sha1
 * @param {?number=} seedVal
 * @return {string}
 * @see http://goo.gl/iHAHxr
 */
function randomise(seedVal) {
  seedVal = seedVal || 20;
  var seed = crypto.randomBytes(seedVal);
  return crypto.createHash('sha1').update(seed).digest('hex');
}
module.exports = randomise;