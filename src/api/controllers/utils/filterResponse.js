/**
 *
 * @param {Object} obj objeto
 * @param {Array} filter Array de string keys
 * @Returns {Object}
 */
module.exports = (obj, filter) => {
  const newObject = {};

  for (const key of filter) {
    if (!obj[key]) continue;
    newObject[key] = obj[key];
  }

  return newObject;
};
