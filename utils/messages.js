const moment = require('moment');

function formatMessage(user, text) {
  return { user, text, timestamp: moment().format('h:mm a') };
}

module.exports = formatMessage;
