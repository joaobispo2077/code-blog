const redis = require('redis');
const handleList = require('./handle-list');
const allowlist = redis.createClient({ prefix: 'allowlist-refresh-token:' });

module.exports = handleList(allowlist);