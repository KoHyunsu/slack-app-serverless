const actions = require('./actions');
const events = require('./events');

module.exports.registerListeners = (app) => {
  actions.register(app);
  events.register(app);
};
