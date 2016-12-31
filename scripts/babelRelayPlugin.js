const getBabelRelayPlugin = require('babel-relay-plugin');
const schema = require('../data/schema.json');

module.exports = { plugins: [getBabelRelayPlugin(schema.data)] };
