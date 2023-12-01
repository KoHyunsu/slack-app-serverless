module.exports.register = (app) => {
  // Listens for an action from a button click
  app.action('button_click', async ({ body, ack, say }) => {
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
  });
};
