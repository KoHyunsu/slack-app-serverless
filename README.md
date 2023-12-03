# Serverless Slack App

## Software
- [Slack Bolt for JavaScript](https://github.com/SlackAPI/bolt-js)
- [AWS Lambda](https://aws.amazon.com/ko/lambda/)
- [Serverless](https://www.serverless.com/)

## Requirements

#### Create a Slack App
- Go to [slack api](https://api.slack.com/apps) dashboard
- Select **Create New App** -> **From scratch**
- Fill in the blank : **App Name**, Select **Workspace to develop your app in**
- Go to **[App Home]**
    - **App Display Name** -> Select **Edit**
        - Set **Display Name (Bot Name)**, **Default Name** 
        - Activate **Always Show My Bot as Online**
- Go to **[OAuth & Permissions]**
    - **Bot Token Scopes** - Add following scopes :
        <pre>
            'app_mentions:read',
            'channels:history',
            'channels:join',
            'chat:write',
            'files:read',
            'groups:history',
            'im:history',
            'mpim:history', 
        </pre>
    - **OAuth Tokens for Your Workspace**
        - Select **Install to Workspace**

#### Create a Database
- Go to [Amazon DocumentDB](https://aws.amazon.com/ko/documentdb/) or [MongoDB Atlas](https://www.mongodb.com/ko-kr/atlas) console
- Create a Cluster & a Database

#### Environment Variables
- Go to [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) console
- Store a new Secret
    - Secret Type : Other type of secret
        - Key/value pairs
        - SLACK_CLIENT_ID
            - how to find it
        - SLACK_CLEINT_SECRET
        - SLACK_SIGNING_SECRET
        - SLACK_BOT_TOKEN
        - DB_CONNECTION_URI
            - (example) mongodb+srv://username:password@cluster001.svc0voq.mongodb.net/?retryWrites=true&w=majority  
    - Encryption key : aws/secretsmanager
- Select **Next**
    - Secret name : slack/app/env
- Select **Next** -> **Next** -> **Store**


## Deployment
- Go to Terminal
    
    <code>git clone https://github.com/KoHyunsu/slack-app-serverless.git</code>
    
    <code>cd slack-app-serverless</code>

    <code>npm install</code>

    ( Install [aws-cli](https://aws.amazon.com/ko/cli/) )

    <code>aws configure</code>

    ( Set environment variables )
    - (Windows) 
        - change filename <code>sample.env.bat</code> -> <code>env.bat</code>
        - set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION, AWS_SECRET_NAME(from AWS Secrets Manager)
        - <code>call env.bat</code>
    - (Linux/MacOS) 
        - change filename <code>.sample.env</code> -> <code>.env</code>
        - set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION, AWS_SECRET_NAME(from AWS Secrets Manager) 
        - <code>source .env</code>

    <code>serverless deploy</code>

(if Service deployed to stack your app successfully)

- Copy https://~~~~/slack/events endpoints

- Go to [slack api](https://api.slack.com/apps) dashboard
    - Go to **Interactivity & Shortcuts**
        - Paste copied endpoints -> **Requeest URL**
        - Select **Save Changes**

    - Go to **Event Subscriptions**
        - **Off -> On**
        - Paste copied url -> **Request URL**
        - **Subscribe to bot events** - Add following scopes :
            <pre>
            'app_mention',
            'message.channels',
            'message.groups',
            'message.im',
            'message.mpim'
            </pre>
        - Select **Save Changes**

- Go to Terminal
    - Copy https://~~~~/slack/oauth_redirect

- Go to [slack api](https://api.slack.com/apps) dashboard
    - Go to **OAuth & Permissions**
        - Paste copied url -> **Redirect URLS**
        - Select **Add** -> **Save URLs**

    - Go to **Manage Distribution**
        - Select **Remove Hard Coded Information**
        - Activate **'I've reviewed and removed any hard-coded information'**
        - Selct **Activate Public Distribution**

- Go to Terminal
    - Find https://~~~~/slack/install and follow the link
    - Install slack app
    - Add app -> your channel
    - Send <code>'hello'</code> message 
