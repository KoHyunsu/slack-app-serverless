module.exports.register = (app) => {
  app.message('hello', async ({ message, say }) => {
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `hello <@${message.user}>`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Click',
            },
            action_id: 'button_click',
          },
        },
      ],
      text: `hello <@${message.user}>`,
    });
  });
};
