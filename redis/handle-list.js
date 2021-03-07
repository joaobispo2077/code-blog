const { promisify } = require('util');

module.exports = list => {
  const setAsync = promisify(list.set).bind(list);
  const existsAsync = promisify(list.exists).bind(list);
  const getAsync = promisify(list.get).bind(list);
  const delAsync = promisify(list.del).bind(list);
  return {
    async addKey(key, value, expireDate) {
      await setAsync(key, value);
      list.expireat(key, expireDate);
    },
    async verifyKey(key) {
      const result = await existsAsync(key);
      return result === 1;
    },
    async getValueByKey(key) {
      return await getAsync(key);
    },
    async deleteByKey(key) {
      await delAsync(key);
    }
  }
}