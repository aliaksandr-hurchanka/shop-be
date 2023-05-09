import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'product',
        responseData: {
          200: {
            description: 'Successful operation',
            bodyType: 'Products',
          },
          404: 'Products not found',
          500: 'Server error',
        },
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