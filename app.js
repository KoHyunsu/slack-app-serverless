const { App, AwsLambdaReceiver, ExpressReceiver, LogLevel } = require('@slack/bolt');
const awsServerlessExpress = require('aws-serverless-express');
const { registerListeners } = require('./listeners');
const { store } = require('./utils/installationStore');

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
  scopes: [
    'app_mentions:read',
    'channels:history',
    'channels:join',
    'chat:write',
    'files:read',
    'groups:history',
    'im:history',
    'mpim:history',
  ],
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
      console.log('source : ', source);
      const queryResult = await store.fetchInstallation(source);
      if (queryResult === undefined) {
        throw new Error('Failed fetching data from the Installation Store');
      }
      const authorizeResult = {
        userToken: queryResult?.user?.token,
        teamId: queryResult?.team ? queryResult?.team?.id : source?.teamId,
        enterpriseId: queryResult?.enterprise ? queryResult?.enterprise?.id : source?.enterpriseId,
        botToken: queryResult?.bot ? queryResult?.bot?.token : undefined,
        botId: queryResult?.bot ? queryResult.bot.id : undefined,
        botUserId: queryResult?.bot ? queryResult.bot.userId : undefined,
      };
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
