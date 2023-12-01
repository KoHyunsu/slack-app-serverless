module.exports.register = (app) => {
// Listens to incoming messages that contain "hello"
  app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Hey there <@${message.user}>!`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Click Me',
            },
            action_id: 'button_click',
          },
        },
      ],
      text: `Hey there <@${message.user}>!`,
    });
  });

  // Listens to incoming messages that contain "goodbye"
  app.message('goodbye', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`See ya later, <@${message.user}> :wave:`);
  });
};
