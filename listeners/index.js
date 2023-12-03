const actions = require('./actions');
const messages = require('./messages');

module.exports.registerListeners = (app) => {
  actions.register(app);
  messages.register(app);
};
