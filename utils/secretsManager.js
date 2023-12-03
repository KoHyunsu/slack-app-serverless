const AWS = require('aws-sdk');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const REGION = process.env.AWS_DEFAULT_REGION || 'us-east-1';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: REGION,
});

const secretsManagerClient = new SecretsManagerClient({ region: REGION });

const getAllSecretsFromAws = async () => {
  try {
    const secretsManagerResponse = await secretsManagerClient.send(
      new GetSecretValueCommand({
        SecretId: process.env.AWS_SECRET_NAME,
        VersionStage: 'AWSCURRENT',
      }),
    );
    return JSON.parse(secretsManagerResponse.SecretString);
  } catch (error) {
    console.error(error);
  }
  return JSON.parse(process.env);
};

module.exports.getSecrets = async () => {
  const keys = await getAllSecretsFromAws();
  return {
    SLACK_BOT_TOKEN: keys.SLACK_BOT_TOKEN,
    SLACK_CLIENT_ID: keys.SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET: keys.SLACK_CLIENT_SECRET,
    SLACK_SIGNING_SECRET: keys.SLACK_SIGNING_SECRET,
    DB_CONNECTION_URI: keys.DB_CONNECTION_URI,
  };
};
