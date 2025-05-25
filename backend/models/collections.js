// Placeholder for collections.js
const { getDB } = require('./db');

function getCollection(name) {
  return getDB().collection(name);
}

module.exports = { getCollection };