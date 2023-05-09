import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        authorizer: {
          name: "basicAuthorizer",
          arn: "arn:aws:lambda:eu-west-1:526744136662:function:authorization-service-dev-basicAuthorizer",
          type: "token",
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Authorization",
        },
      },
    },
  ],
};
