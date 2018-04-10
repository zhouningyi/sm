

function getUniqueId(unique_id) {
  const timestamp = new Date().getTime() % (1000 * 3600 * 24);
  return `${unique_id}_${timestamp}`;
}

module.exports = {
  getUniqueId
};
