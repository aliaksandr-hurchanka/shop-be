import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basicAuthorizer';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    httpApi: {
      cors: {
        allowCredentials: true,
        allowedHeaders: ['Content-Type: application/json', 'Access-Control-Allow-Methods: *', 'Access-Control-Allow-Origin: *'],
        allowedOrigins: ['https://lse7wqxd9b.execute-api.eu-west-1.amazonaws.com'],
        allowedMethods: ['GET', 'POST']
      }
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      // SNS_TOPIC_CREATE_PRODUCT: { Ref: 'createProductTopic' },
    },
    iam: {
      role: {
        statements: [
          // {
          //   Effect: 'Allow',
          //   Action: ['dynamodb:*'],
          //   Resource: '*',
          // },
          // {
          //   Effect: 'Allow',
          //   Action: ['sqs:*'],
          //   Resource: [
          //     {
          //       'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
          //     },
          //   ],
          // },
          // {
          //   Effect: 'Allow',
          //   Action: ['sns:*'],
          //   Resource: {
          //     Ref: 'createProductTopic',
          //   },
          // },
        ]
      }
    }
  },
  // import the function via paths
  functions: { basicAuthorizer },
  resources: {
    Outputs: {
      BasicAuthorizerArn: {
        Value: {
          "Fn::GetAtt": ["BasicAuthorizerLambdaFunction", "Arn"],
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
