const { App, AwsLambdaReceiver, ExpressReceiver, LogLevel } = require('@slack/bolt');
const awsServerlessExpress = require('aws-serverless-express');
const { registerListeners } = require('./listeners');
const { store } = require('./store');

const db = require('./database/db');

db.connect();

// Initialize your receiver
const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const expressReceiver = new ExpressReceiver({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'made-by-hyunsuko',
  installerOptions: {
    stateVerification: false,
  },
  scopes: ['app_mentions:read', 'channels:history', 'chat:write', 'groups:history', 'im:history', 'mpim:history'],
  installationStore: store,
  logLevel: LogLevel.DEBUG,
});
const server = awsServerlessExpress.createServer(expressReceiver.app, null);

// Initializes your app with your bot token and the AWS Lambda ready receiver
const app = new App({
  receiver: awsLambdaReceiver,
  // token: process.env.SLACK_BOT_TOKEN,
  processBeforeResponse: true,
  authorize: async (source) => {
    try {
      const queryResult = await store.fetchInstallation(source);
      console.log(queryResult);
      if (queryResult === undefined) {
        throw new Error('Failed fetching data from the Installation Store');
      }
      const authorizeResult = {};
      authorizeResult.userToken = queryResult.user.token;
      if (queryResult.team !== undefined) {
        authorizeResult.teamId = queryResult.team.id;
      } else if (source.teamId !== undefined) {
        authorizeResult.teamId = source.teamId;
      }

      if (queryResult.enterprise !== undefined) {
        authorizeResult.enterpriseId = queryResult.enterprise.id;
      } else if (source.enterpriseId !== undefined) {
        authorizeResult.enterpriseId = source.enterpriseId;
      }

      if (queryResult.bot !== undefined) {
        authorizeResult.botToken = queryResult.bot.token;
        authorizeResult.botId = queryResult.bot.id;
        authorizeResult.botUserId = queryResult.bot.userId;
      }
      console.log(JSON.stringify(authorizeResult));
      return authorizeResult;
    } catch (error) {
      throw new Error(error.message);
    }
  },
});

// Register Listeners
registerListeners(app);

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};

module.exports.oauthHandler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
